import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/module/shared.module';
import { GiftCardUsedRoutingModule } from './gift-card-used-routing.module';
import { GiftCardUsedPage } from './gift-card-used.page';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        IonicModule,
        SharedModule,
        GiftCardUsedRoutingModule,
    ],
    declarations: [GiftCardUsedPage],
})
export class GiftCardUsedModule { }
