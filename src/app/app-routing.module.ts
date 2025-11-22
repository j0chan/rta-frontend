import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { AdminGuard } from './shared/guard/admin.guard'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
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
    path: 'gift-card',
    loadChildren: () =>
      import('./gift-card/gift-card.module').then(m => m.GiftCardModule),
  },
  {
    path: 'point',
    loadChildren: () => import('./point/point.module').then(m => m.PointPageMudule)
  },
  {
    path: 'deposit',
    loadChildren: () => import('./cash/deposit/deposit.module').then(m => m.DepositModule)
  },
  {
    path: 'withdraw',
    loadChildren: () => import('./cash/withdraw/withdraw.module').then(m => m.WithdrawModule)
  },
  {
    path: 'transaction',
    loadChildren: () => import('./cash/transaction/transaction.module').then(m => m.CashTransactionModule)
  },
  {
    path: 'notice',
    loadChildren: () => import('./notice/notice.module').then(m => m.NoticeModule)
  },
  {
    path: 'promotion',
    loadChildren: () => import('./promotion/promotion.module').then(m => m.PromotionModule)
  },
  {
    path: 'recommended-stores',
    loadChildren: () => import('./recommended-stores/recommended-stores.module').then(m => m.RecommendedStoresModule)
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
