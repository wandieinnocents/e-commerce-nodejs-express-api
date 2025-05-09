const Product = require("../models/Product");

const createProduct = async (req, res) => {
    const { title, description, category, img, quantity, price } = req.body;
    if (!title || !description || !category || !img || !quantity || !price) {
    return res.status(401).json({ message: "All fields are required" });
  }

  try {
    const existing = await Product.findOne({ title });
    if (existing) return res.status(401).json({ message: "Product already exists" });

    const newProduct = await Product.create({ title, description, category, img, quantity, price });
    res.status(201).json({ newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
      try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, img, quantity, price } = req.body;
  try {
    const updated = await Product.findByIdAndUpdate(id, { title, description, category, img, quantity, price }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getByCategory
};
