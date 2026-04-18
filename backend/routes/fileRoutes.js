const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadFile, getFiles, deleteFile } = require("../controllers/fileController");


// upload single file
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

// get files of folder
router.get("/:folderId", authMiddleware, getFiles);
router.delete("/delete/:id", authMiddleware, deleteFile);
module.exports = router;