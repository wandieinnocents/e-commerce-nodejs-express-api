const express = require("express");
const {
  createSupplier,
  // getAllProducts,
  // getProductById,
  // updateProduct,
  // deleteProduct,
  // getByCategory
} = require("../controllers/supplier/supplierController");

const router = express.Router();

router.post("/", createSupplier,);
// router.get("/", getAllProducts);
// router.get("/:id", getProductById);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);
// router.get("/category/:category", getByCategory);

module.exports = router;
