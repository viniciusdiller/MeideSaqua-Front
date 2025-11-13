import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

// Importando sua função 'cn' original
import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* O "trilho" de fundo (usei slate-200 para um visual mais suave) */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      
      {/* A "barra de progresso" com o SEU gradiente */}
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#017DB9] to-[#22c362]" />
    
    </SliderPrimitive.Track>
    
    {/* A "bolinha" de controle (Thumb) */}
<SliderPrimitive.Thumb
  className={cn(
    "block h-5 w-5 rounded-full bg-white shadow-md",
    "transition-all",
    "hover:scale-110 active:scale-95", // Efeitos de interação
    
    // -> AQUI É ONDE VAMOS AJUSTAR O FOCO E REMOVER O OUTLINE
    "outline-none", // Garante que o outline padrão seja removido
    "focus-visible:ring-2 focus-visible:ring-offset-2", // Seu anel de foco customizado
    "focus-visible:ring-[#017DB9]", // Cor do anel de foco

    "disabled:pointer-events-none disabled:opacity-50",
    
    // Cores do seu tema aplicadas de forma consistente
    "border-2 border-[#017DB9]", 

    // Estilos opcionais para Dark Mode
    "dark:bg-slate-950 dark:border-[#22c362] dark:focus-visible:ring-[#22c362]"
  )}
/>  
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }