// components/ui/FormattedDescription.tsx
import React from "react";

interface FormattedDescriptionProps {
  text: string | null | undefined; // Permite texto nulo ou indefinido
}

const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
}) => {
  // Verifica se o texto é nulo, indefinido ou vazio
  if (!text) {
    return null; // Não renderiza nada se não houver texto
  }

  // 1. Divide o texto em linhas baseado no caractere de nova linha (\n)
  // 2. Remove linhas que contêm apenas espaços em branco (trim() remove espaços no início/fim)
  // 3. Garante que não criamos parágrafos vazios
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  // Se, após filtrar, não houver parágrafos, não renderiza nada
  if (paragraphs.length === 0) {
    return null;
  }

  // Renderiza cada linha filtrada como um parágrafo separado
  return (
    <div className="text-gray-700 leading-relaxed space-y-4">
      {" "}
      {/* Mantém o estilo */}
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default FormattedDescription;
