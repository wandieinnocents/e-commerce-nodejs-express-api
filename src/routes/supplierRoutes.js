const express = require("express");
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplier/supplierController");
const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createSupplier,);
router.get("/", authMiddlewareJWT, getAllSuppliers);
router.get("/:id", authMiddlewareJWT, getSupplierById);
router.put("/:id", authMiddlewareJWT, updateSupplier);
router.delete("/:id", authMiddlewareJWT, deleteSupplier);

module.exports = router;
