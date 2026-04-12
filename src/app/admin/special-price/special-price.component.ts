import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product';
import { CustomerPriceService } from '../../shared/services/customer-price.service';
import { CustomerService } from '../../shared/services/customer.service';
import { Customers } from '../../shared/models/customers';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomersPrice } from '../../shared/models/customers-price';
import { ProductService } from '../../shared/services/product.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-special-price',
  imports: [NgFor, NgIf, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './special-price.component.html',
  styleUrl: './special-price.component.css'
})

export class SpecialPriceComponent implements OnInit {
  selectedCustomer: any = null;

  products: Product[] = [];

  customers: Customers[] = [];

  customerProductPrices: any[] = [];

  customerPrices: CustomersPrice[] = [];

  showProductSelector = false;
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  itemStates: { [key: string]: 'idle' | 'saving' | 'saved' } = {};

  constructor(private pricingService: CustomerPriceService, private customerService: CustomerService,
    private productService: ProductService, private toast: ToastService,
  ) { }

  ngOnInit() {
    this.customerService.getCustomers().subscribe(custs => {
      this.customers = custs;
    });

    this.productService.getProducts().subscribe(products => {
      this.allProducts = products.filter(p => p.active);
    });
  }

  onCustomerChange() {
    this.pricingService
      .getPricesByCustomer(this.selectedCustomer)
      .subscribe(prices => {
        this.customerPrices = prices;
        this.mapWithProducts();
      });
  }

  mapWithProducts() {
    this.customerProductPrices = this.customerPrices.map(p => {
      const product = this.allProducts.find(prod => prod.id === p.productId);

      return {
        customerPricesId: p.id,
        product,
        precio: p.precio
      };
    });
  }

  addProduct(product: Product) {
    this.pricingService.addPrice({
      customerId: this.selectedCustomer,
      productId: product.id,
      precio: product.price
    });
  }

  updatePrice(item: any) {
    this.itemStates[item.customerPricesId] = 'saving';
    this.pricingService.updatePrice(item.customerPricesId, {
      precio: item.precio
    }).then(() => {
      this.itemStates[item.customerPricesId] = 'saved';
      setTimeout(() => {
        this.itemStates[item.customerPricesId] = 'idle';
      }, 1500);
      this.toast.show('Precio especial actualizado.', 'success');
    }).catch(error => {
      console.error(error);
      this.toast.show('Error al actualizar el precio especial.', 'error');
    });

  }

  removeProduct(item: any) {
    this.pricingService.deletePrice(item.customerPricesId);
  }

  openProductSelector() {
    this.showProductSelector = true;
    this.filterProducts();
  }

  filterProducts() {
    const assignedIds = this.customerProductPrices.map(p => p.product.id);

    this.filteredProducts = this.allProducts
      .filter(p => !assignedIds.includes(p.id))
      .filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
  }

  onSearchChange(value: Event) {
    this.searchTerm = (value.target as HTMLInputElement).value;
    this.filterProducts();
  }

  addProductFromSelector(product: Product) {
    this.pricingService.addPrice({
      customerId: this.selectedCustomer,
      productId: product.id,
      precio: product.price
    }).then(() => {
      this.toast.show('Precio especial agregado al cliente', 'success');
    }).catch(error => {
      console.error(error);
      this.toast.show('Error al agregar el precio especial', 'error');
    });

    // opcional: cerrar modal
    // this.closeProductSelector();
  }

  closeProductSelector() {
    this.showProductSelector = false;
    this.searchTerm = '';
  }
}
