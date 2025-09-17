"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

const DELAY_IN_MS = 4000; // timing
const TRANSITION_DURATION_IN_SECS = 1.5;

export const AnimatedLogo = () => {
  return (
    <LogoRolodex
      items={[
        <LogoItem key="meidesaqua">
          <Image
            src="/LogoMeideSaqua.png"
            alt="Logo MeideSaqua"
            width={160}
            height={40}
            className="object-contain"
          />
        </LogoItem>,
        <LogoItem key="saquarema">
          <Image
            src="/logosq.png"
            alt="Logo Saquarema"
            width={160}
            height={40}
            className="object-contain"
          />
        </LogoItem>,
      ]}
    />
  );
};

// Lógica da Animação (Rolodex)
const LogoRolodex = ({ items }: { items: ReactElement[] }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((pv) => pv + 1);
    }, DELAY_IN_MS);

    return () => {
      clearInterval(intervalRef.current || undefined);
    };
  }, []);

  return (
    <div
      style={{
        transform: "rotateY(-15deg)", 
        transformStyle: "preserve-3d",
      }}
      className="relative z-0 h-16 w-48 shrink-0" 
    >
      <AnimatePresence mode="sync">
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            zIndex: -index,
            backfaceVisibility: "hidden",
          }}
          key={index}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          initial={{ rotateX: "0deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "-180deg" }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%)",
            zIndex: index,
            backfaceVisibility: "hidden",
          }}
          key={(index + 1) * 2}
          initial={{ rotateX: "180deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "0deg" }}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
      </AnimatePresence>

      <hr
        style={{ transform: "translateZ(1px)" }}
        className="absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2 border-t border-white/20"
      />
    </div>
  );
};


const LogoItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "grid h-14 w-44 place-content-center rounded-lg", 
        className
      )}
    >
      {children}
    </div>
  );
};