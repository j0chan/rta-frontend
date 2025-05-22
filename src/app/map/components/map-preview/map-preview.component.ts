import { Component, AfterViewInit, Input } from '@angular/core'
import { MapsService } from 'src/app/shared/services/maps.service'

declare const naver: any

@Component({
  selector: 'app-map-preview',
  templateUrl: './map-preview.component.html',
  styleUrls: ['./map-preview.component.scss'],
  standalone: false
})
export class MapPreviewComponent implements AfterViewInit {
  @Input() lat: number | null = null
  @Input() lng: number | null = null

  map!: naver.maps.Map
  marker: naver.maps.Marker | null = null

  constructor(private mapsService: MapsService) {}

  ngAfterViewInit(): void {
    this.loadMapScript()
  }

  loadMapScript(): void {
    if (document.getElementById('naver-map-script-preview')) {
      this.initMap()
      return
    }

    this.mapsService.getClientId().subscribe({
      next: (res) => {
        const script = document.createElement('script')
        script.id = 'naver-map-script-preview'
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${res.clientId}`
        script.onload = () => this.initMap()
        document.body.appendChild(script)
      },
      error: (err) => console.error('Client ID 요청 실패:', err)
    })
  }

  initMap(): void {
    const container = document.getElementById('map-preview')
    if (!container) return

    const normalizedLat = this.lat !== null ? this.normalizeCoordinate(this.lat, true) : null
    const normalizedLng = this.lng !== null ? this.normalizeCoordinate(this.lng, false) : null

    const center = (normalizedLat !== null && normalizedLng !== null)
        ? new naver.maps.LatLng(normalizedLat, normalizedLng)
        : new naver.maps.LatLng(37.5665, 126.9780) // fallback

    this.map = new naver.maps.Map(container, {
        center,
        zoom: 16
    })

    if (normalizedLat !== null && normalizedLng !== null) {
        this.marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(normalizedLat, normalizedLng),
            map: this.map,
            title: '가게 위치'
        })
    } else {
        console.warn('좌표 변환 실패로 마커 생략')
    }
  }

  // 좌표 변환
  normalizeCoordinate(value: number | string, isLat = true): number | null {
    const num = parseFloat(value.toString())
    const length = Math.floor(Math.log10(num)) + 1
  
    if (isLat) {
      if (length === 7) return num / 1e5
      if (length === 8) return num / 1e6
      if (length === 9) return num / 1e7
      if (length === 10) return num / 1e8
    } else {
      if (length === 7) return num / 1e4
      if (length === 8) return num / 1e5
      if (length === 9) return num / 1e6
      if (length === 10) return num / 1e7
    }
  
    return null
  }
}