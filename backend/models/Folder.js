const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalSize: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Folder", folderSchema);