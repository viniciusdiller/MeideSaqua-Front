// components/Notification.tsx

"use client";

import React from "react";
import { useEffect } from "react";
import { FiCheckSquare, FiX, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

const NOTIFICATION_TTL = 5000;

export type NotificationType = {
  id: number;
  text: string;
  type: "success" | "error"; // Adicionamos um tipo para controlar a cor
};

export const Notification = ({
  text,
  id,
  removeNotif,
  type,
}: NotificationType & { removeNotif: (id: number) => void }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, [id, removeNotif]);

  // Define a cor com base no tipo da notificação
  const bgColor =
    type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`p-3 flex items-start rounded-lg gap-3 text-sm font-medium shadow-lg text-white ${bgColor} pointer-events-auto`}
    >
      {type === "success" ? (
         <FiCheckSquare className="mt-0.5 text-xl" />
      ) : (
         <FiAlertTriangle className="mt-0.5 text-xl" />
      )}
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};