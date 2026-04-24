const express = require("express");
const router = express.Router();
const { submitBug, getAllBugs, getBugById } = require("../controllers/bugController");

router.post("/", submitBug);
router.get("/", getAllBugs);
router.get("/:id", getBugById);

module.exports = router;