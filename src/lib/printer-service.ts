import mqtt from 'mqtt';

/**
 * Production-ready service to communicate directly with Bambu Lab P1S 3D printers.
 * Used for the MVP Showcase to trigger prints immediately from the dashboard.
 */
export class PrinterService {
  private static instance: PrinterService;
  private client: mqtt.MqttClient | null = null;

  private constructor() {
    const ip = process.env.BAMBU_PRINTER_IP;
    const accessCode = process.env.BAMBU_ACCESS_CODE;

    if (ip && accessCode) {
      this.client = mqtt.connect(`mqtts://${ip}:8883`, {
        username: 'bblp',
        password: accessCode,
        rejectUnauthorized: false,
        reconnectPeriod: 5000,
      });

      this.client.on('connect', () => {
        console.log('Printer Service: Connected to Bambu Lab Broker');
      });

      this.client.on('error', (err) => {
        console.error('Printer Service Error:', err);
      });
    }
  }

  public static getInstance(): PrinterService {
    if (!PrinterService.instance) {
      PrinterService.instance = new PrinterService();
    }
    return PrinterService.instance;
  }

  /**
   * Dispatches a print command to a specific printer serial.
   */
  public async sendPrintCommand(serial: string, gcodeUrl: string, taskName: string): Promise<boolean> {
    if (!this.client || !this.client.connected) {
      console.warn('Printer Service: Client not connected. Command aborted.');
      return false;
    }

    const payload = {
      print: {
        sequence_id: Math.floor(Math.random() * 100000).toString(),
        command: 'project_file',
        param: `Metadata/slice.gcode`,
        url: gcodeUrl,
        subtask_name: taskName,
      }
    };

    return new Promise((resolve) => {
      this.client!.publish(
        `device/${serial}/request`,
        JSON.stringify(payload),
        { qos: 1 },
        (err) => {
          if (err) {
            console.error('Failed to publish print command:', err);
            resolve(false);
          } else {
            console.log(`Print command dispatched: ${taskName}`);
            resolve(true);
          }
        }
      );
    });
  }
}

export const printerService = PrinterService.getInstance();
