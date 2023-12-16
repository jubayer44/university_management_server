import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
