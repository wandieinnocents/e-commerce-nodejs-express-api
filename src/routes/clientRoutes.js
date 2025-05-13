const express = require("express");
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  // deleteSupplier,
} = require("../controllers/client/clientController");

const router = express.Router();

router.post("/", createClient,);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
// router.delete("/:id", deleteSupplier);

module.exports = router;
