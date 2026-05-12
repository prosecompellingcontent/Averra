import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "@/utils/supabase/client";

interface ContentItem {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>("ebooks");
  const [membershipLevel, setMembershipLevel] = useState<string>("all");

  useEffect(() => {
    loadContent();
  }, [uploadCategory]);

  const loadContent = async () => {
    try {
      setIsLoading(true);

      const bucketName = `make-61755bec-${uploadCategory}`;

      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .list();

      if (error) {
        console.error("Error loading content:", error);
        // Bucket might not exist yet
        setContent([]);
        return;
      }

      setContent(data || []);
    } catch (error) {
      console.error("Error loading content:", error);
      setContent([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setIsUploading(true);

      const bucketName = `make-61755bec-${uploadCategory}`;
      const fileName = `${Date.now()}-${selectedFile.name}`;

      // First, ensure bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === bucketName);

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: false,
        });
        if (createError) {
          console.error("Error creating bucket:", createError);
          alert("Failed to create storage bucket");
          return;
        }
      }

      // Upload file
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file");
        return;
      }

      alert("File uploaded successfully!");
      setSelectedFile(null);
      loadContent();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const bucketName = `make-61755bec-${uploadCategory}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file");
        return;
      }

      alert("File deleted successfully");
      loadContent();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const handleDownload = async (fileName: string) => {
    try {
      const bucketName = `make-61755bec-${uploadCategory}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(fileName);

      if (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download file");
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-[#fdf5f7]">
      {/* Header */}
      <div className="bg-white border-b border-[#251218]/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl text-[#251218]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Content Management
              </h1>
              <p
                className="text-sm text-[#251218]/60 mt-1"
                style={{ fontFamily: "Lora, serif" }}
              >
                Upload and manage ebooks, PDFs, videos, and resources
              </p>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6 mb-6">
          <h2
            className="text-lg text-[#251218] mb-4"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Upload New Content
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Content Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
                style={{ fontFamily: "Lora, serif" }}
              >
                <option value="ebooks">Ebooks</option>
                <option value="templates">Templates</option>
                <option value="pdfs">PDFs</option>
                <option value="videos">Videos</option>
                <option value="resources">Strategy Resources</option>
                <option value="replays">Replay Recordings</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm text-[#251218] mb-2"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
              >
                Membership Level Access
              </label>
              <select
                value={membershipLevel}
                onChange={(e) => setMembershipLevel(e.target.value)}
                className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
                style={{ fontFamily: "Lora, serif" }}
              >
                <option value="all">All Members</option>
                <option value="blueprint">Blueprint Only</option>
                <option value="gold-standard">Gold Standard Only</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-sm text-[#251218] mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
            >
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-[#251218]/20 rounded-lg focus:border-[#c9969e] focus:outline-none"
              style={{ fontFamily: "Lora, serif" }}
            />
            {selectedFile && (
              <p
                className="text-sm text-[#251218]/60 mt-2"
                style={{ fontFamily: "Lora, serif" }}
              >
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-6 py-2 bg-[#251218] text-white hover:bg-[#c9969e] hover:text-[#251218] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-lg shadow-sm border border-[#251218]/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {uploadCategory.charAt(0).toUpperCase() + uploadCategory.slice(1)}
            </h2>
            <button
              onClick={loadContent}
              className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p
                className="text-[#251218]/60"
                style={{ fontFamily: "Lora, serif" }}
              >
                Loading content...
              </p>
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="text-[#251218]/60"
                style={{ fontFamily: "Lora, serif" }}
              >
                No content uploaded yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#251218]/5">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      File Name
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Size
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Uploaded
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs text-[#251218] uppercase tracking-wider"
                      style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#251218]/10">
                  {content.map((item) => (
                    <tr key={item.id} className="hover:bg-[#251218]/5 transition-colors">
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-[#251218]"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-xs text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {item.metadata?.mimetype || "Unknown type"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {formatFileSize(item.metadata?.size || 0)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p
                          className="text-sm text-[#251218]/60"
                          style={{ fontFamily: "Lora, serif" }}
                        >
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleDownload(item.name)}
                          className="text-sm text-[#c9969e] hover:text-[#251218] transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDelete(item.name)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
