const express = require("express");
const {
    createUnit,
    getAllUnits,
    getUnitById,
    updateUnit,
    deleteUnit,
} = require("../controllers/Unit/UnitController");

const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createUnit);
router.get("/", authMiddlewareJWT, getAllUnits);
router.get("/:id", authMiddlewareJWT, getUnitById);
router.put("/:id", authMiddlewareJWT, updateUnit);
router.delete("/:id", authMiddlewareJWT, deleteUnit);

module.exports = router;
