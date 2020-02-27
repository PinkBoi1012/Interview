const Validate = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddProductInput(data) {
  var error = {};
  data.productId = !isEmpty(data.productId) ? data.productId : "";
  data.amountProduct = !isEmpty(data.amountProduct) ? data.amountProduct : "";

  if (Validate.isEmpty(data.productId)) {
    error.productId = "Product ID is require";
  }
  if (Validate.isEmpty(data.amountProduct)) {
    error.amountProduct = "Amount of product field is require";
  }

  return { error, isValid: isEmpty(error) };
};
