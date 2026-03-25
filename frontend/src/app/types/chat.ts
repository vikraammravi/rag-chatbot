export interface Message {
  role: "user" | "bot";
  text: string;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}
