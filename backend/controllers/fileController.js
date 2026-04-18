const File = require("../models/File");
const Folder = require("../models/Folder");
const mongoose = require("mongoose");



// =======================
// 📤 UPLOAD FILE
// =======================
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const folderId = req.body.folderId;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!folderId) {
      return res.status(400).json({ message: "folderId missing" });
    }

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" });
    }

    const newFile = await File.create({
      filename: file.originalname,
      storedName: file.originalname, // ✅ no filename in memoryStorage
      url: "N/A", // ❗ no local file URL in Vercel
      size: file.size,
      type: file.mimetype,
      folderId,
      userId: req.user.userId,
    });

    await Folder.findByIdAndUpdate(folderId, {
      $inc: { totalSize: file.size },
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// =======================
// 📂 GET FILES
// =======================
exports.getFiles = async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
      return res.status(400).json({ message: "Invalid folder ID" });
    }

    const files = await File.find({ folderId })
      .sort({ createdAt: -1 })
      .lean(); // ✅ faster response

    res.json(files);

  } catch (error) {
    console.error("GET FILES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};


// =======================
// 🗑️ DELETE FILE
// =======================
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileName = file.storedName || file.filename;
    const filePath = path.join(__dirname, "../uploads", fileName);

    console.log("Deleting:", filePath);

    // ✅ async delete (safe)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.log("FS ERROR:", err.message);
      }
    });

    // ✅ update folder size safely
    if (file.folderId) {
      await Folder.findByIdAndUpdate(file.folderId, {
        $inc: { totalSize: -file.size },
      });
    }

    // ✅ delete from DB
    await File.findByIdAndDelete(fileId);

    res.json({ message: "File deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      message: "Delete failed",
      error: err.message,
    });
  }
};