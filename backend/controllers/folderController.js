const Folder = require("../models/Folder");

// CREATE FOLDER
exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const folder = await Folder.create({
      name,
      userId: req.user.userId,
    });

    res.status(201).json({
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL FOLDERS OF USER
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.userId });

    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    await Folder.findByIdAndDelete(id);

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};