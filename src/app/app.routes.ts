import { Routes } from '@angular/router';
import { StockManagementComponent } from './admin/stock-management/stock-management.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AdminComponent } from './admin/admin/admin.component';
import { PosComponent } from './pos/pos.component';

export const routes: Routes = [
    { path: '', component: PosComponent },
    { path: 'admin', component: AdminComponent,
        children: [
            { path: 'add-product', component: AddProductComponent },
            { path: 'stock', component: StockManagementComponent },
            { path: '', redirectTo: 'add-product', pathMatch: 'full' }
        ]
    }];
