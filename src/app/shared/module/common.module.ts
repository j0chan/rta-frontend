import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { SearchBarComponent } from '../components/search-bar/search-bar.component'
import { FooterMenuComponent } from '../components/footer-menu/footer-menu.component'
import { IonicModule } from '@ionic/angular'

@NgModule({
  declarations: [
    SearchBarComponent,
    FooterMenuComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    SearchBarComponent,
    FooterMenuComponent
  ]
})
export class CommonComponentsModule {}