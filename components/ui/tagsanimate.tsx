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
          whileHover={{
            scale: 1.15,
            rotate: [-2, 2, -2, 0], // balancinho
            transition: { duration: 0.4 },
          }}
          className="px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md "
          style={{
            backgroundColor: ["#f97316", "#3b82f6", "#ec4899", "#22c55e"][i % 4],
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
