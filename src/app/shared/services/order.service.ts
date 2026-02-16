import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../models/order-item';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private items: OrderItem[] = [];
  private itemsSubject = new BehaviorSubject<OrderItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  addProduct(product: Product) {

    if (product.stock <= 0) return;

    const existing = this.items.find(i => i.productId === product.id);

    if (existing) {
      existing.quantity++;
      existing.total = existing.quantity * existing.price;
    } else {
      this.items.push({
        productId: product.id!,
        name: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      });
    }

    this.itemsSubject.next([...this.items]);
  }

  removeItem(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.itemsSubject.next([...this.items]);
  }

  increaseQty(productId: string) {
    const item = this.items.find(i => i.productId === productId);
    if (!item) return;

    item.quantity++;
    item.total = item.quantity * item.price;
    this.itemsSubject.next([...this.items]);
  }

  decreaseQty(productId: string) {
    const item = this.items.find(i => i.productId === productId);
    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    item.total = item.quantity * item.price;
    this.itemsSubject.next([...this.items]);
  }

  clearOrder() {
    this.items = [];
    this.itemsSubject.next([]);
  }

  getSubtotal(): number {
    return this.items.reduce((acc, i) => acc + i.total, 0);
  }

}
