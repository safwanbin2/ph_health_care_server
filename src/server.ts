import { Server } from "http";
import app from "./app";

const port = 5000;

async function main() {
  let server: Server = app.listen(port, () => {
    console.log("server running on", port);
  });
}

main();
