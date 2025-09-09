import React from "react";
import { FiSend } from "react-icons/fi";

// 1. Defina os tipos das props que o botão vai receber
interface NeumorphismButtonProps {
  href: string; // O link de destino
}

const ButtonWrapper: React.FC = () => {
  return (
    <div className="flex items-center justify-center my-auto -mb-10">
      {/* 3. Passe o link desejado como prop para o componente */}
      <NeumorphismButton href="/../cadastro-mei" />
    </div>
  );
};

// 2. Atualize o componente para usar as props
const NeumorphismButton: React.FC<NeumorphismButtonProps> = ({ href }) => {
  return (
    // Mude de <button> para <a> e adicione o href
    <a
      href={href}
      className={`
        bg-gradient-to-r from-[#017DB9] to-[#22c362]
        px-4 py-2 rounded-full 
        flex items-center gap-2 
        text-white
        shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)]
        
        transition-all

        hover:shadow-[-1px_-1-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)]
        hover:text-white/80
        hover:-translate-y-1 hover:scale-[1.02] 
      `}
    >
      <span>Cadastre-se Aqui!</span>
      <FiSend />
    </a>
  );
};

export default ButtonWrapper;
