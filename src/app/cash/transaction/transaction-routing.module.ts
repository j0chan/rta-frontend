import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashTransactionPage } from './transaction.page';

const routes: Routes = [
  { path: '', component: CashTransactionPage },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashTransactionRoutingModule {}