"use client";

import { motion } from "framer-motion";

interface TagsAnimadasProps {
  tags: string[];
}

export default function TagsAnimadas({ tags }: TagsAnimadasProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: i * 0.3, type: "spring" }}
          className="px-3 py-1 text-xs font-semibold rounded-full text-gray-800 shadow-md hover:cursor-default"
          style={{
            backgroundColor: "#f9fafb",
          }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
