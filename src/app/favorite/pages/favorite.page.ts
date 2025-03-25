import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FavoriteService } from 'src/app/shared/services/favorite.service'

interface Favorite {
  store_id: number
  store_name: string
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: false
})
export class FavoritePage implements OnInit {
  favorites: Favorite[] = []

  constructor(
    private favoriteService: FavoriteService,
    private route: ActivatedRoute
  ) {}
  

  user_id: number = 0

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        const id = params.get('user_id')
        if (id) {
            this.user_id = +id // 문자열을 숫자로 변환
            console.log(this.user_id)
            this.loadFavorites()
        }
    })
  }

  loadFavorites(event?: any) {

    this.favoriteService.readFavoritesById(this.user_id).subscribe({
      next: (res) => {
        this.favorites = res.data || []
        if (event) event.target.complete()
      },
      error: (error) => {
        event?.target.complete()
      },
    })
  }

  removeFavorite(store_id: number) {
    this.favoriteService.deleteFavorite(this.user_id, store_id).subscribe(() => {
      this.favorites = this.favorites.filter(fav => fav.store_id !== store_id)
    })
  }
}