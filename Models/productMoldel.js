const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema Product

const productSchema = Schema(
  {
    productName: { type: String, require: true },
    amountProduct: { type: Number, require: true },
    priceProduct: { type: Number, require: true },
    productCode: { type: String, require: true }
  },
  { versionKey: false }
);

module.exports = mongoose.model("product", productSchema, "products");
