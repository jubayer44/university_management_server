import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import { Server } from "http";
const port = config.port || 5000;

let server: Server;

async function main() {
  try {
    // await mongoose.connect("mongodb://127.0.0.1:27017/first_project" as string);
    await mongoose.connect(config.databaseUrl as string);
    server = app.listen(port, () => {
      console.log(`server is running on ${port}`); //eslint-disable-line
    });
  } catch (error) {
    console.log(error); //eslint-disable-line
  }
}

main();

process.on("unhandledRejection", () => {
  console.log("unhandledRejection"); //eslint-disable-line
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log("uncaughtException"); //eslint-disable-line
  process.exit(1);
});
