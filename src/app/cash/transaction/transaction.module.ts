import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashTransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { CashTransactionPage } from './transaction.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CashTransactionRoutingModule,
        SharedModule,
        IonicModule,
    ],
    declarations: [CashTransactionPage],
})
export class CashTransactionModule { }
