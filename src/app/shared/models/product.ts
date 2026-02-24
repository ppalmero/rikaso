export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  minStockAlert: number;
  active: boolean;
  imageUrl?: string;   // 👈 NUEVO
}
