import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './pages/add-product/add-product.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'add-product', component: AddProductComponent },
            { path: '**', redirectTo: 'add-product' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingModule { }
