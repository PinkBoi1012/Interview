const express = require("express");
const router = express.Router();
const productModel = require("../Models/productMoldel");
const orderModel = require("../Models/orderModel");

// status: { type: String },
// amount: { type: Number },
// orderList: [
//   { productID: { type: Schema.Types.ObjectId, ref: product } },
//   { amountOfEachProduct: { type: Number } },
//   { priceProduct: { type: Number } },
//   { totalPriceProduct: { type: Number } }
// ],

// total: { type: Number }

//@route    POST /api/order/
//@desc     Create Order at draft status
//@access   Public
router.post("/", async function(req, res) {
  //Check amout of product more than amount
  productModel.findOne({ _id: req.body.productId }).then(data => {
    if (data.amountProduct < req.body.amountProduct) {
      return res.status(400).json({
        Message: `Product :'${data.productName}' only have '${data.amountProduct}.'}`
      });
    } else {
      let totalPriceProduct = req.body.amountProduct * data.priceProduct;

      let orderLists = {
        productID: data._id,
        amountOfEachProduct: req.body.amountProduct,
        priceProduct: data.priceProduct,
        totalPriceProduct,
        nameProduct: data.productName
      };

      let newOrder = new orderModel({
        status: "draft",
        orderList: []
      });
      let totals = newOrder.total + req.body.amountProduct * data.priceProduct;
      newOrder.total = totals;
      newOrder.orderList.push(orderLists);
      res.json(newOrder);
    }
  });
});

//@route    PUT /api/order/:_id
//@desc     Update Order at draft status
//@access   Public
router.put("/:_id", function(req, res) {
  //To.. DO
});

//@route    PUT /api/order/paid/:_id
//@desc     Paid order at paid status
//@access   Public
router.put("/paid/:_id", function(req, res) {
  //To.. DO
});
//@route    PUT /api/order/:_id
//@desc     Cancled  order
//@access   Public
router.delete("/:_id", function(req, res) {
  //To.. DO
  //  If status = Draft
  //If status = paid
});
module.exports = router;
