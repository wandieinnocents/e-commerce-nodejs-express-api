const express = require("express");
const {
    createStaffPosition,
    getAllStaffPositions,
    getStaffPositionById,
    updateStaffPosition,
    deleteStaffPosition,
} = require("../controllers/staffPosition/staffPositionController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createStaffPosition);
router.get("/", authMiddlewareJWT, getAllStaffPositions);
router.get("/:id", authMiddlewareJWT, getStaffPositionById);
router.put("/:id", authMiddlewareJWT, updateStaffPosition);
router.delete("/:id", authMiddlewareJWT, deleteStaffPosition);

module.exports = router;