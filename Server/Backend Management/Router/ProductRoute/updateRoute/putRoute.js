const express = require("express");
const router = express.Router();
const updateController = require("../../../Controller/ProductControllers/PutController/putController");

const authenticateToken = require("../../../auth/authToken");

router.put(
  "/bulk-discount",
  authenticateToken,
  updateController.bulkUpdateDiscount,
);
router.put("/update/:id", authenticateToken, updateController.updateProduct);

module.exports = router;
