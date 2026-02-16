import { Injectable } from '@angular/core';
import { runTransaction, doc, Firestore, collection } from '@angular/fire/firestore';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private firestore: Firestore) {}

  async checkout(order: Order) {

  await runTransaction(this.firestore, async (transaction) => {

    for (let item of order.items) {

      const productRef = doc(this.firestore, `products/${item.productId}`);
      const productSnap = await transaction.get(productRef);

      const currentStock = productSnap.data()?.['stock'];

      if (currentStock < item.quantity) {
        throw new Error('Stock insuficiente');
      }

      transaction.update(productRef, {
        stock: currentStock - item.quantity
      });
    }

    // guardar orden
    const orderRef = doc(collection(this.firestore, 'orders'));
    transaction.set(orderRef, order);

  });

}
}
