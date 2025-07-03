import { Button } from "@/components/ui/button";
import AudioPlayer from "@/components/audio-player";

export default function FreeDownloadPage() {
  const freeSounds = [
    {
      title: "Worshipful Presence",
      genre: "Worship",
      description: "A gentle ambient worship track with piano and soft pads.",
      url: "https://nkfzdkepvicgpvojocrs.supabase.co/storage/v1/object/public/audio-files//1745099767307-Psalm-144.wav",
    },
    {
      title: "Glory Anthem",
      genre: "Gospel",
      description: "Upbeat gospel track with powerful choir and organ.",
      url: "https://example.com/glory-anthem.mp3",
    },
    {
      title: "Divine Peace",
      genre: "Ambient",
      description: "Meditative ambient soundscape with scripture inspiration.",
      url: "https://example.com/divine-peace.mp3",
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freeSounds.map((sound, index) => (
            <div
              key={index}
              className="border border-gold-500/20 bg-black/40 rounded-lg p-4 hover:border-gold-500/40 transition-all"
            >
              <h3 className="text-lg font-semibold mb-1">{sound.title}</h3>
              <div className="text-xs font-medium text-gold-400 mb-2">{sound.genre}</div>
              <p className="text-sm text-muted-foreground mb-4">{sound.description}</p>

              <AudioPlayer audioUrl={sound.url} title={sound.title} />

              <a
                href={sound.url}
                download
                className="mt-4 inline-block bg-gold-500 hover:bg-gold-600 text-black text-sm font-semibold px-4 py-2 rounded transition-all"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
