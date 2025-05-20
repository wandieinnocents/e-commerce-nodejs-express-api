const express = require("express");
const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    // deleteBranch,
} = require("../controllers/brand/brandController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createBrand);
router.get("/", authMiddlewareJWT, getAllBrands);
router.get("/:id", authMiddlewareJWT, getBrandById);
router.put("/:id", authMiddlewareJWT, updateBrand);
// router.delete("/:id", authMiddlewareJWT, deleteBranch);

module.exports = router;
