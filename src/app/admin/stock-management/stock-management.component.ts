import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-management.component.html',
  styleUrl: './stock-management.component.css'
})
export class StockManagementComponent implements OnInit {

  products: Product[] = [];
  selectedProducts: string[] = [];
  stockToAdd = 0;
  stockUpdates: { [productId: string]: number } = {};

  constructor(private productService: ProductService, private toast: ToastService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  toggleSelection(productId: string) {
    if (this.selectedProducts.includes(productId)) {
      this.selectedProducts = this.selectedProducts.filter(id => id !== productId);
    } else {
      this.selectedProducts.push(productId);
    }
  }

  async updateStock(product: Product) {
    const amount = this.stockUpdates[product.id];
    if (amount == null || amount === 0) {
      this.toast.show('Ingrese una cantidad válida', 'error');
      return;
    }
    const newStock = product.stock + amount;
    if (newStock < 0) {
      this.toast.show('El stock no puede ser negativo', 'error');
      return;
    }
    try {
      await this.productService.setStock(product.id, newStock);
      this.toast.show('Stock actualizado correctamente', 'success');
      this.stockUpdates[product.id] = undefined as any;
    } catch (error) {
      this.toast.show('Error al actualizar stock', 'error');
    }
  }

  async addStock() {
    if (this.stockToAdd <= 0) return;

    for (let productId of this.selectedProducts) {
      await this.productService.incrementStock(productId, this.stockToAdd);
    }

    this.selectedProducts = [];
    this.stockToAdd = 0;
  }

  async deleteProduct(productId: string) {
    const confirmDelete = confirm('¿Eliminar producto?');
    if (!confirmDelete) return;

    await this.productService.deleteProduct(productId);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números (48–57) y guión (- = 45)
    if (
      (charCode >= 48 && charCode <= 57) ||
      charCode === 45
    ) {
      return;
    }
    event.preventDefault();
  }
}