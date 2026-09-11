// src/lib/orchestrator.ts
//Raspberry PI Server
import { PrismaClient, PrintStatus } from '@prisma/client';
import mqtt from 'mqtt';

const prisma = new PrismaClient();

// Bambu Lab P1S Local MQTT Configuration
const BAMBU_PRINTER_IP = process.env.BAMBU_PRINTER_IP || '192.168.1.100';
const BAMBU_ACCESS_CODE = process.env.BAMBU_ACCESS_CODE || 'your_access_code';
const BAMBU_SERIAL = process.env.BAMBU_SERIAL || '01S00A12345678';

// Connect securely to your local Bambu Lab P1S MQTT Broker over TLS/WSS
const mqttClient = mqtt.connect(`mqtts://${BAMBU_PRINTER_IP}:8883`, {
  username: 'bblp',
  password: BAMBU_ACCESS_CODE,
  rejectUnauthorized: false, // Required for Bambu self-signed certs
  reconnectPeriod: 5000,     // CRITICAL FOR PI: Automatically retry connection every 5 seconds if Wi-Fi blips
  connectTimeout: 30 * 1000, 
});

// Telemetry State Cache
let printerState = {
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

// 2. THE ORCHESTRATOR LOOP (Executes Every 10 Seconds)
export async function startOrchestrator() {
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
