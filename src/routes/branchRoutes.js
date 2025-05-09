const express = require("express");
const {
    createBranch,
    getAllBranches,
    //   getProductById,
    //   updateProduct,
    //   deleteProduct,
    //   getByCategory
} = require("../controllers/branchController");

const router = express.Router();

router.post("/", createBranch);
router.get("/", getAllBranches);
// router.get("/:id", getProductById);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);
// router.get("/category/:category", getByCategory);

module.exports = router;
