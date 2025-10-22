import { Component, OnInit } from '@angular/core'
import { FavoriteService, FavoriteWithStore } from 'src/app/shared/services/favorite.service'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ToastController } from '@ionic/angular'
import { StoresService } from 'src/app/shared/services/stores.service'

type FavoriteView = {
  store_id: number
  store_name?: string
  category_name?: string
  address?: string
  contact_number?: string
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: false,
})
export class FavoritePage implements OnInit {
  favorites: FavoriteView[] = []
  viewMode: 'list' | 'map' = 'list'
  searchTerm = ''
  userId = 0

  selectedStore: ReadStore | null = null
  currentLat: number | null = null
  currentLng: number | null = null

  constructor(
    private favoriteService: FavoriteService,
    private toastController: ToastController,
    private storesService: StoresService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      console.warn('로그인 정보가 없습니다.')
      return
    }

    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    this.userId = payload.user_id

    this.loadFavorites()
  }

  // 검색어가 반영된 필터링 결과
  get filteredFavorites(): FavoriteView[] {
    const term = this.searchTerm ?? ''.trim().toLowerCase()
    if (!term) return this.favorites
    return this.favorites.filter((s) =>
      [
        s.store_name,
        // (s as any).category_name,
        (s as any).address,
        (s as any).contact_number
      ]
        .filter(Boolean)
        .some((v: string) => v.toLowerCase().includes(term))
    )
  }

  // 즐겨찾기 목록 불러오기
  loadFavorites(event?: any) {
    this.favoriteService.readFavoritesById(this.userId).subscribe({
      next: (res) => {
        const rows = Array.isArray(res) ? res : (res?.data ?? [])
        this.favorites = rows ?? []
        event?.target?.complete?.()
      },
      error: (err) => {
        console.error('즐겨찾기 목록 불러오기 실패:', err)
        event?.target?.complete?.()
      }
    })
  }



  // 즐겨찾기 삭제
  removeFavorite(store_id: number) {
    this.favoriteService.deleteFavorite(this.userId, store_id).subscribe({
      next: async () => {
        this.favorites = this.favorites.filter(fav => fav.store_id !== store_id)
        const toast = await this.toastController.create({
          message: '즐겨찾기에서 삭제되었습니다.',
          duration: 2000,
          position: 'top',
          color: 'warning'
        })
        toast.present()
      },
      error: (err) => console.error('즐겨찾기 삭제 실패:', err)
    })
  }

  // 지도에서 보기
  focusStoreOnMap(storeId: number) {
    this.storesService.getStoreById(storeId).subscribe({
      next: (res) => {
        this.selectedStore = res.data as ReadStore
        if (!this.selectedStore) {
          console.warn('가게 정보를 불러오지 못했습니다.')
          return
        }

        // 현위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              this.currentLat = pos.coords.latitude
              this.currentLng = pos.coords.longitude
              this.switchToMap()
            },
            (err) => {
              console.warn('현위치 가져오기 실패:', err)
              this.switchToMap()
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          )
        } else {
          this.switchToMap()
        }
      },
      error: (err) => {
        console.error('가게 정보 불러오기 실패:', err)
      },
    })
  }
  

  // 템플릿에서 호출하는 메서드들 추가
  switchToMap() {
    this.viewMode = 'map'
    // 필요하다면 여기서 지도 초기화/리사이즈 처리
  }
}
