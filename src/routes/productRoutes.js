const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId
} = require("../controllers/Product/ProductController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createProduct);
router.get("/", authMiddlewareJWT, getAllProducts);
router.get("/:id", authMiddlewareJWT, getProductById);
router.put("/:id", authMiddlewareJWT, updateProduct);
router.delete("/:id", authMiddlewareJWT, deleteProduct);
router.get("/category/:category", authMiddlewareJWT, getProductsByCategoryId);

module.exports = router;
