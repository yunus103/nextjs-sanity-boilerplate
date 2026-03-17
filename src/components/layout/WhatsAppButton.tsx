"use client";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton({ number }: { number: string }) {
  const cleanNumber = number.replace(/\D/g, "");
  return (
    <motion.a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute h-full w-full rounded-full bg-green-500 opacity-75"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <FaWhatsapp size={28} className="relative z-10" />
    </motion.a>
  );
}
