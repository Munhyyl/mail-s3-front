import { useState } from "react";
import Layout from "@/components/Layout";
import { uploadFile } from "@/api/fileService";
import { toast } from "react-toastify";
import { FiUpload, FiMail, FiImage, FiFolder } from "react-icons/fi";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    try {
      await uploadFile(file, folder);
      toast.success("File uploaded successfully!");
      setFile(null);
      setFolder("");
      // Reset file input
      e.target.reset();
    } catch (error) {
      toast.error(
        "Failed to upload file: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout title="Home - File Storage System">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
          Welcome to File Storage System
        </h1>

        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Upload File to S3
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="file">
                Select File
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="folder">
                Folder Name (optional)
              </label>
              <input
                type="text"
                id="folder"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. marchDogPhotos"
              />
              <p className="text-sm text-gray-500 mt-1">
                ⚠️ If you want to send photos by email later, make sure to
                specify a folder name.
              </p>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex justify-center items-center transition duration-200"
            >
              <FiUpload className="mr-2" />
              {isUploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Manage Files
            </h2>
            <p className="text-gray-600 mb-6">
              View, search, and download files stored in your S3 bucket.
            </p>
            <Link
              href="/files"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center transition duration-200"
            >
              <FiImage className="mr-2" />
              Browse Files
            </Link>
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Email Management
            </h2>
            <p className="text-gray-600 mb-6">
              Send emails and manage your email history.
            </p>
            <div className="flex flex-col space-y-3">
              <Link
                href="/emails"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg inline-flex items-center transition duration-200"
              >
                <FiMail className="mr-2" />
                Manage Emails
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
