const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  url: String,
  size: Number,
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("File", fileSchema);