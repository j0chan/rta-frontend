import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SearchBarComponent } from '../components/search-bar/search-bar.component'
import { FooterMenuComponent } from '../components/footer-menu/footer-menu.component'
import { IonicModule } from '@ionic/angular'
import { EventStatusPipe } from '../pipes/event-status.pipe'
import { CategoryPipe } from '../pipes/category.pipe'
import { KoreanDatePipe } from '../pipes/koreanDate.pipe'
import { RequestStatusPipe } from '../pipes/request-status.pipe'

@NgModule({
  declarations: [
    SearchBarComponent,
    FooterMenuComponent,
    EventStatusPipe,
    CategoryPipe,
    KoreanDatePipe,
    RequestStatusPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    SearchBarComponent,
    FooterMenuComponent,
    EventStatusPipe,
    CategoryPipe,
    KoreanDatePipe,
    RequestStatusPipe,
  ]
})
export class SharedModule { }