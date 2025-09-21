import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositPage } from './deposit.page';

const routes: Routes = [
    {
        path: '',
        component: DepositPage,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DepositRoutingModule { }