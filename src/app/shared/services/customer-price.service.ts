import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerPriceService {

  constructor(private firestore: Firestore) {}

  async getPricesByCustomerPOS(customerId: string) {

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

  getPricesByCustomer(customerId: string): Observable<any[]> {
    const ref = collection(this.firestore, 'customersPrice');
    const q = query(ref, where('customerId', '==', customerId));
    return collectionData(q, { idField: 'id' });
  }

  addPrice(data: any) {
    const ref = collection(this.firestore, 'customersPrice');
    return addDoc(ref, data);
  }

  updatePrice(id: string, data: any) {
    const ref = doc(this.firestore, `customersPrice/${id}`);
    return updateDoc(ref, data);
  }

  deletePrice(id: string) {
    const ref = doc(this.firestore, `customersPrice/${id}`);
    return deleteDoc(ref);
  }
}