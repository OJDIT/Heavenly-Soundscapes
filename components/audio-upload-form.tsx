"use client";

import { useState } from "react";
import { uploadToSupabase, ensureSupabaseBucket } from "@/lib/supabase-client";
import { createClient } from "@/lib/supabase-client";

export default function AudioUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please fill in the title and select a file.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File size exceeds 50MB. Please choose a smaller file.");
      return;
    }

    setUploading(true);

    await ensureSupabaseBucket("audio-files");

    const filePath = `${Date.now()}-${file.name}`;
    const { url, error } = await uploadToSupabase(file, "audio-files", filePath);

    if (error || !url) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
      setUploading(false);
      return;
    }

    const supabase = createClient();

    const { error: insertError } = await supabase.from("audio_items").insert([
      {
        title,
        description,
        category,
        file_url: url,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        storage_type: "supabase",
      },
    ]);

    if (insertError) {
      console.error("Failed to save audio metadata:", insertError);
      alert("Upload succeeded, but metadata was not saved.");
    } else {
      setSuccess(true);
      setTitle("");
      setDescription("");
      setCategory("");
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Audio</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {success && <p className="mt-2 text-green-600">Upload successful!</p>}
    </div>
  );
}
