import { connect } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "@dnt-ticketing-mvc/common";

console.clear();

const stan = connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
});
