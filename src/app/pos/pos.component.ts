import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, runTransaction, doc, collection } from '@angular/fire/firestore';
import { ProductService } from '../shared/services/product.service';
import { OrderService } from '../shared/services/order.service';
import { Product } from '../shared/models/product';
import { Order } from '../shared/models/order';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Category } from '../shared/models/category';
import { CategoryService } from '../shared/services/category.service';
import { ToastService } from '../shared/services/toast.service';
import { AudioService } from '../shared/services/audio.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})

export class PosComponent implements OnInit {

  /*categories = [
    { id: 'clasicos', name: 'Clásicos' },
    { id: 'especiales', name: 'Especiales' },
    { id: 'combos', name: 'Combos' },
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'extras', name: 'Extras' },
    { id: 'promos', name: 'Promos' }
  ];*/

  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  allProducts: Product[] = [];

  products: Product[] = [];
  filteredProducts: Product[] = [];
  //selectedCategory: string | null = null;

  orderItems: any[] = [];
  discount: number = 0;

  currentUser = 'Carlos';
  orderNumber = Math.floor(Math.random() * 10000);
  currentTime = '';

  showCheckoutModal = false;
  isProcessing = false;

  showDiscountModal = false;
  discountInput = 0;
  discountType: 'percent' | 'amount' = 'percent';

  private orderSub!: Subscription;

  isDrawerOpen = false;

  animatedProductId: string | null = null;

  currentOrderNumber: string | null = null;
  branchId = 'S1';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private firestore: Firestore,
    private categoryService: CategoryService,
    private toast: ToastService,
    private audio: AudioService
  ) { }

  ngOnInit(): void {
    //this.loadProducts();
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats.filter(c => c.active);
    });

    this.productService.getProducts().subscribe(products => {
      this.allProducts = products.filter(p => p.active);
      this.applyFilter();
    });

    this.orderService.getCurrentOrderNumber(this.branchId).then(num => {
      this.currentOrderNumber = num;
    });

    this.listenOrder();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  // =============================
  // PRODUCTOS
  // =============================

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilter();
    });
  }

  /*selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.applyFilter();
  }*/

  selectCategory(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  applyFilter() {
    /*if (!this.selectedCategory) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(
      p => p.categoryId === this.selectedCategory
    );*/
    if (!this.selectedCategoryId) {
      this.filteredProducts = this.allProducts;
      return;
    }

    this.filteredProducts = this.allProducts.filter(
      p => p.categoryId === this.selectedCategoryId
    );
  }

  addProduct(product: Product) {
    if (product.stock <= 0) return;
    this.orderService.addProduct(product);
    this.audio.playAdd();
    this.triggerCardAnimation(product.id);
  }

  triggerCardAnimation(productId: string) {
    this.animatedProductId = productId;
    setTimeout(() => {
      this.animatedProductId = null;
    }, 300);
  }

  hasLowStock(categoryId: string): boolean {
    return this.allProducts.some(product =>
      product.categoryId === categoryId &&
      product.stock <= product.minStockAlert &&
      product.active
    );
  }
  // =============================
  // ORDEN
  // =============================

  get isCartEmpty(): boolean {
    return this.orderItems.length === 0;
  }

  listenOrder() {
    this.orderSub = this.orderService.items$.subscribe(items => {
      this.orderItems = items;
      //this.calculateTotals();
    });
  }

  increaseQty(productId: string) {
    this.orderService.increaseQty(productId);
  }

  decreaseQty(productId: string) {
    this.orderService.decreaseQty(productId);
  }

  removeItem(productId: string) {
    this.orderService.removeItem(productId);
  }

  get subtotal(): number {
    return this.orderItems.reduce((acc, item) => acc + item.total, 0);
  }

  get total(): number {
    const result = this.subtotal - this.discount;
    return result < 0 ? 0 : result;
  }

  cancelOrder() {

    if (this.orderItems.length === 0) return;

    const confirmCancel = confirm("¿Cancelar pedido actual?");
    if (!confirmCancel) return;

    this.orderService.clearOrder();
    this.removeDiscount();
    this.showCheckoutModal = false;
    this.showDiscountModal = false;
    this.orderNumber = Math.floor(Math.random() * 10000);
  }


  /*calculateTotals() {
    this.subtotal = this.orderService.getSubtotal();
    this.total = this.subtotal - this.discount;
  }*/

  applyDiscount() {
    if (this.isCartEmpty) return;
    if (this.discountType === 'percent') {
      this.discount = (this.subtotal * this.discountInput) / 100;
    } else {
      this.discount = this.discountInput;
    }
    // Seguridad: no permitir descuento mayor al subtotal
    if (this.discount > this.subtotal) {
      this.discount = this.subtotal;
    }
    this.showDiscountModal = false;
    this.discountInput = 0;
  }

  removeDiscount() {
    this.discount = 0;
  }


  // =============================
  // CHECKOUT CON TRANSACCIÓN
  // =============================

  checkout() {
    if (this.orderItems.length === 0) return;
    //this.showCheckoutModal = true;
    this.isDrawerOpen = false; // cerrar drawer
    this.showCheckoutModal = true;
  }

  async confirmCheckout() {

    if (this.isProcessing) return;

    //const orderNumber = await this.orderService.getNextOrderNumber(this.branchId);

    this.isProcessing = true;
    const order: Order = {
      orderNumber: this.currentOrderNumber!,
      createdAt: new Date(),
      userId: this.currentUser,
      items: this.orderItems,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      status: 'paid'
    };

    try {

      await runTransaction(this.firestore, async (transaction) => {

        const productRefs: any[] = [];
        const productSnaps: any[] = [];

        // 1️⃣ Leer todo
        for (let item of order.items) {
          const ref = doc(this.firestore, `products/${item.productId}`);
          productRefs.push(ref);
          productSnaps.push(await transaction.get(ref));
        }

        // 2️⃣ Validar stock
        productSnaps.forEach((snap, index) => {
          const currentStock = snap.data()?.['stock'];
          const quantity = order.items[index].quantity;

          if (currentStock < quantity) {
            throw new Error(`Stock insuficiente para ${order.items[index].name}`);
          }
        });

        // 3️⃣ Actualizar stock
        productSnaps.forEach((snap, index) => {
          const currentStock = snap.data()?.['stock'];
          const quantity = order.items[index].quantity;

          transaction.update(productRefs[index], {
            stock: currentStock - quantity
          });
        });

        // 4️⃣ Guardar orden
        const orderRef = doc(collection(this.firestore, 'orders'));
        transaction.set(orderRef, order);
        this.orderService.getNextOrderNumber(this.branchId).then(num => {
          this.currentOrderNumber = num;
        });
      });

      // 🔥 LIMPIAR
      this.orderService.clearOrder();
      this.discount = 0;
      this.showCheckoutModal = false;
      this.removeDiscount();
      this.closeDrawer();
      this.toast.show('Orden cobrada correctamente', 'success');
    } catch (error: any) {
      this.toast.show('Error al procesar la orden', 'error');
    } finally {
      this.isProcessing = false;
    }
  }

  closeModal() {
    this.showCheckoutModal = false;
  }

  openDiscountModal() {
    if (this.orderItems.length === 0) return;
    this.showDiscountModal = true;
  }

  openDrawer() {
    if (this.orderItems.length === 0) return;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  async prepareNewOrder() {
    this.currentOrderNumber = await this.orderService.getCurrentOrderNumber(this.branchId);
  }

  ngOnDestroy() {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }
}
