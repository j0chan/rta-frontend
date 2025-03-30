import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ApiResponseDTO } from '../model/common/api-response.interface'

@Injectable({
  providedIn: 'root'
})

export class MapsService {
  private storeApiUrl = 'http://localhost:3000/api/stores/' // Stores API
  private mapApiUrl = 'http://localhost:3000/api/maps/' // Maps API

  constructor(private http: HttpClient) { }

  // 헤터 토큰 추가 (공통)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
  }

  getClientId(): Observable<{ clientId: string }> {
    const token = localStorage.getItem('accessToken')
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    
    return this.http.get<{ clientId: string }>('http://localhost:3000/api/maps/client-id', { headers })
  }

  // 모든 가게 조회
  getAllStores(): Observable<ApiResponseDTO<ReadStore[]>> {
    return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.storeApiUrl}`, {
      headers: this.getAuthHeaders()
    })
  }

  // 특정 가게 조회
  readStoreById(store_id: number): Observable<ReadStore> {
    return this.http.get<ApiResponseDTO<ReadStore>>(`${this.storeApiUrl}${store_id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.data ?? {} as ReadStore)
    )
  }

  // 특정 가게 조회 (map api)
  readStoresByName(lat: number, lng: number, query: string): Observable<ReadStore[]> {
    return this.http.get<ReadStore[]>(`${this.mapApiUrl}/${lat}/${lng}/${query}`, {
      headers: this.getAuthHeaders()
    })
  }

  // 현위치 기준 가게 조회
  readStoreByCurrentLocation(lat: number, lng: number): Observable<ReadStore[]> {
    return this.http.get<ReadStore[]>(`${this.mapApiUrl}`, {
      headers: this.getAuthHeaders(),
      params: { lat: lat.toString(), lng: lng.toString() }
    })
  }
}