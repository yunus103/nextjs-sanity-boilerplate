"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiFullscreenLine,
} from "react-icons/ri";

export interface LightboxProps {
  images: any[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** İsteğe bağlı: Fotoğraf sayacını gösterip gizlemek için (varsayılan: true) */
  showCounter?: boolean;
  /** İsteğe bağlı: Fotoğrafın alt metnini/başlığını göstermek için (varsayılan: false) */
  showTitle?: boolean;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  showCounter = true,
  showTitle = false,
}: LightboxProps) {
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      let newIndex = currentIndex + newDirection;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      onIndexChange(newIndex);
    },
    [currentIndex, images.length, onIndexChange]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, paginate, onClose]);

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

  const currentImage = images[currentIndex];
  const imageTitle = currentImage?.alt || currentImage?.caption || "";

  return (
    <AnimatePresence initial={false} custom={direction}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 px-4 md:px-12 backdrop-blur-sm touch-none"
          onClick={onClose}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-10 pointer-events-none">
            <div className="pointer-events-auto">
              {showCounter && (
                <div className="text-white font-sans text-sm tracking-[0.2em] uppercase opacity-70">
                  {currentIndex + 1} <span className="mx-2 text-white/30">/</span> {images.length}
                </div>
              )}
            </div>
            <button
              className="w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer group pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <RiCloseLine className="text-3xl transform group-hover:rotate-90 transition-transform duration-300" />
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
                <RiArrowLeftSLine className="text-5xl transform group-hover:-translate-x-2 transition-transform" />
              </button>
              <button
                className="hidden md:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-16 h-16 items-center justify-center text-white/40 hover:text-white transition-all cursor-pointer z-20 group"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
              >
                <RiArrowRightSLine className="text-5xl transform group-hover:translate-x-2 transition-transform" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div className="relative w-full h-[70vh] md:h-[85vh] flex flex-col items-center justify-center overflow-hidden">
            <motion.div
              key={currentIndex}
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
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x > 100 || (offset.x > 20 && velocity.x > 500)) {
                  paginate(-1);
                } else if (offset.x < -100 || (offset.x < -20 && velocity.x < -500)) {
                  paginate(1);
                }
              }}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing pb-8 md:pb-12"
              onClick={(e) => e.stopPropagation()}
            >
              <SanityImage
                image={currentImage}
                fill
                fit="max"
                objectFit="contain"
                sizes="100vw"
                quality={95}
                className="pointer-events-none select-none max-h-full"
              />
            </motion.div>
            
            {/* Title / Caption */}
            {showTitle && imageTitle && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none"
              >
                <p className="text-white/80 font-medium text-sm md:text-base px-4 py-2 bg-black/40 rounded-full backdrop-blur-md inline-block shadow-lg">
                  {imageTitle}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface LightboxGalleryProps {
  images: any[];
  showCounter?: boolean;
  showTitle?: boolean;
  columns?: number;
}

export function LightboxGallery({ 
  images, 
  showCounter = true, 
  showTitle = false,
  columns = 3
}: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const colClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4"
  }[columns] || "md:grid-cols-3";

  return (
    <>
      <div className={`grid grid-cols-2 ${colClasses} gap-4 md:gap-6 mb-12`}>
        {images.map((image, i) => (
          <div
            key={i}
            className="group relative cursor-pointer overflow-hidden rounded-lg aspect-[4/3] bg-muted w-full"
            onClick={() => {
              setCurrentIndex(i);
              setIsOpen(true);
            }}
          >
            <SanityImage
              image={image}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Hover overlay with icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 border border-white/20">
                <RiFullscreenLine className="text-2xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        images={images}
        isOpen={isOpen}
        currentIndex={currentIndex}
        showCounter={showCounter}
        showTitle={showTitle}
        onClose={() => setIsOpen(false)}
        onIndexChange={setCurrentIndex}
      />
    </>
  );
}

/** 
 * Backward compatibility component for older imports 
 */
export function ProjectLightbox({ images }: { images: any[] }) {
  return <LightboxGallery images={images} />;
}
