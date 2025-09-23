"use client";

import React, { useState, useEffect } from "react";

const AccessibilityStyles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este hook só roda no cliente, então podemos marcar que estamos no navegador.
    setIsClient(true);
  }, []);

  const styles = `

    html[data-theme='inverted'] {
      filter: invert(1) hue-rotate(180deg);
      background-color: #fff;
    }

    html[data-theme='inverted'] .fixed.bottom-4.right-4 {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    html[data-theme='inverted'] img,
    html[data-theme='inverted'] video,
    html[data-theme='inverted'] svg {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    body[data-links='highlight'] a[href],
    body[data-links='highlight'] button,
    body[data-links='highlight'] [role="button"],
    body[data-links='highlight'] [onclick] {
      outline: 3px solid #005fcc !important;
      outline-offset: 2px;
    }


    body[data-links='highlight'] a[href*="/categoria/"] > div {
        outline: 4px solid #005fcc !important;
        outline-offset: 3px;
        border-radius: 1.25rem !important; /* Garante o arredondamento */
    }

    /* Destaque quando o modo de inversão de cores está ativo */
    html[data-theme='inverted'] [data-links='highlight'] a[href*="/categoria/"] > div {
        outline-color: #ff9a00 !important;
    }
  `;

  // Se não estiver no cliente, não renderiza nada, evitando o erro de hidratação.
  if (!isClient) {
    return null;
  }

  // Após montar no cliente, injeta a tag de estilo.
  return <style>{styles}</style>;
};

export default AccessibilityStyles;
