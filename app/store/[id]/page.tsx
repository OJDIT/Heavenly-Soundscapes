"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Music, ShoppingCart } from "lucide-react";
import AudioPlayer from "@/components/audio-player";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCheckoutSession } from "@/lib/actions";
import { toTitleCase } from "@/lib/helpers";

export default function SoundPackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pack, setPack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    async function fetchSoundPack() {
      try {
        setLoading(true);
        const response = await fetch("/api/content/audio");
        if (!response.ok) {
          throw new Error("Failed to fetch audio content");
        }
        const data = await response.json();

        if (data.success && data.data) {
          const soundPack = data.data.find((item: any) => item.id === id);

          if (soundPack) {
            setPack({
              id: soundPack.id,
              title: soundPack.title,
              price: soundPack.price,
              category: soundPack.category || "Sound Pack",
              description:
                soundPack.description ||
                "Professional sound pack for your productions.",
              features: [
                "High quality audio",
                "Professionally mixed",
                "Royalty-free for your projects",
                "Instant download after purchase",
              ],
              imageUrl: soundPack.thumbnailUrl || "/Sound.png",
              audioUrl: soundPack.file_url,
            });
          } else {
            setError("Sound pack not found");
          }
        }
      } catch (err) {
        console.error("Error fetching sound pack:", err);
        setError("Failed to load sound pack. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchSoundPack();
  }, [id]);

  useEffect(() => {
    const stored = localStorage.getItem("purchases");
    if (stored) {
      const purchases = JSON.parse(stored);
      const isBought = purchases.some((p: any) => p.id === id);
      setHasPurchased(isBought);
    }
  }, [id]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = pack.audioUrl;
    a.download = `${pack.title.replace(/\s+/g, "-").toLowerCase()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  const handleBuyNow = async () => {
    if (!pack) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createCheckoutSession({
        amount: pack.price,
        productName: pack.title,
        productId: pack.id,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(`Payment error: ${err.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-6 md:py-12 pt-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading sound pack details...</p>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="container py-6 md:py-12 pt-24">
        <Button asChild variant="ghost" className="mb-4 md:mb-6">
          <Link href="/store">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
          </Link>
        </Button>

        <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Sound pack not found"}</p>
          <Button asChild className="mt-4 bg-gold-500 hover:bg-gold-600 text-primary-foreground">
            <Link href="/store">Return to Store</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-12 pt-24">
      <Button asChild variant="ghost" className="mb-4 md:mb-6">
        <Link href="/store">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div>
          <div className="aspect-square relative rounded-lg overflow-hidden mb-4 md:mb-6">
            <img
              src={pack.imageUrl || "/mic.jpg"}
              alt={pack.title}
              className="object-cover w-full h-full"
            />
          </div>
          <AudioPlayer audioUrl={pack.audioUrl} title="Preview" />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {pack.title.split(" ").map((word: string, i: number) =>
              i === 0 ? (
                <span key={i} className="gold-text">{word}</span>
              ) : (
                ` ${word}`
              )
            )}
          </h1>
          <div className="text-xl md:text-2xl font-bold text-gold-500 mb-4 md:mb-6">
            £{pack.price.toFixed(2)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Category</div>
              <div className="font-medium text-sm md:text-base">{toTitleCase(pack.category)}</div>
            </div>
            <div className="bg-muted p-2 md:p-3 rounded-lg text-center">
              <div className="text-xs md:text-sm text-muted-foreground">Format</div>
              <div className="font-medium text-sm md:text-base">Digital Download</div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-6 md:mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="license">License</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 text-sm md:text-base">
              <p>{pack.description}</p>
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <ul className="space-y-2 text-sm md:text-base">
                {pack.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Music className="h-4 w-4 mr-2 text-gold-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="license" className="mt-4 text-sm md:text-base">
              <p>This sound pack includes a standard license for both personal and commercial use. You may use these sounds in your projects, including songs, videos, and performances. Credit is appreciated but not required.</p>
              <p className="mt-2">For extended licensing options or questions, please contact us.</p>
            </TabsContent>
          </Tabs>

          {downloadSuccess && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-md p-3 mb-4">
              Download started! Thank you for your interest in our sound pack.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-md p-3 mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button
              size="lg"
              className="w-full bg-gold-500 hover:bg-gold-600 text-primary-foreground"
              onClick={handleBuyNow}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Buy Now
                </>
              )}
            </Button>
            {hasPurchased ? (
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gold-500/70 bg-transparent hover:bg-gold-500/10 text-foreground shadow-[0_0_10px_rgba(247,196,20,0.1)]"
                onClick={handleDownload} disabled={true}
              >
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Download Pack
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="w-full border-muted text-muted-foreground cursor-not-allowed"
                disabled
              >
                <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Purchase to Download
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
