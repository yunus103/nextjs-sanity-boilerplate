"use client";

import { motion } from "framer-motion";

type AnimateGroupProps = {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
};

export function AnimateGroup({ children, stagger = 0.1, delay = 0, className }: AnimateGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// AnimateGroup içindeki her child bunu kullanır
export const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
