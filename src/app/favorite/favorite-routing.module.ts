import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { FavoritePage } from './pages/favorite.page'

const routes: Routes = [
  {
    path: '',
    component: FavoritePage
  },
  {
    path: ':user_id',
    component: FavoritePage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteRoutingModule {}