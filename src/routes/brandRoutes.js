const express = require("express");
const {
    createBrand,
    // getAllBranches,
    // getBranchById,
    // updateBranch,
    // deleteBranch,
} = require("../controllers/brand/brandController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createBrand);
// router.get("/", authMiddlewareJWT, getAllBranches);
// router.get("/:id", authMiddlewareJWT, getBranchById);
// router.put("/:id", authMiddlewareJWT, updateBranch);
// router.delete("/:id", authMiddlewareJWT, deleteBranch);

module.exports = router;
