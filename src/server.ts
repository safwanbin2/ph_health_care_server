import { Server } from "http";
import app from "./app";
import config from "./app/config";

async function main() {
  let server: Server = app.listen(config.port, () => {
    console.log("server running on", config.port);
  });

  process.on("uncaughtException", (error) => {
    console.log(error);
    if (error) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    if (error) {
      server.close(() => {
        console.info("Server closed!");
      });
      process.exit(1);
    }
  });
}

main();
