import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesRef;

  constructor(private firestore: Firestore) {
    this.categoriesRef = collection(this.firestore, 'categories');
  }

  // Obtener categorías activas ordenadas
  getCategories(): Observable<Category[]> {
    return collectionData(this.categoriesRef, {
      idField: 'id'
    }) as Observable<Category[]>;
  }

  // Crear categoría
  async addCategory(category: Omit<Category, 'id'>) {
    await addDoc(this.categoriesRef, category);
  }

  // Actualizar categoría
  async updateCategory(id: string, data: Partial<Category>) {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    await updateDoc(categoryDoc, data);
  }

  // Eliminar categoría
  async deleteCategory(id: string) {
    const categoryDoc = doc(this.firestore, `categories/${id}`);
    await deleteDoc(categoryDoc);
  }
}