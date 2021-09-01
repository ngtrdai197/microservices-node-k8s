import { connect, Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");
  const options = stan.subscriptionOptions().setManualAckMode(true);
  stan
    .subscribe("ticket:created", "ticket-queue-group", options)
    .on("message", (msg: Message) => {
      console.log("Listener received: ", msg.getData());
      msg.ack();
    });
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
