import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WithdrawPage } from './withdraw.page';
import { WithdrawRoutingModule } from './withdraw-routing.module';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WithdrawRoutingModule,
        SharedModule,
        IonicModule,
    ],
    declarations: [WithdrawPage],
})
export class WithdrawModule { }
