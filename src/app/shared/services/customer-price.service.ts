import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class CustomerPriceService {

  constructor(private firestore: Firestore) {}

  async getPricesByCustomer(customerId: string) {

    const ref = collection(this.firestore, 'customersPrice');
    const q = query(ref, where('customerId', '==', customerId));

    const snap = await getDocs(q);

    const prices: any = {};

    snap.forEach(doc => {
      const data = doc.data();
      prices[data['productId']] = data['precio'];
    });

    return prices;
  }
}