import config from "config";
import app from "./app";
import logger from "./utils/logger";

const PORT = config.get("environment.port") as number;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
