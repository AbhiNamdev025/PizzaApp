const express = require("express");
const router = express.Router();
const billController = require("../../Controller/BillController/billController");

router.post("/generate", billController.generateBill);
router.get("/:id", billController.getBill);

module.exports = router;
