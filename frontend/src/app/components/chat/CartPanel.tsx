"use client";

import { useState } from "react";
import { CartItem } from "../../types/chat";

interface CartPanelProps {
  cart: CartItem[];
  cartTotal: number;
}

export function CartPanel({ cart, cartTotal }: CartPanelProps) {
  const [showCart, setShowCart] = useState(false);

  if (cart.length === 0) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tax = cartTotal * 0.13;
  const grandTotal = cartTotal * 1.13;

  return (
    <>
      <button
        onClick={() => setShowCart((prev) => !prev)}
        aria-expanded={showCart}
        className="bg-gold/10 border-none border-b border-gold/[13%] px-4 py-2 flex justify-between items-center text-xs w-full cursor-pointer"
      >
        <span className="text-gold font-medium">
          🛒 {totalItems} item{totalItems > 1 ? "s" : ""}
        </span>
        <span className="text-gold font-bold text-[13px]">
          ${cartTotal.toFixed(2)}
        </span>
      </button>

      {showCart && (
        <div className="bg-surface border-b border-[#333] px-4 py-[10px] max-h-[140px] overflow-y-auto">
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between text-xs py-[3px] text-[#ccc]">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="text-gold">${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs pt-[6px] mt-[6px] border-t border-[#333] text-[#aaa]">
            <span>HST (13%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pt-1 font-bold text-gold">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </>
  );
}
