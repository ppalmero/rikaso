import { OrderItem } from "./order-item";

export interface Order {
    id?: string;
  orderNumber: string;
  createdAt: any;
  userId: string;
  items: OrderItem[];
  customerId: string;
  subtotal: number;
  discount: number;
  total: number;
  status: 'open' | 'paid' | 'cancelled';
}
