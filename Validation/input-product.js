const Validate = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddProductInput(data) {
  var error = {};

  data.productName = !isEmpty(data.productName) ? data.productName : "";
  data.amountProduct = !isEmpty(data.amountProduct) ? data.amountProduct : "";
  data.priceProduct = !isEmpty(data.priceProduct) ? data.priceProduct : "";
  data.productCode = !isEmpty(data.productCode) ? data.priceProduct : "";

  if (Validate.isEmpty(data.productName)) {
    error.productName = "Product name field is require";
  }
  if (Validate.isEmpty(data.amountProduct)) {
    error.amountProduct = "Amount of product field is require";
  }
  if (Validate.isEmpty(data.priceProduct)) {
    error.priceProduct = "Price of product field is require";
  }
  if (Validate.isEmpty(data.productCode)) {
    error.productCode = "Product code field is require";
  }
  if (Validate.isLength(data.amountProduct, { min: 1 })) {
    if (!Validate.isNumeric(data.amountProduct)) {
      error.amountProduct = "Amout of product must be numberic";
    }
  }
  if (Validate.isLength(data.priceProduct, { min: 1 })) {
    if (!Validate.isNumeric(data.priceProduct)) {
      error.priceProduct = "Price of product must be numberic";
    }
  }

  return { error, isValid: isEmpty(error) };
};
