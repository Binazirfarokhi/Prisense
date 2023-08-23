
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  store: String,
  branch: String,
  brand: String,
  name: String,
  price: Number,
  package: Number,
  unit: String,
  price_per_unit: String,
  price_compare_quantity: String,
  price_compare_unit: String,
  update_date: Date
},{
  timestamps: true
});

const ProductModel = mongoose.model('Product', ProductSchema);

const MyProductModel = mongoose.model("MyProduct", ProductSchema);

module.exports = {
  ProductModel,
  MyProductModel
}