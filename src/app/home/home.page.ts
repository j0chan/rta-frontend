import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../shared/services/auth.service'
import { ImagesService } from '../shared/services/images.service'
import { MapsService } from '../shared/services/maps.service'
import { ReadStore } from '../shared/model/stores/read-store.interface'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // 로그인 상태 관찰
  isLoggedIn$ = this.authService.isLoggedIn$

  currentLat: number | null = null
  currentLng: number | null = null
  stores: ReadStore[] = []

  constructor(
    private authService: AuthService,
    private router: Router,
    private imagesService: ImagesService,
    private mapsService: MapsService,
  ) { }

  async signOut() {
    this.authService.signOut()
    await this.router.navigate(['/signin'])
  }

  ngOnInit() {
    const hasRefreshed = localStorage.getItem('homePageRefreshed')
    if (!hasRefreshed) {
      localStorage.setItem('homePageRefreshed', 'true')
      window.location.reload()
    } else {
      localStorage.removeItem('homePageRefreshed')
      this.initMiniMap() // 새로고침 후 정상 로직 수행
    }
  }

  initMiniMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLat = position.coords.latitude
          this.currentLng = position.coords.longitude

          // 현재 위치 기반 주변 가게 조회
          this.mapsService.readStoreByCurrentLocation(this.currentLat, this.currentLng).subscribe(
            (stores) => {
              this.stores = stores
              this.sendStoresToMiniMap()
            },
            (error) => {
              console.error('주변 가게 정보 불러오기 실패:', error)
            }
          )
        },
        (error) => {
          console.error('현재 위치 정보 가져오기 실패:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      console.error('이 브라우저는 위치 정보를 지원하지 않습니다.')
    }
  }

  sendStoresToMiniMap() {
    const iframe = document.getElementById('mini-map-iframe') as HTMLIFrameElement
    if (iframe?.contentWindow && this.currentLat !== null && this.currentLng !== null) {
      iframe.contentWindow.postMessage({
        stores: this.stores,
        isSearchPerformed: false,
        currentLocation: {
          lat: this.currentLat,
          lng: this.currentLng
        }
      }, '*')
    }
  }

  goToFullMap() {
    this.router.navigate(['/map'])
  }
}
