const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: new Date().toISOString() },
    updateDate: { type: Date, default: new Date().toISOString() },
  },
  {
    versionKey: false,
  }
);

productSchema.virtual("totalValue").get(function () {
  return this.price * this.quantity;
});

module.exports = productSchema;
