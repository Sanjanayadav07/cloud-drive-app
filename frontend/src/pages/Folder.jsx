import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function Folder() {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // 🔍 Filter (safe)
  const filteredFiles = files.filter((file) =>
    (file.filename || "").toLowerCase().includes(search.toLowerCase())
  );

  // 📂 Fetch
  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIX
      });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 📤 Upload
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempId = Date.now();

    // ✅ instant preview
    const tempFile = {
      _id: tempId,
      filename: file.name,
      url: URL.createObjectURL(file),
    };

    setFiles((prev) => [tempFile, ...prev]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", id);

    try {
      const res = await axios.post("/file/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const realFile = res.data.file;

      // ✅ replace temp with real file
      setFiles((prev) =>
        prev.map((f) => (f._id === tempId ? realFile : f))
      );

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);
      alert("Upload failed");

      // ❗ remove temp on fail
      setFiles((prev) => prev.filter((f) => f._id !== tempId));
    }

    // ✅ reset input
    e.target.value = null;
  };


  // 🗑️ Delete (optimistic + rollback)
  const deleteFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;

    const oldFiles = [...files]; // ✅ backup

    try {
      setFiles((prev) => prev.filter((file) => file._id !== fileId));

      await axios.delete(`/file/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIX
      });

    } catch (err) {
      console.error(err);
      alert("Delete failed");

      // ❗ rollback
      setFiles(oldFiles);
    }
  };

  // 🧠 File type detect
  const getFileType = (filename = "") => {
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["doc", "docx"].includes(ext)) return "doc";
    if (["zip", "rar"].includes(ext)) return "zip";

    return "other";
  };

  // 🎨 Renderer
  const renderFile = (file) => {
    const type = getFileType(file.filename);

    switch (type) {
      case "image":
        return (
          <img
            src={file.url}
            alt={file.filename}
            onClick={() => setSelectedImage(file.url)}
            className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
          />
        );

      case "video":
        return (
          <video
            src={file.url}
            controls
            className="w-full h-40 rounded-lg"
          />
        );

      case "pdf":
        return (
          <div
            onClick={() => window.open(file.url)}
            className="h-40 flex flex-col items-center justify-center bg-red-100 rounded-lg cursor-pointer"
          >
            📄 PDF
            <p className="text-xs">Open</p>
          </div>
        );

      case "doc":
        return (
          <div
            onClick={() => window.open(file.url)}
            className="h-40 flex flex-col items-center justify-center bg-blue-100 rounded-lg cursor-pointer"
          >
            📝 DOC
            <p className="text-xs">Open</p>
          </div>
        );

      case "zip":
        return (
          <div
            onClick={() => window.open(file.url)}
            className="h-40 flex flex-col items-center justify-center bg-yellow-100 rounded-lg cursor-pointer"
          >
            🗂️ ZIP
            <p className="text-xs">Download</p>
          </div>
        );

      default:
        return (
          <div className="h-40 flex items-center justify-center bg-gray-200 rounded-lg">
            📁 File
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-xl font-bold">Folder</h2>

      {/* Upload */}
      <input type="file" className="mt-4" onChange={uploadFile} />

      {/* Search */}
      <input
        placeholder="Search files..."
        className="mt-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Empty */}
      {filteredFiles.length === 0 && (
        <p className="text-gray-500 mt-6">No files found</p>
      )}

      {/* Grid */}
      {filteredFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className="bg-white p-2 rounded-xl shadow relative group"
            >
              <button
                onClick={() => deleteFile(file._id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>

              {renderFile(file)}

              <p className="text-sm mt-2 truncate">{file.filename}</p>

              <a
                href={file.url}
                download
                className="text-blue-500 text-xs block mt-1"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
            alt="preview"
          />
        </div>
      )}
    </div>
  );
}

export default Folder;