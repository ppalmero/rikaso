import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { CategoryService } from '../../shared/services/category.service';
import { Product } from '../../shared/models/product';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService, CategoryService],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  name = '';
  categoryId = '';
  price = 0;
  stock = 0;
  minStockAlert = 5;
  active = true;

  imageFile!: File;
  loading = false;

  categories: any[] = [];

  private imgbbApiKey = '0214b979a6fc244cbd91ce07422510fd';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  onFileSelected(event: any) {
    this.imageFile = event.target.files[0];
  }

  async uploadImage(): Promise<string | undefined> {
    if (!this.imageFile) return undefined;

    const formData = new FormData();
    formData.append('image', this.imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    return data.data.url;
  }

  async saveProduct() {
    if (!this.name || !this.categoryId) return;

    this.loading = true;

    try {
      const imageUrl = await this.uploadImage();

      const newProduct: Omit<Product, 'id'> = {
        name: this.name,
        categoryId: this.categoryId,
        price: this.price,
        stock: this.stock,
        minStockAlert: this.minStockAlert,
        active: this.active,
        imageUrl: imageUrl
      };

      await this.productService.addProduct(newProduct);

      this.resetForm();

    } catch (error) {
      console.error(error);
    }

    this.loading = false;
  }

  resetForm() {
    this.name = '';
    this.categoryId = '';
    this.price = 0;
    this.stock = 0;
    this.minStockAlert = 5;
    this.active = true;
  }
}