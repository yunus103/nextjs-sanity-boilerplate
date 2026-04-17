"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { Expand, X, ChevronLeft, ChevronRight } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";

/**
 * Thumbnail'e hover edildiğinde tam boyutlu lightbox görselini önceden yükler.
 * Tarayıcı cache'e aldığı için tıklandığında anında açılır.
 */
function prefetchLightboxImage(image: any) {
  if (typeof window === "undefined" || !image?.asset) return;
  try {
    const url = urlForImage(image)
      ?.auto("format")
      .width(1920)
      .fit("max") // Upscale'i önle
      .quality(90)
      .url();
    if (!url) return;
    if (document.querySelector(`link[href="${url}"]`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  } catch {
    // prefetch başarısız olursa sessizce geç
  }
}

interface LightboxGalleryProps {
  images: any[];
}

export function LightboxGallery({ images }: LightboxGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, images.length]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setSelectedImage((prev) => {
      if (prev === null) return 0;
      if (newDirection === 1) return prev < images.length - 1 ? prev + 1 : 0;
      return prev > 0 ? prev - 1 : images.length - 1;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16">
        {images.map((image, i) => (
          <div
            key={i}
            className="group relative cursor-pointer overflow-hidden rounded-sm aspect-[4/3] bg-backgroundLight"
            onClick={() => setSelectedImage(i)}
            onMouseEnter={() => prefetchLightboxImage(image)}
          >
            <SanityImage
              image={image}
              width={800}
              height={600}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Hover overlay with icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                <Expand size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence initial={false} custom={direction}>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-4 md:px-12 backdrop-blur-sm touch-none"
            onClick={() => setSelectedImage(null)}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-10">
              <div className="text-white font-display text-sm tracking-[0.2em] uppercase opacity-70">
                {selectedImage + 1}{" "}
                <span className="mx-2 text-white/30">/</span> {images.length}
              </div>
              <button
                className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X
                  size={36}
                  className="transform group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="hidden md:flex absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer z-20 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                >
                  <ChevronLeft
                    size={56}
                    className="transform group-hover:-translate-x-2 transition-transform"
                  />
                </button>
                <button
                  className="hidden md:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer z-20 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                >
                  <ChevronRight
                    size={56}
                    className="transform group-hover:translate-x-2 transition-transform"
                  />
                </button>
              </>
            )}

            {/* Main Image Container */}
            <div className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
              <motion.div
                key={selectedImage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x > 100 || (offset.x > 20 && velocity.x > 500)) {
                    paginate(-1);
                  } else if (
                    offset.x < -100 ||
                    (offset.x < -20 && velocity.x < -500)
                  ) {
                    paginate(1);
                  }
                }}
                className="absolute w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={(e) => e.stopPropagation()}
              >
                <SanityImage
                  image={images[selectedImage]}
                  fill
                  fit="max"
                  quality={90}
                  sizes="(max-width: 1920px) 100vw, 1920px"
                  className="pointer-events-none select-none"
                  objectFit="contain"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
