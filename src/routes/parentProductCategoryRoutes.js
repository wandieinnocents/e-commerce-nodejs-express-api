const express = require("express");
const {
    createParentProductCategory,
    getAllParentProductCategories,
    getParentProductCategoryById,
    updateParentProductCategory,
    deleteParentProductCategory,
} = require("../controllers/parentProductCategory/parentProductCategoryController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createParentProductCategory);
router.get("/", authMiddlewareJWT, getAllParentProductCategories);
router.get("/:id", authMiddlewareJWT, getParentProductCategoryById);
router.put("/:id", authMiddlewareJWT, updateParentProductCategory);
router.delete("/:id", authMiddlewareJWT, deleteParentProductCategory);

module.exports = router;
