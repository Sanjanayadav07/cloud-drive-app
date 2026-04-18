const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");
const path = require("path");
dotenv.config();

const app = express();

app.use(cors({
  origin: "https://cloud-drive-app-smoky.vercel.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/file", fileRoutes);
//app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Cloud Drive API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});