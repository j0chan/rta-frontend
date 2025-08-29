import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { PointRoutingModule } from './point-routing.module'
import { PointPage } from './point.page'
import { SharedModule } from '../shared/module/shared.module'
import { IonicModule } from '@ionic/angular'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        PointRoutingModule,
        SharedModule,
        IonicModule,
    ],
    declarations: [
        PointPage
    ],
})
export class PointPageMudule { }
