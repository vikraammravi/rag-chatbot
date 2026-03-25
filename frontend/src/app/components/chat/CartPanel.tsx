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
        style={{
          background: "#D4A24E18",
          border: "none",
          borderBottom: "1px solid #D4A24E22",
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          width: "100%",
          cursor: "pointer",
        }}
      >
        <span style={{ color: "#D4A24E", fontWeight: 500 }}>
          🛒 {totalItems} item{totalItems > 1 ? "s" : ""}
        </span>
        <span style={{ color: "#D4A24E", fontWeight: 700, fontSize: 13 }}>
          ${cartTotal.toFixed(2)}
        </span>
      </button>

      {showCart && (
        <div
          style={{
            background: "#1E1E1E",
            borderBottom: "1px solid #333",
            padding: "10px 16px",
            maxHeight: 140,
            overflowY: "auto",
          }}
        >
          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                padding: "3px 0",
                color: "#ccc",
              }}
            >
              <span>
                {item.quantity}x {item.name}
              </span>
              <span style={{ color: "#D4A24E" }}>${item.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              paddingTop: 6,
              marginTop: 6,
              borderTop: "1px solid #333",
              color: "#aaa",
            }}
          >
            <span>HST (13%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              paddingTop: 4,
              fontWeight: 700,
              color: "#D4A24E",
            }}
          >
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </>
  );
}
