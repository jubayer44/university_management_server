import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
const port = config.port || 5000;

async function main() {
  try {
    await mongoose.connect(config.databaseUrl as string);
    app.listen(port, () => {
      console.log(`server is running on ${port}`); //eslint-disable-line
    });
  } catch (error) {
    console.log(error); //eslint-disable-line
  }
}

main();