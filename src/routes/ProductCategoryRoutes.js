const express = require("express");
const {
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory,
} = require("../controllers/ProductCategory/ProductCategoryController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createProductCategory);
router.get("/", authMiddlewareJWT, getAllProductCategories);
router.get("/:id", authMiddlewareJWT, getProductCategoryById);
router.put("/:id", authMiddlewareJWT, updateProductCategory);
router.delete("/:id", authMiddlewareJWT, deleteProductCategory);

module.exports = router;
