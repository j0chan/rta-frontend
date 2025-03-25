import { Component, Input, OnInit } from '@angular/core'
import { ToastController } from '@ionic/angular'
import { FavoriteService } from 'src/app/shared/services/favorite.service'

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite.component.html',
  standalone: false
})
export class FavoriteButtonComponent implements OnInit {
  @Input() storeId!: number
  @Input() userId!: number
  isFavorite = false

  constructor(private favoriteService: FavoriteService, private toastCtrl: ToastController) {}

  ngOnInit() {
    this.checkIfFavorite()
  }

  checkIfFavorite() {
    this.favoriteService.readFavoritesById(this.userId).subscribe({
      next: (res) => {
        this.isFavorite = !!res.data?.find(fav => fav.store_id === this.storeId)
      },
    })
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.favoriteService.deleteFavorite(this.userId, this.storeId).subscribe(() => {
        this.isFavorite = false
        this.presentToast('즐겨찾기에서 삭제되었습니다.')
      })
    } else {
      this.favoriteService.createFavorite(this.userId, this.storeId).subscribe(() => {
        this.isFavorite = true
        this.presentToast('즐겨찾기에 추가되었습니다.')
      })
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1500,
      position: 'bottom',
    })
    await toast.present()
  }
}