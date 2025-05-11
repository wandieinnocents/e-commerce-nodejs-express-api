const express = require("express");
const {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  // deleteProduct,
  // getByCategory
} = require("../controllers/supplier/supplierController");

const router = express.Router();

router.post("/", createSupplier,);
router.get("/", getAllSuppliers);
router.get("/:id", getSupplierById);
router.put("/:id", updateSupplier);
// router.delete("/:id", deleteProduct);
// router.get("/category/:category", getByCategory);

module.exports = router;
