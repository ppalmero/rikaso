import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product';

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

  constructor(private productService: ProductService) {}

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
}