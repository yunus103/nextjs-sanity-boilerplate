"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

type FAQItem = {
  question: string;
  answer: string;
};

export function FAQ({ items, className = "" }: { items: FAQItem[], className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`border rounded-xl transition-all duration-300 ${activeIndex === index ? "bg-muted/30 border-primary/20 shadow-sm" : "bg-card hover:bg-muted/20"}`}
        >
          <button
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            className="flex w-full items-center justify-between p-5 text-left transition-all"
            aria-expanded={activeIndex === index}
          >
            <span className="font-semibold text-lg md:text-xl pr-4">{item.question}</span>
            <div className={`shrink-0 rounded-full p-1 transition-colors ${activeIndex === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {activeIndex === index ? (
                <RiSubtractLine size={24} />
              ) : (
                <RiAddLine size={24} />
              )}
            </div>
          </button>
          
          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 text-muted-foreground text-base leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
