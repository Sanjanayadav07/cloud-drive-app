const express = require("express");
const router = express.Router();
const { deleteFolder } = require("../controllers/folderController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  createFolder,
  getFolders,
} = require("../controllers/folderController");

router.post("/create", authMiddleware, createFolder);
router.get("/all", authMiddleware, getFolders);
router.delete("/delete/:id", authMiddleware, deleteFolder);
module.exports = router;