"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Music,
  Headphones,
  SpeakerIcon as SpeakerWave,
  FileMusic,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";
import MusicMotionBackground from "@/components/music-motion-background";
import { toTitleCase } from "@/lib/helpers";
import TestimonialSlider from "@/components/testimonial-slider";

interface AudioTrack {
  id: string;
  title: string;
  file_url: string;
  category?: string;
}

export default function Home() {
  const [featuredTracks, setFeaturedTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedTracks() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/content/featured");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch featured tracks: ${response.status}`
          );
        }

        const data = await response.json();

        if (data?.success && data?.data?.length) {
          setFeaturedTracks(data?.data);
        } else {
          setFeaturedTracks([]);
        }
      } catch (err) {
        setError("Failed to load featured tracks");
        setFeaturedTracks([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedTracks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="hero-gradient pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
            >
            <source src="/WhatsApp Video 2025-06-02 at 3.55.28 PM.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute left-0 right-0 top-0 h-px bg-gold-gradient opacity-30"></div>
          <div className="absolute left-0 right-0 bottom-0 h-px bg-gold-gradient opacity-30"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold tracking-tight animate-pulse-slow">
              Touching Lives Through <span className="gold-text">Sound</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Professional faith-inspired music production that glorifies God
              and elevates the gospel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gold-500 hover:bg-gold-600 text-primary-foreground"
              >
                <Link href="/contact">Book a Session</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gold-500/70 bg-transparent hover:bg-gold-500/10 text-foreground shadow-[0_0_10px_rgba(247,196,20,0.1)]"
              >
                <Link href="/store">Browse Sound Packs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 -mt-6 md:-mt-8 relative z-10">
        <div className="container max-w-3xl">
          <div className="border border-gold-500/20 bg-black/60 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <h3 className="text-lg font-medium mb-3 text-center">
              Featured Track{featuredTracks.length !== 1 ? "s" : ""} Preview
            </h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
                <span className="ml-3 text-muted-foreground">
                  Loading tracks...
                </span>
              </div>
            ) : featuredTracks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No tracks available yet.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/dashboard?tab=upload">Upload Content</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {featuredTracks.map((track) => (
                  <div
                    key={track.id}
                    className="border border-gold-500/10 bg-black/40 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">{track.title}</h4>
                      {track.category && (
                        <span className="text-xs text-gold-400">
                          {toTitleCase(track.category)}
                        </span>
                      )}
                    </div>
                    <AudioPlayer
                      audioUrl={track.file_url}
                      title={track.title}
                    />
                  </div>
                ))}

                <div className="text-center pt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/store">View All Tracks</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Services Overview */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4">
              Our <span className="gold-text">Services</span>
            </h2>
            <p className="text-muted-foreground">
              We provide professional sound and media production services to
              help elevate your ministry and creative projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Music,
                iconSize: "h-32 w-32",
                title: "Music Production",
                description:
                  "Custom track creation, beat production, and live arrangement with a faith-inspired approach.",
              },
              {
                icon: Headphones,
                iconSize: "h-32 w-32",
                title: "Mixing & Mastering",
                description:
                  "Professional polish for your tracks with online delivery and flexibility across all genres.",
              },
              {
                icon: SpeakerWave,
                iconSize: "h-32 w-32",
                title: "Church Sound Design",
                description:
                  "Specialized loops, worship stems, and transitions created for church services and worship.",
              },
              {
                icon: FileMusic,
                iconSize: "h-32 w-32",
                title: "Sound Packs",
                description:
                  "Scripture-inspired sound collections, ambient nature sounds, and producer kits for your projects.",
              },
              {
                icon: Music,
                iconSize: "h-32 w-32",
                title: "Instrument Tracking",
                description:
                  "Remote recording of bass, drums, keys, guitar, and more for your music productions.",
              },
              {
                icon: Film,
                iconSize: "h-32 w-32",
                title: "Video Services",
                description:
                  "Music video editing and visual content creation for your music and ministry needs.",
              },
            ].map((service, i) => {
              const Icon = service.icon
              return (
                <div
                  key={i}
                  className="relative overflow-hidden border border-gold-500/10 bg-black/90 rounded-lg p-6 hover:border-gold-500/30 transition-all text-white"
                >
                  {/* Icon as background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Icon className={`${service.iconSize} text-gold-500`} />
                  </div>

                  {/* Foreground content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm text-white/80">
                      {service.description}
                    </p>
                    <Button asChild variant="link" className="mt-4 px-0 text-gold-500">
                      <Link href="/services">Learn More</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>



            {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
          <TestimonialSlider />
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="absolute inset-0 bg-gradient-radial from-gold-900/10 to-transparent opacity-60"></div>
        <div className="absolute left-0 right-0 top-0 h-px bg-gold-gradient opacity-30"></div>
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gold-gradient opacity-30"></div>

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-4xl font-playfair font-bold">
              Ready to <span className="gold-text">Elevate</span> Your Sound?
            </h2>
            <p className="text-muted-foreground">
              Join the many worship artists, churches, and ministries that have
              found their perfect sound with Heavenly Soundscapes.
            </p>
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gold-500 hover:bg-gold-600 text-primary-foreground"
              >
                <Link href="/contact">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
