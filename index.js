const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;

app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
