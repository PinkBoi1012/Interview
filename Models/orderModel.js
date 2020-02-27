const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema of order

const orderModel = new Schema(
  {
    status: { type: String },
    amount: { type: Number },
    orderList: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "product" },
        amountOfEachProduct: { type: Number },
        priceProduct: { type: Number },
        totalPriceProduct: { type: Number },
        nameProduct: { type: String }
      }
    ],
    total: { type: Number, default: 0 }
  },
  { versionKey: false }
);

module.exports = mongoose.model("order", orderModel, "orders");
