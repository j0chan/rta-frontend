import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FavoritePage } from './pages/favorite.page'
import { FavoriteRoutingModule } from './favorite-routing.module'
import { FavoriteButtonComponent } from './components/favorite-button.component'

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FavoriteRoutingModule
  ],
  declarations: [FavoritePage, FavoriteButtonComponent]
})
export class FavoritePageModule {}
