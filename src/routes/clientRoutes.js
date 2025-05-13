const express = require("express");
const {
  createClient,
  getAllClients,
  // getSupplierById,
  // updateSupplier,
  // deleteSupplier,
} = require("../controllers/client/clientController");

const router = express.Router();

router.post("/", createClient,);
router.get("/", getAllClients);
// router.get("/:id", getSupplierById);
// router.put("/:id", updateSupplier);
// router.delete("/:id", deleteSupplier);

module.exports = router;
