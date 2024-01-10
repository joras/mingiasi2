import express from "express";

import { config, loadConfig } from "./config";
loadConfig();

import { publicRoutes } from "./routes/public";
import { privateRoutes } from "./routes/private";

const app = express();
app.set("trust proxy", true);

// attach routes
app.use("/", publicRoutes);
app.use("/private", privateRoutes);

// start server
const port = config.PORT;
app.listen(port, () => {
  return console.log(renderServerMessage(port));
});

function renderServerMessage(port: number) {
  const configText = Object.entries(config)
    .map(([key, value]) => `\t${key}: \t${value}`)
    .join("\n");

  return `Express started at port ${port}, with following config \n ${configText}`;
}
