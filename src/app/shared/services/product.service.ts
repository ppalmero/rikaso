import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, increment, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(private firestore: Firestore) { }

  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'products');
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  }

  async updateStock(productId: string, newStock: number) {
    const ref = doc(this.firestore, `products/${productId}`);
    await updateDoc(ref, { stock: newStock });
  }

  async incrementStock(productId: string, amount: number) {
    const ref = doc(this.firestore, `products/${productId}`);
    await updateDoc(ref, {
      stock: increment(amount)
    });
  }

  async deleteProduct(productId: string) {
    const ref = doc(this.firestore, `products/${productId}`);
    await deleteDoc(ref);
  }

  async addProduct(product: any) {
    await addDoc(collection(this.firestore, 'products'), product);
  }
}
