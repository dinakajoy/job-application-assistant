import dotenv from "dotenv-safe";

dotenv.config();

export default {
  environment: {
    port: Number(String(process.env.PORT)) || 1337,
    apiKey: String(process.env.OPENAI_API_KEY) || "",
  },
};
