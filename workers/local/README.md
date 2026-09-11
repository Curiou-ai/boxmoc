
## 🛠️ Step 1: Optimizing the Code for a Local Linux Server
When running on a low-power dedicated machine like a Raspberry Pi, it is critical to handle edge cases like printer disconnects or sudden MQTT dropouts so the entire loop doesn't freeze or crash silently.
Replace your current code with this production-ready variation:
```typescript
// src/lib/orchestrator.tsimport { PrismaClient, PrintStatus } from '@prisma/client';import mqtt from 'mqtt';
const prisma = new PrismaClient();
// Bambu Lab P1S Local MQTT Configurationconst BAMBU_PRINTER_IP = process.env.BAMBU_PRINTER_IP || '192.168.1.100';const BAMBU_ACCESS_CODE = process.env.BAMBU_ACCESS_CODE || 'your_access_code';const BAMBU_SERIAL = process.env.BAMBU_SERIAL || '01S00A12345678';
// Connect securely to your local Bambu Lab P1S MQTT Broker over TLS/WSSconst mqttClient = mqtt.connect(`mqtts://${BAMBU_PRINTER_IP}:8883`, {
  username: 'bblp',
  password: BAMBU_ACCESS_CODE,
  rejectUnauthorized: false, // Required for Bambu self-signed certs
  reconnectPeriod: 5000,     // CRITICAL FOR PI: Automatically retry connection every 5 seconds if Wi-Fi blips
  connectTimeout: 30 * 1000, 
});
// Telemetry State Cachelet printerState = {
  gcode_state: 'UNKNOWN', // Initialized safely to prevent accidental triggers during boot
  chamber_temp: 0,
  nozzle_temp: 0,
  is_connected: false,
};
// 1. Subscribe and Listen to Live Telemetry from the P1S
mqttClient.on('connect', () => {
  console.log('📡 Successfully connected to Bambu Lab P1S MQTT Broker');
  printerState.is_connected = true;
  mqttClient.subscribe(`device/${BAMBU_SERIAL}/report`);
});
// CRITICAL FOR PI: Handle disconnection events gracefully instead of crashing
mqttClient.on('offline', () => {
  console.warn('⚠️ Lost local connection to Bambu Lab P1S network. Reconnecting...');
  printerState.is_connected = false;
  printerState.gcode_state = 'UNKNOWN'; 
});

mqttClient.on('error', (err) => {
  console.error('MQTT Client Connection Error:', err);
});

mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    if (payload.print) {
      if (payload.print.gcode_state) printerState.gcode_state = payload.print.gcode_state;
      if (payload.print.chamber_temper) printerState.chamber_temp = payload.print.chamber_temper;
      if (payload.print.nozzle_temper) printerState.nozzle_temp = payload.print.nozzle_temper;
    }
  } catch (err) {
    console.error('Error parsing MQTT payload:', err);
  }
});
// 2. THE ORCHESTRATOR LOOP (Executes Every 10 Seconds)export async function startOrchestrator() {
  console.log('🤖 Automated 3D Print Orchestrator Worker Activated.');
  
  setInterval(async () => {
    try {
      console.log(`Checking fleet status... Connected: ${printerState.is_connected} | State: ${printerState.gcode_state} | Chamber: ${printerState.chamber_temp}°C`);

      // NEW GUARD RAIL: Connection Validation Check
      if (!printerState.is_connected || printerState.gcode_state === 'UNKNOWN') {
        console.log('Waiting for active printer communication stream... Standing by.');
        return;
      }

      // GUARD RAIL 1: Thermal Overheating Check
      if (printerState.chamber_temp >= 45) {
        console.warn('⚠️ GUARD RAIL TRIGGERED: Chamber is too hot (>= 45°C). Throttling execution to safeguard hardware.');
        return; 
      }

      // GUARD RAIL 2: Capacity / Availability Check
      if (printerState.gcode_state !== 'IDLE' && printerState.gcode_state !== 'FINISH') {
        console.log('Printer is currently occupied. Standing by in queue...');
        return;
      }

      // 3. Fetch the Next Valid Order from PostgreSQL Queue
      const nextOrder = await prisma.order.findFirst({
        where: { printStatus: PrintStatus.PENDING },
        orderBy: { paidAt: 'asc' },
        include: { design: true }
      });

      if (!nextOrder) {
        return;
      }

      // 4. Send the Command directly to the Bambu Lab P1S via MQTT
      console.log(`🚀 Dispatching Order ${nextOrder.shopifyOrderName} directly to Printer!`);
      
      const printCommand = {
        print: {
          sequence_id: Math.floor(Math.random() * 100000).toString(),
          command: 'project_file',
          param: `Metadata/slice.gcode`, 
          url: nextOrder.gcodeUrl,       
          subtask_name: `Order-${nextOrder.shopifyOrderName}`,
        }
      };

      mqttClient.publish(
        `device/${BAMBU_SERIAL}/request`,
        JSON.stringify(printCommand),
        { qos: 1 }
      );

      // 5. Update Database Record Status immediately
      await prisma.order.update({
        where: { id: nextOrder.id },
        data: { printStatus: PrintStatus.PRINTING }
      });

      console.log(`Database state updated: Order ${nextOrder.shopifyOrderName} is now PRINTING.`);

    } catch (error) {
      console.error('Fatal crash in Orchestrator loop:', error);
    }
  }, 10000); 
}
```
------------------------------
## 📦 Step 2: Deploying as a Permanent Background Daemon (PM2)
If you simply run this file using npm run dev or node orchestrator.js via your terminal, the script will die the moment you disconnect your computer from the Raspberry Pi.
To turn it into an indestructible background service that boots instantly when the Raspberry Pi turns on, you will use PM2 (Process Manager 2).
## 1. Install Node and PM2 onto your Raspberry Pi terminal
SSH into your Raspberry Pi and run these commands to install your system tools:
```bash
# Update system repositories
sudo apt update && sudo apt upgrade -y
# Install Node.js (Version 20+)
curl -fsSL https://nodesource.com | sudo -E AM_I_ROOT=1 bash -
sudo apt-get install -y nodejs
# Install PM2 globally
sudo npm install pm2@latest -g
```
## 2. Compile and Start the Script
Navigate into your code project directory on your Pi and execute your production startup trigger:
```bash
# Build your production javascript files from typescript
npm run build
# Start your background process with PM2
pm2 start dist/lib/orchestrator.js --name "box-print-orchestrator"
```

## 3. Enforce Boot-on-Startup Guardrails
If your power goes out in your workshop and the Raspberry Pi reboots, you want the script to wake back up automatically without you having to manually log back into a terminal. Run this configuration command:
```bash
# Generate the automated Linux systemd hook script
pm2 startup
```
(Copy and paste the exact command outputted onto your terminal screen by the prompt above to save the root permission configurations).

Finally, freeze your environment settings into the memory bank:
```bash
pm2 save
```
------------------------------
## 📊 Checking Your Live Workshop Operations
Your local system is now fully live and autonomous. You can run these quick command queries directly on your Raspberry Pi terminal to verify its performance metrics anytime:

* pm2 status — Shows if your loop worker is up, operating cleanly, or consuming resources.
* pm2 logs box-print-orchestrator — Displays your live MQTT streams, temperature readouts, and incoming database orders in real time.


