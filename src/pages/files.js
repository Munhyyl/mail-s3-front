import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { listFiles, downloadFile, deleteFile } from "@/api/fileService";
import { toast } from "react-toastify";
import { FiFolder, FiDownload, FiSearch, FiTrash2 } from "react-icons/fi";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [folder, setFolder] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Файлын жагсаалтыг авах функц
  const fetchFiles = async (folderName = "") => {
    setIsLoading(true);
    try {
      const data = await listFiles(folderName);
      console.log("Fetched files:", data);
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format");
      }
      setFiles(data);
    } catch (error) {
      toast.error(
        "Failed to load files: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Компонент ачааллахад файлын жагсаалтыг дуудах
  useEffect(() => {
    fetchFiles();
  }, []);

  // Хайлт хийх үед дуудагдах функц
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFiles(folder);
  };

  // Файл татаж авах функц
  const handleDownload = async (file) => {
    try {
      if (!file || !file.key) {
        toast.error("Invalid file data.");
        return;
      }

      const key = file.key;
      const blob = await downloadFile(key);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = key.split("/").pop() || "downloaded_file"; // Файлын нэрийг хамгаалах
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error(
        "Failed to download file: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Файл устгах функц
  const handleDelete = async (file) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      if (!file || !file.key) {
        toast.error("Invalid file data.");
        return;
      }

      await deleteFile(file.key);
      toast.success("File deleted successfully!");

      // Жагсаалтыг шинэчлэх
      fetchFiles(folder);
    } catch (error) {
      toast.error(
        "Failed to delete file: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Файлын хэмжээг форматлах
  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return "Unknown size";

    const kilobyte = 1024;
    const megabyte = kilobyte * 1024;
    const gigabyte = megabyte * 1024;

    if (sizeInBytes < kilobyte) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < megabyte) {
      return `${(sizeInBytes / kilobyte).toFixed(1)} KB`;
    } else if (sizeInBytes < gigabyte) {
      return `${(sizeInBytes / megabyte).toFixed(1)} MB`;
    } else {
      return `${(sizeInBytes / gigabyte).toFixed(1)} GB`;
    }
  };

  return (
    <Layout title="Files - File Storage System">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
          Browse Files
        </h1>

        {/* Хайлт хийх хэсэг */}
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <FiFolder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="block w-full border border-gray-300 rounded-l-lg pl-10 pr-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter folder name (leave empty for root)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-r-lg flex items-center transition duration-200"
            >
              <FiSearch className="mr-2" />
              List Files
            </button>
          </form>
        </div>

        {/* Файлын жагсаалт */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading files...</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700">
                Files in {folder || "root"}
              </h2>
            </div>

            {files.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No files found in this location.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex-1 truncate">
                        <p className="text-gray-800 font-medium">
                          {file?.key?.split("/").pop() || "Unknown File"}
                        </p>
                        <p className="text-gray-500 text-sm truncate">
                          {file?.key || "Unknown path"}
                        </p>
                        {file.size && (
                          <p className="text-gray-500 text-sm">
                            Size: {formatFileSize(parseInt(file.size))}
                          </p>
                        )}
                        {file.lastModified && (
                          <p className="text-gray-500 text-sm">
                            Last modified:{" "}
                            {new Date(file.lastModified).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {/* Зураг харуулах хэсэг */}
                      {file.url && file.url.match(/\.(jpeg|jpg|gif|png)$/i) && (
                        <img
                          src={file.url}
                          alt={file.key}
                          className="w-20 h-20 object-cover ml-4 rounded-lg"
                        />
                      )}

                      <div className="flex space-x-2">
                        {/* Файл татах товч */}
                        <button
                          onClick={() => handleDownload(file)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded-lg flex items-center"
                        >
                          <FiDownload className="mr-1" />
                          Download
                        </button>

                        {/* Файл устгах товч */}
                        <button
                          onClick={() => handleDelete(file)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-3 rounded-lg flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
