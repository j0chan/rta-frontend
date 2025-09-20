import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { MyGiftCardPage } from './my-gift-card.page'
import { MyGiftCardRoutingModule } from './my-gift-card-routing.module'
import { SharedModule } from 'src/app/shared/module/shared.module'
import { IonicModule } from '@ionic/angular'

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,     // 백엔드 연결
        MyGiftCardRoutingModule,
        SharedModule,
        IonicModule,
    ],

    declarations: [
        MyGiftCardPage
    ],
})
export class MyGiftCardModule { }
