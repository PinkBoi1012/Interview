const express = require("express");
const router = express.Router();
const productModel = require("../Models/productMoldel");
//import check valid Product
const validateInputProduct = require("../Validation/input-product");

//@route    POST /api/product/add
//@desc     Add new product
//@access   Public
router.post("/add", function(req, res) {
  // Check valid input
  const { error, isValid } = validateInputProduct(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  // Find if product is exist

  productModel
    .findOne({ productCode: req.body.productCode })
    .then(function(product) {
      //Check product exist if not save to db
      if (product) {
        return res.status(400).json({ Error: "Product already exist." });
      } else {
        var newProduct = new productModel({
          productName: req.body.productName,
          amountProduct: req.body.amountProduct,
          priceProduct: req.body.priceProduct,
          productCode: req.body.productCode
        });
        // Save new Product to Mongo Altat DB
        newProduct
          .save()
          .then(product => {
            res
              .status(201)
              .json({ Message: `New product save success`, data: product });
          })
          .catch(err => {
            res.status(404).json({ Message: err });
          });
      }
    });
});

//@route    GET /api/product
//@desc     Get all product
//@access   Public
router.get("/", function(req, res) {
  // Find all product
  productModel.find().then(function(product) {
    //Check product exist or not
    if (product) {
      res.status(200).json({ data: product });
    } else {
      res.status(404).json({ Message: "There are no product in database " });
    }
  });
});

//@route    GET /api/product/:productCode
//@desc     Search product by product Code
//@access   Public
router.get("/:productCode", function(req, res) {
  productModel
    .find({
      productCode: new RegExp(req.params.productCode, "i")
    })
    .then(function(products) {
      if (products) {
        return res.status(200).json({ data: products });
      } else {
        return res
          .status(404)
          .json({ Message: "There is no exist product have that name" });
      }
    })
    .catch(function(err) {
      return res.status(404).json(err);
    });
});

//@route      PUT /api/product/:productCode
//@desc       Update by productCode
//@access     Public

router.put("/:productCode", function(req, res) {
  //Check validate input
  var { error, isValid } = validateInputProduct(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  var updateProduct = {
    productName: req.body.productName,
    amountProduct: req.body.amountProduct,
    priceProduct: req.body.priceProduct,
    productCode: req.body.productCode
  };

  productModel
    .findOneAndUpdate({ productCode: req.params.productCode }, updateProduct)
    .then(function(data) {
      console.log(data);
      if (data) {
        return res
          .status(200)
          .json({ Message: "Update Product Success", updateProduct });
      }
      return res.status(400).json({ Message: "Update product fail" });
    })
    .catch(err => {
      return res.status(400).json({ Error: err });
    });
});

//@route      DELETE /api/product/:productCode
//@desc       Delete product by product code
//@access     Public
router.delete("/:productCode", function(req, res) {
  productModel.findOneAndDelete(
    { productCode: req.params.productCode },
    function(err, offer) {
      if (err) {
        return res.status(400).json({ Error: err });
      } else {
        return res.status(200).json({ Message: "DeleteSuccess" });
      }
    }
  );
});

module.exports = router;
