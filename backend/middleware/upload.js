const multer = require("multer");

// ✅ memory storage (Vercel compatible)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;