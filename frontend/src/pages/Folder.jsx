import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function Folder() {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const filteredFiles = files.filter((file) =>
    (file.filename || "").toLowerCase().includes(search.toLowerCase())
  );

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/file/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchFiles();
  }, [id]);

  // 📤 Upload
  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempId = Date.now();

    const tempFile = {
      _id: tempId,
      filename: file.name,
      url: URL.createObjectURL(file), // ✅ preview
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

      // ✅ KEEP preview even after upload
      setFiles((prev) =>
        prev.map((f) =>
          f._id === tempId
            ? { ...realFile, url: f.url }
            : f
        )
      );

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);
      alert("Upload failed");

      setFiles((prev) => prev.filter((f) => f._id !== tempId));
    }

    e.target.value = null;
  };

  // 🗑️ Delete
  const deleteFile = async (fileId) => {
    if (!window.confirm("Delete this file?")) return;

    const oldFiles = [...files];

    try {
      setFiles((prev) => prev.filter((file) => file._id !== fileId));

      await axios.delete(`/file/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (err) {
      console.error(err);
      alert("Delete failed");
      setFiles(oldFiles);
    }
  };

  // 🧠 File type
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
            src={file.url || "/file-icon.png"}
            alt={file.filename}
            onClick={() => file.url && setSelectedImage(file.url)}
            className="w-full h-40 object-cover rounded-lg cursor-pointer"
          />
        );

      case "video":
        return file.url ? (
          <video src={file.url} controls className="w-full h-40 rounded-lg" />
        ) : (
          <div className="h-40 flex items-center justify-center bg-gray-200 rounded-lg">
            🎥 Video
          </div>
        );

      case "pdf":
      case "doc":
      case "zip":
        return (
          <div
            onClick={() => {
              if (file.url) window.open(file.url);
              else alert("Preview not available");
            }}
            className="h-40 flex flex-col items-center justify-center bg-gray-200 rounded-lg cursor-pointer"
          >
            📄 File
            <p className="text-xs">
              {file.url ? "Open" : "Not available"}
            </p>
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

      {filteredFiles.length === 0 && (
        <p className="text-gray-500 mt-6">No files found</p>
      )}

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
                href={file.url || "#"}
                onClick={(e) => {
                  if (!file.url) {
                    e.preventDefault();
                    alert("Download not available");
                  }
                }}
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