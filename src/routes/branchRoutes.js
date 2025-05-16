const express = require("express");
const {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
} = require("../controllers/branch/branchController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createBranch);
router.get("/", getAllBranches);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.delete("/:id", deleteBranch);

module.exports = router;
