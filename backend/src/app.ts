import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import compression from "compression";
import cors from "cors";
import jobRoutes from "./routes/job.route";
import corsOptions from "./utils/corsOptions";
import acountLimiter from "./utils/acountLimiter";

const app = express();

app.use(
  acountLimiter,
  cors(corsOptions),
  compression(),
  express.json({ limit: "6mb" }),
  express.urlencoded({ extended: true, limit: "6mb" })
);

app.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.use("/api/jobs", jobRoutes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: "error",
    error: err.message || err.error,
  });
});

export default app;
