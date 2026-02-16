export interface OrderItem {
    productId: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  total: number;
}
