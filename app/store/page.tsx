"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";

export default function StorePage() {
  const [soundPacks, setSoundPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const response = await fetch("/api/content/audio");
        if (!response.ok) {
          throw new Error("Failed to fetch audio content");
        }
        const data = await response.json();

        if (data.success && data.data) {
          const formattedData = data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description || "Professional gospel sound pack.",
            price: item.price,
            category: item.category || "",
            imageUrl: item.thumbnailUrl || "/Sound.png",
            audioUrl: item.file_url,
            features: [
              "High quality audio",
              "Professionally mixed",
              "Royalty-free for your projects",
              "Instant download after purchase",
            ],
          }));

          setSoundPacks(formattedData);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Sound <span className="gold-text">Store</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore our collection of premium sound packs, samples, and
            resources for your creative projects.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 text-sm mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading sound packs...</p>
          </div>
        ) : soundPacks.length === 0 ? (
          <div className="text-center py-16 border border-gold-500/20 rounded-lg bg-black/40">
            <h2 className="text-xl font-semibold mb-4">
              No Sound Packs Available Yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              The store is currently empty. Sound packs will appear here
              once they are uploaded through the admin dashboard.
            </p>
            <Button
              asChild
              className="bg-gold-500 hover:bg-gold-600 text-primary-foreground"
            >
              <Link href="/admin/dashboard?tab=upload">Upload Content</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {soundPacks.map((pack: any) => (
              <div
                key={pack.id}
                className="border border-gold-500/20 bg-black/40 rounded-lg overflow-hidden hover:border-gold-500/40 transition-all group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={pack.imageUrl || "/Sound.png"}
                    alt={pack.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold truncate">
                      {pack.title}
                    </h3>
                    <div className="text-lg font-bold text-gold-500 flex-shrink-0 ml-2">
                      £{pack.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pack.description}
                  </p>

                  <div className="mb-4">
                    <AudioPlayer audioUrl={pack.audioUrl} title="Preview" />
                  </div>

                  <div className="space-y-1 mb-4 hidden sm:block">
                    {pack.features
                      .slice(0, 2)
                      .map((feature: string, i: number) => (
                        <div key={i} className="flex items-center text-xs">
                          <div className="h-1 w-1 rounded-full bg-gold-500 mr-2 flex-shrink-0"></div>
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-gold-500 hover:bg-gold-600 text-primary-foreground"
                    >
                      <Link href={`/store/${pack.id}`}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
