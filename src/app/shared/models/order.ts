import { OrderItem } from "./order-item";

export interface Order {
    id?: string;
  orderNumber: string;
  createdAt: any;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'open' | 'paid' | 'cancelled';
}
