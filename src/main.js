import { logger } from "./application/logging.js";
import { web } from "./application/web.js";

web.listen(3000, '0.0.0.0', () => {
    logger.info("server running on port 3000");
});