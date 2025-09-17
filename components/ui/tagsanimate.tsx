"use client";

import { motion } from "framer-motion";

const tags = ["Churrasco", "Bolo", "Doces", "Lugar limpo"];

export default function TagsAnimadas() {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, type: "spring" }}
          className="px-3 py-1 text-xs font-semibold rounded-full text-gray-800 shadow-md "
          style={{
            backgroundColor: ["#f9fafb"][Math.floor(Math.random() * 1)],
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
