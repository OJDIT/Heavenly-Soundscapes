"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { Music, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFileToSupabase } from "@/lib/supabase";
import { getAudioDuration } from "@/lib/helpers";

const SUPABASE_MAX_SIZE = 50 * 1024 * 1024;

export default function SimpleAudioUploadForm({
  onSuccess,
  setActiveTab,
}: {
  onSuccess?: () => void;
  setActiveTab?: (tab: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFree, setIsFree] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("audio/")) {
      setError("Please select a valid audio file");
      return;
    }

    setFile(selectedFile);
    setError(null);

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) return setError("Please select an audio file");
    if (!title.trim()) return setError("Please enter a title");
    if (!isFree && (!price || isNaN(Number(price)) || Number(price) <= 0)) {
      return setError("Please enter a valid price for paid audio");
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(10);
      const rawDuration = await getAudioDuration(file);
      const minutes = Math.floor(rawDuration / 60);
      const seconds = Math.round(rawDuration % 60);
      const duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { data: uploadData, error: uploadErr } = await uploadFileToSupabase(
        file,
        "audio-files",
        filename
      );

      setUploadProgress(20);

      if (uploadErr || !uploadData) {
        throw new Error(uploadErr?.message ?? "Storage upload failed");
      }

      const metadata = {
        title,
        category,
        description,
        price: isFree ? 0 : parseFloat(price),
        file_path: filename,
        file_name: file.name,
        file_url: uploadData.url,
        file_size: file.size,
        file_type: file.type,
        duration,
        storage_type: file.size <= SUPABASE_MAX_SIZE ? "supabase" : "blob",
        is_free: isFree,
      };

      const { data: resp } = await axios.post("/api/content/audio", metadata);

      if (!resp.success) {
        throw new Error(resp.error || "Saving metadata failed");
      }

      setUploadProgress(80);
      setUploadSuccess(true);

      setTimeout(() => {
        formRef.current?.reset();
        setFile(null);
        setTitle("");
        setCategory("");
        setDescription("");
        setPrice("");
        setUploadSuccess(false);
        onSuccess?.();
        if (setActiveTab) {
          setActiveTab("audio");
        }
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleUpload} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="Enter audio title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >{/*
            <option value="">Select category</option>
            <option value="worship">Worship</option>
            <option value="gospel">Gospel</option>
            <option value="ambient">Ambient</option>
            <option value="scripture">Scripture</option>*/}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price (£)</label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="29.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full"
          disabled={isFree}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter audio description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Free sounds*/}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="h-4 w-4"
          />
          Free Sounds
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Audio File</label>
        <div className="border-2 border-dashed border-gold-500/30 rounded-lg p-6 text-center hover:border-gold-500/50 transition-colors">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload-simple"
            onChange={handleFileChange}
          />
          <label htmlFor="audio-upload-simple" className="cursor-pointer">
            <Music className="h-10 w-10 mx-auto text-gold-500/70 mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              {file ? file.name : "Click to upload audio file"}
            </p>
            <p className="text-xs text-muted-foreground">
              Supports MP3, WAV, OGG (small files recommended)
            </p>
          </label>
        </div>
      </div>

      {preview && (
        <div className="border border-gold-500/20 rounded-lg p-4 bg-black/40">
          <h4 className="text-sm font-medium mb-2">Audio Preview</h4>
          <audio key={preview} controls className="w-full" src={preview} />
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading to Supabase...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-gold-500/20 rounded-lg overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          type="submit"
          disabled={!file || isUploading}
          className="bg-gold-500 hover:bg-gold-600 text-primary-foreground w-full sm:w-auto"
        >
          {isUploading ? "Uploading..." : "Upload Audio"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setFile(null);
            setPreview(null);
            setError(null);
          }}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 text-sm flex items-start gap-2">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>Audio uploaded successfully!</p>
        </div>
      )}
    </form>
  );
}
