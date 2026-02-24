import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { CategoryService } from '../../shared/services/category.service';
import { Product } from '../../shared/models/product';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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

  imagePreview: string | null = null;
  uploadingImage = false;

  private imgbbApiKey = '0214b979a6fc244cbd91ce07422510fd';
  form: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStockAlert: [0, [Validators.required, Validators.min(0)]],
      active: [true, Validators.required],
      imageUrl: ['', Validators.required]
    });
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.form.get('imageUrl')?.valueChanges.subscribe((url: string | null) => {
      this.imagePreview = url;
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