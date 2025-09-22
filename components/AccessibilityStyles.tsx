"use client";

import React from 'react';

const AccessibilityStyles = () => {
  const styles = `
    /* ======================================================================== */
    /* SOLUÇÃO FINAL - CORRIGINDO INVERSÃO DOS BOTÕES E DESTAQUE */
    /* ======================================================================== */

    /* Aplica a inversão de cores a todo o site */
    html[data-theme='inverted'] {
      filter: invert(1) hue-rotate(180deg);
      background-color: #fff;
    }

    /*
      PARTE 1: CORREÇÃO DOS BOTÕES DE ACESSIBILIDADE
      Esta regra seleciona o container dos botões de acessibilidade (pela classe 'fixed')
      e aplica o filtro de inversão novamente, o que CANCELA o efeito e os faz
      reaparecer com as cores originais.
    */
    html[data-theme='inverted'] .fixed.bottom-4.right-4 {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    /*
      Garante que imagens, vídeos e SVGs não sejam invertidos, mantendo
      suas cores originais.
    */
    html[data-theme='inverted'] img,
    html[data-theme='inverted'] video,
    html[data-theme='inverted'] svg {
      filter: invert(1) hue-rotate(180deg) !important;
    }


    /* --- DESTAQUE DE ELEMENTOS CLICÁVEIS (COM CORREÇÃO) --- */
    
    /* Destaque para botões e links genéricos */
    body[data-links='highlight'] a[href],
    body[data-links='highlight'] button,
    body[data-links='highlight'] [role="button"],
    body[data-links='highlight'] [onclick] {
      outline: 3px solid #005fcc !important;
      outline-offset: 2px;
    }

    /*
      PARTE 2: CORREÇÃO DO DESTAQUE DAS CAIXINHAS
      Este seletor agora mira especificamente nos links que levam para as categorias
      e aplica o outline na div interna que forma o card visual.
    */
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

  return <style>{styles}</style>;
};

export default AccessibilityStyles;