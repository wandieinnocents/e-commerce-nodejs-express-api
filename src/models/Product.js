const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    img: String,
    quantity: Number,
    price: Number,
});

module.exports = mongoose.model("Product", productSchema);
