import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepositPage } from './deposit.page';
import { DepositRoutingModule } from './deposit-routing.module';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DepositRoutingModule,
        SharedModule,
        IonicModule,
    ],
    declarations: [DepositPage],
})
export class DepositModule { }
