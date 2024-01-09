import express from "express";
import { isAuthenticated } from "./middlewares/isAuthenticated";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// public routes
app.get("/hello", (req, res) => {
  res.send("Hi!");
});

app.get("/price", (req, res) => {
  res.send("999$");
});

// private routes
const router = express.Router();
router.use(isAuthenticated);

router.get("/hello", (req, res) => {
  res.send("Hello my my friend!");
});

router.get("/price", (req, res) => {
  res.send("5$ Special price for you, my friend!");
});

app.use("/private", router);

app.listen(port, () => {
  return console.log(`Express started at port ${port}`);
});
