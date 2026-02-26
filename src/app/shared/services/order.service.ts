import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderItem } from '../models/order-item';
import { Product } from '../models/product';
import { doc, Firestore, getDoc, runTransaction } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private items: OrderItem[] = [];
  private itemsSubject = new BehaviorSubject<OrderItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  constructor(private firestore: Firestore) { }

  private formatNumber(num: number): string {
    return num.toString().padStart(6, '0');
  }

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

  async getNextOrderNumber(branchId: string): Promise<string> {
    const counterRef = doc(this.firestore, `counters/${branchId}`);
    return await runTransaction(this.firestore, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        throw new Error('Order counter does not exist');
      }
      const currentNumber = counterDoc.data()['lastNumber'] || 0;
      const newNumber = currentNumber + 1;
      transaction.update(counterRef, {
        lastNumber: newNumber
      });
      return `${branchId}-${this.formatNumber(newNumber)}`;
    });

  }

  async getCurrentOrderNumber(branchId: string): Promise<string> {
    const counterRef = doc(this.firestore, `counters/${branchId}`);
    const snap = await getDoc(counterRef);
    if (!snap.exists())
      return `${branchId}-000001`;

    const lastNumber = snap.data()['lastNumber'] || 0;
    return `${branchId}-${this.formatNumber(lastNumber)}`;
  }

}
