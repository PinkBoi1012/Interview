const express = require("express");
const router = express.Router();
const productModel = require("../Models/productMoldel");
const orderModel = require("../Models/orderModel");
const checkPaidStatus = require("../middlewares/checkStatusPaid");
const checkDraftStatus = require("../middlewares/checkDraftStatus");
const checkCancelStatus = require("../middlewares/checkCancelStatus");
const validateOrder = require("../Validation/input-order-item");
//@route    POST /api/order/
//@desc     Create Order at draft status
//@access   Public
router.post("/", function(req, res) {
  const { error, isValid } = validateOrder(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  //Check amout of product more than amount
  productModel.findOne({ _id: req.body.productId }).then(data => {
    if (data.amountProduct < req.body.amountProduct) {
      return res.status(400).json({
        Message: `Product :'${data.productName}' only have '${data.amountProduct}.'}`
      });
    } else {
      let totalPriceProduct = req.body.amountProduct * data.priceProduct;
      // Create Order Item
      let orderLists = {
        _id: data._id,
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
      newOrder
        .save()
        .then(function(order) {
          res.status(200).json({
            Message: "New Order is create and have Draft status",
            order
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
});

//@route    PUT api/order/:_id
//@desc     Update Order at draft status
//@access   Public
router.put("/:_id", checkDraftStatus, function(req, res) {
  const { error, isValid } = validateOrder(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }
  //find order by _id
  orderModel.findById(req.params._id).then(function(order) {
    if (!order) {
      return res.status(404).json({ Message: "Order Not Found" });
    }
    // if orderList is empty and amountProduct is -
    if (order.orderList.length <= 0 && req.body.amountProduct < 0) {
      return res.status(400).json({ Message: "There are no product in order" });
    }

    // find order Item if exit + amount and + total price else create new Item and + total price
    let orderItem = order.orderList.id(req.body.productId);
    console.log(orderItem);
    if (!orderItem) {
      productModel.findById(req.body.productId).then(function(productInfo) {
        // Check amout product storage
        if (productInfo.amountProduct < req.body.amountProduct) {
          return res.status(400).json({
            Message: `Product :'${productInfo.productName}' only have '${productInfo.amountProduct}'.`
          });
        }

        let totalPriceProduct =
          req.body.amountProduct * productInfo.priceProduct;
        let newOrderItem = {
          _id: productInfo._id,
          amountOfEachProduct: parseInt(req.body.amountProduct),
          priceProduct: parseInt(productInfo.priceProduct),
          totalPriceProduct,
          nameProduct: productInfo.productName
        };

        order.orderList.push(newOrderItem);
        order.total = order.total + totalPriceProduct;

        order
          .save()
          .then(function(data) {
            if (data) return res.status(200).json(data);
            return res.status(400).json({ Message: "Update false" });
          })
          .catch(function(err) {
            return res.status(404).json(err);
          });
      });
    }

    // if have order Item
    // Check amout product storage
    productModel.findById(req.body.productId).then(function(productInfo) {
      orderItem.amountOfEachProduct =
        parseInt(orderItem.amountOfEachProduct) +
        parseInt(req.body.amountProduct);
      if (productInfo.amountProduct < orderItem.amountOfEachProduct) {
        return res.status(400).json({
          Message: `Product :'${productInfo.productName}' only have '${productInfo.amountProduct}'.`
        });
      }
      if (orderItem.amountOfEachProduct == 0) {
        var indexOrderItem = order.orderList
          .map(x => x._id)
          .indexOf(orderItem._id);
        order.orderList.splice(indexOrderItem, 1);
        order
          .save()
          .then(function(data) {
            if (data) return res.status(200).json(data);
            return res.status(400).json({ Message: "Update false" });
          })
          .catch(function(err) {
            return res.status(404).json(err);
          });
      } else {
        orderItem.totalPriceProduct =
          parseInt(orderItem.totalPriceProduct) +
          parseInt(req.body.amountProduct) * parseInt(orderItem.priceProduct);
        order.total =
          parseInt(order.total) +
          parseInt(req.body.amountProduct) * parseInt(orderItem.priceProduct);

        order
          .save()
          .then(function(data) {
            if (data) return res.status(200).json(data);
            return res.status(400).json({ Message: "Update false" });
          })
          .catch(function(err) {
            return res.status(404).json(err);
          });
      }
    });
  });
});

//@route    PUT /api/order/paid/:_id
//@desc     Paid order at paid status
//@access   Public
router.put("/paid/:_id", checkPaidStatus, function(req, res) {
  //To.. DO
  orderModel.findById(req.params._id).then(order => {
    // checkout and minimus the amount of product
    console.log(order.orderList);

    order.status = "paid";
    order
      .save()
      .then(data => {
        if (data) {
          return res.status(200).json({ Message: "Update Success", data });
        }
        return res.status(400).json({ Message: "Change Status Fail" });
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  });
});
//@route    PUT /api/order/cancelled/:_id
//@desc     Cancelled  order
//@access   Public
router.put("/cancelled/:_id", checkCancelStatus, function(req, res) {
  // if cancel + the amount of the product
  // Check validate
  const { error, isValid } = validateOrder(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  orderModel.findById(req.params._id).then(order => {
    order.status = "cancelled";
    order
      .save()
      .then(data => {
        if (data) {
          return res.status(200).json({ Message: "Update Success", data });
        }
        return res.status(400).json({ Message: "Change Cancel Fail" });
      })
      .catch(err => {
        return res.status(400).json(err);
      });
  });
});

//@route    GET /api/order
//@desc     Get all order
//@access   Public
router.get("/", function(req, res) {
  orderModel.find().then(data => {
    return res.status(200).json(data);
  });
});
module.exports = router;
