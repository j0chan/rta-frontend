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

    this.addCurrentLocationMarker()
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

  private addCurrentLocationMarker(): void {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
        (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const position = new naver.maps.LatLng(lat, lng)

        new naver.maps.Marker({
            position,
            map: this.map,
            title: '현재 위치',
            icon: {
            content: `
                <div style="
                position: relative;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                ">
                <!-- pulse -->
                <div style="
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 100, 100, 0.3);
                    border-radius: 50%;
                    animation: pulse 1.5s ease-out infinite;
                "></div>

                <!-- 중앙 원 -->
                <div style="
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, #ff6b6b, #ff4d4d);
                    border: 4px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
                    z-index: 2;
                    position: relative;
                ">
                    <div style="
                    content: '';
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    top: 5px;
                    left: 5px;
                    opacity: 0.5;
                    "></div>
                </div>

                <!-- pulse animation -->
                <style>
                    @keyframes pulse {
                    0% {
                        transform: scale(0.6);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                    }
                </style>
                </div>
            `,
            anchor: new naver.maps.Point(24, 24)
            }
        })
        },
        (err) => {
        console.warn('현위치 가져오기 실패:', err)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

}