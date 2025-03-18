import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SearchBarComponent } from '../components/search-bar/search-bar.component'
import { FooterMenuComponent } from '../components/footer-menu/footer-menu.component'
import { IonicModule } from '@ionic/angular'
import { EventStatusPipe } from '../pipes/event-status.pipe'
import { CategoryPipe } from '../pipes/category.pipe'

@NgModule({
  declarations: [
    SearchBarComponent,
    FooterMenuComponent,
    EventStatusPipe,
    CategoryPipe
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
    CategoryPipe
  ]
})
export class SharedModule {}