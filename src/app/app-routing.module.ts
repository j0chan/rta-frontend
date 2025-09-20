import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AdminGuard } from './shared/admin/admin.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
  },
  {
    path: 'stores',
    loadChildren: () => import('./store/store.module').then(m => m.StorePageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'my-page',
    loadChildren: () => import('./my-page/my-page.module').then(m => m.MyPageModule)
  },
  {
    path: 'manager',
    loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'favorite',
    loadChildren: () => import('./favorite/favorite.module').then(m => m.FavoritePageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'my-gift-card',
    loadChildren: () => import('./gift-card/my-gift-card/my-gift-card.module').then(m => m.MyGiftCardModule)
  },
  {
    path: 'gift-card-store',
    loadChildren: () =>
      import('./gift-card/gift-card-store/gift-card-store.module').then(m => m.GiftCardStoreModule),
  },
  {
    path: 'gift-card-store-detail/:id',
    loadChildren: () =>
      import('./gift-card/gift-card-store-detail/gift-card-store-detail.module').then(m => m.GiftCardStoreDetailModule),
  },
  {
    path: 'gift-card-create',
    loadChildren: () =>
      import('./gift-card/gift-card-create/gift-card-create.module').then(m => m.GiftCardCreateModule),
      canMatch: [AdminGuard],
  },
  {
    path: 'gift-card-used',
    loadChildren: () =>
      import('./gift-card/gift-card-used/gift-card-used.module').then(m => m.GiftCardUsedModule),
  },
   {
    path: 'point',
    loadChildren: () => import('./point/point.module').then( m => m.PointPageMudule)
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
