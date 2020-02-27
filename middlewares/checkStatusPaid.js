const app = require("express");
const order = require("../Models/orderModel");
const route = app.Router();

module.exports = function(req, res, next) {
  // Check status of order. if status is draft will move to next or reject
  order.findById(req.params._id).then(function(data) {
    if (data.status === "draft") {
      return next();
    }
    return res
      .status(403)
      .json("Sorry only draft status can be change to paid status");
  });
};
