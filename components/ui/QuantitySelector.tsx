"use client"
import { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react"; // Import the Plus and Minus icons

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: MouseEventHandler<HTMLButtonElement>;
  onDecrement: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  className,
}) => {
  return (
    <div className={cn("flex items-center", className)}>
      <button
        onClick={onDecrement}
        className="text-black rounded-l-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
      >
        <Minus size={15} /> {/* Use the Minus icon */}
      </button>
      <span className="px-4 text-black">{quantity}</span>
      <button
        onClick={onIncrement}
        className=" text-black rounded-r-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition"
      > 
        <Plus size={15} /> {/* Use the Plus icon */}
      </button>
    </div>
  );
};

export default QuantitySelector;

