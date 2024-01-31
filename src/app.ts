import express, { Application } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
