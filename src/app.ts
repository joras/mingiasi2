import express from "express";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import {
  createIPRateLimiter,
  createSecretTokenRateLimiter,
} from "./middlewares/ratelimit";
const app = express();
const port = 3000;

const publicRouter = express.Router();
publicRouter.use(createIPRateLimiter(10, "second"));

// public routes
publicRouter.get("/hello", (req, res) => {
  res.send("Hi!");
});

publicRouter.get("/price", (req, res) => {
  res.send("999$");
});

// private routes
const privateRouter = express.Router();
privateRouter.use(isAuthenticated);
privateRouter.use(createSecretTokenRateLimiter(100));

privateRouter.get("/hello", (req, res) => {
  res.send("Hello my my friend!");
});

privateRouter.get("/price", (req, res) => {
  res.send("5$ Special price for you, my friend!");
});

app.set("trust proxy", true);
app.use("/", publicRouter);
app.use("/private", privateRouter);

app.listen(port, () => {
  return console.log(`Express started at port ${port}`);
});
