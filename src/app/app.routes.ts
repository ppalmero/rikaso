import { Routes } from '@angular/router';
import { StockManagementComponent } from './admin/stock-management/stock-management.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { AdminComponent } from './admin/admin/admin.component';
import { PosComponent } from './pos/pos.component';
import { SpecialPriceComponent } from './admin/special-price/special-price.component';
import { NewClientComponent } from './admin/new-client/new-client.component';

export const routes: Routes = [
    { path: '', component: PosComponent },
    { path: 'admin', component: AdminComponent,
        children: [
            { path: 'add-product', component: AddProductComponent },
            { path: 'stock', component: StockManagementComponent },
            { path: 'new-client', component: NewClientComponent },
            { path: 'special-prices', component: SpecialPriceComponent },
            { path: '', redirectTo: 'add-product', pathMatch: 'full' }
        ]
    }];
