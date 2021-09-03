import ServerSetup from "./server.setup";

async function bootstrap(): Promise<void> {
  const server = new ServerSetup(3000);
  server.start();
}

bootstrap();
