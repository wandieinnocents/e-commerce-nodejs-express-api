const express = require("express");
const {
    createParentProductCategory,
    getAllParentProductCategories,
    // getBrandById,
    // updateBrand,
    // deleteBrand,
} = require("../controllers/parentProductCategory/parentProductCategoryController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createParentProductCategory);
router.get("/", authMiddlewareJWT, getAllParentProductCategories);
// router.get("/:id", authMiddlewareJWT, getBrandById);
// router.put("/:id", authMiddlewareJWT, updateBrand);
// router.delete("/:id", authMiddlewareJWT, deleteBrand);

module.exports = router;
