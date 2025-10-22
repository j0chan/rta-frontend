import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FavoritePage } from './pages/favorite.page'
import { FavoriteRoutingModule } from './favorite-routing.module'
import { FormsModule } from '@angular/forms'
import { SharedModule } from '../shared/module/shared.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteRoutingModule,
    SharedModule
  ],
  declarations: [FavoritePage]
})
export class FavoritePageModule {}
