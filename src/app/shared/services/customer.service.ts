import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Customers } from '../models/customers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(private firestore: Firestore) {}

  getCustomers(): Observable<Customers[]> {
    const ref = collection(this.firestore, 'customers');

    return collectionData(ref, { idField: 'id' }) as Observable<Customers[]>;
  }

  addCustomer(customer: any) {
    const ref = collection(this.firestore, 'customers');
    return addDoc(ref, {
      ...customer,
      createdAt: new Date(),
      active: true
    });
  }
}