import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { sendEmail } from "@/api/emailService";
import { listFolders } from "@/api/fileService";
import { toast } from "react-toastify";
import { FiSend, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function NewEmail() {
  const router = useRouter();
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [folder, setFolder] = useState(""); // New state for folder
  const [availableFolders, setAvailableFolders] = useState([]); // State for available folders
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State for loading folders

  // Fetch available folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        const folders = await listFolders();
        console.log("Fetched folders:", folders);

        // Remove trailing slashes from folder names
        const cleanedFolders = folders.map((folderName) =>
          folderName.replace(/\/$/, "")
        );
        setAvailableFolders(cleanedFolders);
      } catch (error) {
        toast.error(
          "Failed to load folders: " +
            (error.response?.data?.message || error.message)
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!to || !subject || !body) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSending(true);

    try {
      const payload = {
        to,
        subject,
        body,
        folder: folder || null, // Include folder in the payload
      };
      console.log("Request Payload:", payload); // Log the payload

      await sendEmail(to, subject, body, folder || null);
      toast.success("Email sent successfully!");

      // Navigate back to email list
      router.push("/emails");
    } catch (error) {
      toast.error(
        "Failed to send email: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Layout title="New Email - File Storage System">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/emails"
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Send New Email</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading available folders...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="to"
                >
                  Recipient Email
                </label>
                <input
                  type="email"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="recipient@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="subject"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Email subject"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="body"
                >
                  Message Body
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows="8"
                  className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="folder"
                >
                  Select Photo Folder (Optional)
                </label>
                {availableFolders.length > 0 ? (
                  <select
                    id="folder"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="block w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select a folder --</option>
                    {availableFolders.map((folderName) => (
                      <option key={folderName} value={folderName}>
                        {folderName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                    <p className="text-sm">
                      No folders found. Please upload files to a folder first.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSending || availableFolders.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center"
                >
                  <FiSend className="mr-2" />
                  {isSending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
