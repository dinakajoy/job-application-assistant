import { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "https://job-application-assistant.vercel.app",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed"), false);
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
