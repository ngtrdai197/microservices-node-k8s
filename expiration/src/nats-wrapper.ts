import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;
  private static instance: NatsWrapper;
  constructor() {}

  public static getInstance(): NatsWrapper {
    if (!NatsWrapper.instance) {
      NatsWrapper.instance = new NatsWrapper();
    }
    return NatsWrapper.instance;
  }

  public get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  public connect(params: { clusterId: string; clientId: string; url: string }) {
    const { clusterId, clientId, url } = params;
    this._client = nats.connect(clusterId, clientId, { url });
    this._handleDisconnected();

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }

  private _handleDisconnected(): void {
    this.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => this.client.close());
    process.on("SIGTERM", () => this.client.close());
  }
}

export const natsInstance = NatsWrapper.getInstance();
