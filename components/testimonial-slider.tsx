"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

const testimonials = [
  {
    name: "Grace A.",
    message:
      "Heavenly Soundscapes took my worship album to another level. Their spiritual insight and technical skill are unmatched.",
  },
  {
    name: "Pastor John M.",
    message:
      "Our church now sounds like heaven on earth. The loops and transitions make worship seamless and powerful!",
  },
  {
    name: "Kelvin O.",
    message:
      "From mixing to video editing, they nailed every detail. I'm beyond impressed with the outcome.",
  },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-56 md:h-52 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center border border-gold-500/20 bg-black/60 backdrop-blur-sm rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
        >
          <User className="h-8 w-8 text-gold-500 mb-2" />
          <p className="text-muted-foreground text-lg italic mb-4">
            "{testimonials[current].message}"
          </p>
          <span className="text-gold-400 font-semibold">
            – {testimonials[current].name}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
