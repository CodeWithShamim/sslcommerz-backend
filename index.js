const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;
const sslRouter = require("./routes/ssl.route");

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/v1/ssl", sslRouter);

app.listen(port, () => {
  console.log("Listening to port", port);
});
