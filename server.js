const express = require("express");
const app = express();
const key = require("./config/key");
const mongoose = require("mongoose");
const db = require("./config/key").mongoURL;
const bodyParser = require("body-parser");
//import Product Route
const productRoute = require("./Routes/productRoute");
//import Order Route
const orderRoute = require("./Routes/orderRoute");
var port = key.port || 8080;

// Connect altas DB using mongoose
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(message => {
    console.log("Mongodb is connect");
  })
  .catch(error => {
    console.log(error);
  });

// config body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Product Router URL config
app.use("/api/product", productRoute);
// Order Router URL config
app.use("/api/order", orderRoute);

app.listen(port, function() {
  console.log(`API is running on port ${port}`);
});
