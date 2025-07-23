/* eslint-disable no-console */
import express from "express";
import { CLOSE_DB, CONNECT_DB } from "./config/mongodb";
import exitHook from "async-exit-hook";
import { env } from "./config/environment";
import { API_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cors from "cors";

const START_SERVER = () => {
  const app = express();
  app.use(express.json());
  app.use(cors(corsOptions));

  app.use("/v1", API_V1);
  app.use(errorHandlingMiddleware);

  const hostname = env.APP_HOST;
  const port = env.APP_PORT;

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(`Hi Nam, server is running at ${process.env.PORT}`);
    });
  } else {
    app.listen(port, hostname, () => {
      console.log(`Hi Nam, server is running at ${hostname}:${port}/`);
    });
  }

  exitHook(() => {
    console.log("Exit App!");
    CLOSE_DB();
  });
};

CONNECT_DB()
  .then(() => START_SERVER())
  .catch((error) => {
    console.log(error);
    process.exit(0);
  });
