const express = require("express");
const {
    createProductCategory,
    // getAllParentProductCategories,
    // getParentProductCategoryById,
    // updateParentProductCategory,
    // deleteParentProductCategory,
} = require("../controllers/ProductCategory/ProductCategoryController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createProductCategory);
// router.get("/", authMiddlewareJWT, getAllParentProductCategories);
// router.get("/:id", authMiddlewareJWT, getParentProductCategoryById);
// router.put("/:id", authMiddlewareJWT, updateParentProductCategory);
// router.delete("/:id", authMiddlewareJWT, deleteParentProductCategory);

module.exports = router;
