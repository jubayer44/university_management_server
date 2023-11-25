import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
