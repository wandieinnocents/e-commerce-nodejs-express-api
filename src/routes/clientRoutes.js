const express = require("express");
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/client/clientController");
const authMiddlewareJWT = require('../middlewares/auth/authMiddleware');

const router = express.Router();

router.post("/", authMiddlewareJWT, createClient,);
router.get("/", authMiddlewareJWT, getAllClients);
router.get("/:id", authMiddlewareJWT, getClientById);
router.put("/:id", authMiddlewareJWT, updateClient);
router.delete("/:id", authMiddlewareJWT, deleteClient,);

module.exports = router;
