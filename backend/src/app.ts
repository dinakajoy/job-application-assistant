import express from "express";
import cors from "cors";
import jobRoutes from "./routes/job.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);

export default app;
