import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { httpLogger } from "./config/logger";
import { openApiDocument } from "./config/openapi";
import { attachRequestContext } from "./middlewares/requestContext";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import healthRoutes from "./routes/healthRoutes";
import routes from "./routes";

export const app = express();

app.disable("x-powered-by");

app.use(httpLogger);
app.use(attachRequestContext);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/", healthRoutes);
app.use(env.API_PREFIX, routes);

app.use(notFoundHandler);
app.use(errorHandler);
