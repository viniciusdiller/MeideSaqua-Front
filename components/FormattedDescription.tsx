// components/ui/FormattedDescription.tsx
import React from "react";

interface FormattedDescriptionProps {
  /**
   * O texto a ser formatado, geralmente vindo de um banco de dados.
   * Suporta quebras de linha com '\n'.
   */
  text: string | null | undefined;
}

/**
 * Um componente que pega um texto simples com quebras de linha ('\n')
 * e o renderiza como parágrafos HTML, removendo linhas vazias.
 */
const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
}) => {
  // 1. Se o texto for nulo, indefinido ou vazio, não renderiza nada.
  if (!text) {
    return null;
  }

  // 2. Divide o texto por quebras de linha e remove parágrafos vazios.
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  // 3. Se não sobrar nenhum parágrafo, não renderiza nada.
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="text-gray-600 leading-relaxed">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="break-words m-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
};

export default FormattedDescription;