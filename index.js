const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.port || 5000;
const sslRouter = require("./routes/ssl.route");

app.use(express.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extented: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Working");
});

app.use("/api/v1/ssl", sslRouter);

app.listen(port, () => {
  console.log("Listening to port", port);
});
