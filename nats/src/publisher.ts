import { connect } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  stan.publish("ticket:created", "nguyendai.dev@gmail.com", (error) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("Event already published");
  });
});
