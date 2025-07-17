"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";
import axios from "axios";

export default function FreeDownloadPage() {
  const [freeSounds, setFreeSounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreeAudio = async () => {
      try {
        const response = await axios.get("/api/content/audio");
        const allItems = response.data?.data || [];
        const freeItems = allItems.filter((item: any) => item.is_free === true);
        setFreeSounds(freeItems);
      } catch (err) {
        console.error("Error fetching audio:", err);
        setError("Failed to load free sounds.");
      } finally {
        setLoading(false);
      }
    };

    fetchFreeAudio();
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Free <span className="gold-text">Sound Downloads</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse and freely download our curated collection of worship and inspirational soundscapes.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-center text-sm text-red-500">{error}</p>
        ) : freeSounds.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No free sounds available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freeSounds.map((sound, index) => (
              <div
                key={index}
                className="border border-gold-500/20 bg-black/40 rounded-lg p-4 hover:border-gold-500/40 transition-all"
              >
                <h3 className="text-lg font-semibold mb-1">{sound.title}</h3>
                <div className="text-xs font-medium text-gold-400 mb-2">
                  {sound.category}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {sound.description}
                </p>

                <AudioPlayer audioUrl={sound.file_url} title={sound.title} />

                <a
                  href={sound.file_url}
                  download
                  className="mt-4 inline-block bg-gold-500 hover:bg-gold-600 text-black text-sm font-semibold px-4 py-2 rounded transition-all"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
