import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 📂 Fetch folders
  const fetchFolders = async () => {
    try {
      const res = await axios.get("/folder/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load folders");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // ➕ Create folder
  const createFolder = async () => {
    const name = prompt("Folder name");
    if (!name) return;

    try {
      const res = await axios.post(
        "/folder/create",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFolders((prev) => [res.data.folder, ...prev]);

    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  // 🗑️ Delete folder (optimistic)
  const deleteFolder = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const oldFolders = [...folders];

    try {
      setFolders((prev) => prev.filter((f) => f._id !== id));

      await axios.delete(`/folder/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

    } catch (err) {
      console.error(err);
      alert("Delete failed");
      setFolders(oldFolders); // rollback
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Drive</h1>

        <div className="flex gap-3">
          <button
            onClick={createFolder}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Folder
          </button>

          <button
            onClick={logout}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Empty State */}
      {folders.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">
          📂 No folders yet. Create one to get started.
        </p>
      )}

      {/* Grid */}
      {folders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {folders.map((f) => (
            <div
              key={f._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
            >
              {/* Folder */}
              <div
                onClick={() => navigate(`/folder/${f._id}`)}
                className="cursor-pointer"
              >
                <p className="font-medium">📁 {f.name}</p>

                {/* Size safe */}
                <p className="text-xs text-gray-500">
                  {f.totalSize
                    ? (f.totalSize / 1024 / 1024).toFixed(2)
                    : "0.00"} MB
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteFolder(f._id)}
                className="text-red-500 hover:scale-110 transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}