import ServerSetup from "./server.setup";

function bootstrap(): void {
    const server = new ServerSetup(3000);
    server.start();
}

bootstrap();
