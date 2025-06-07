const express = require("express");
const {
    createBranch,
    getAllBranches,
    getActiveBranches,
    getInActiveBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
} = require("../controllers/branch/branchController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createBranch);
router.get("/", authMiddlewareJWT, getAllBranches);
router.get("/active", authMiddlewareJWT, getActiveBranches);
router.get("/inactive", authMiddlewareJWT, getInActiveBranches);
router.get("/:id", authMiddlewareJWT, getBranchById);
router.put("/:id", authMiddlewareJWT, updateBranch);
router.delete("/:id", authMiddlewareJWT, deleteBranch);

module.exports = router;
