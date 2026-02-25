import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../shared/services/product.service';
import { CategoryService } from '../../shared/services/category.service';
import { Product } from '../../shared/models/product';
import { ToastService } from '../../shared/services/toast.service';

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
    private fb: FormBuilder,
    private toast: ToastService
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

  allowOnlyNumbersDecimal(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números (48–57) y punto decimal (46)
    if (
      (charCode >= 48 && charCode <= 57) ||
      charCode === 46
    ) {
      return;
    }
    event.preventDefault();
  }

  /*onFileSelected(event: any) {
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
  }*/

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    // Preview inmediata
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    // Subir a imgbb
    await this.uploadToImgbb(file);
  }

  async uploadToImgbb(file: File) {
    this.uploadingImage = true;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${this.imgbbApiKey}`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      const imageUrl = data.data.url;
      // Guardamos la URL en el form
      this.form.patchValue({
        imageUrl: imageUrl
      });
    } catch (error) {
      console.error('Error subiendo imagen', error);
    } finally {
      this.uploadingImage = false;
    }
  }

  /*async saveProduct() {
    if (!this.name || !this.categoryId) return;

    this.loading = true;

    try {
      //const imageUrl = await this.uploadImage();

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
      this.toast.show('Producto agregado correctamente', 'success');
    } catch (error) {
      console.error(error);
      this.toast.show('Error al agregar el producto', 'error');
    }

    this.loading = false;
  }*/

  async saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.uploadingImage) {
      this.toast.show('Espere a que termine la subida de imagen', 'error');
      return;
    }
    this.loading = true;
    try {
      const formValue = this.form.value;
      const newProduct: Omit<Product, 'id'> = {
        name: formValue.name!,
        categoryId: formValue.categoryId!,
        price: Number(formValue.price),
        stock: Number(formValue.stock),
        minStockAlert: Number(formValue.minStockAlert),
        active: formValue.active!,
        imageUrl: formValue.imageUrl!
      };
      await this.productService.addProduct(newProduct);
      this.toast.show('Producto agregado correctamente', 'success');
      this.form.reset({
        active: true,
        stock: 0,
        minStockAlert: 0
      });
      this.imagePreview = null;
    } catch (error) {
      console.error(error);
      this.toast.show('Error al agregar el producto', 'error');
    } finally {
      this.loading = false;
    }
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