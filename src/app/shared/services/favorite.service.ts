import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ReadStore } from 'src/app/shared/model/stores/read-store.interface'
import { ApiResponseDTO } from '../model/common/api-response.interface'

export interface FavoriteWithStore {
  user_id: string
  store_id: number
  store: ReadStore
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly apiUrl = 'http://localhost:3000/api/favorites'

  constructor(private http: HttpClient) {}

  // 즐겨찾기 추가
  createFavorite(user_id: number, store_id: number): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(this.apiUrl, { user_id, store_id })
  }

  // 즐겨찾기 삭제
  deleteFavorite(user_id: number, store_id: number): Observable<ApiResponseDTO<void>> {
    return this.http.delete<ApiResponseDTO<void>>(`${this.apiUrl}/${user_id}/${store_id}`)
  }

  // 사용자별 즐겨찾기 목록 불러오기
  readFavoritesById(user_id: number): Observable<ApiResponseDTO<FavoriteWithStore[]>> {
    return this.http.get<ApiResponseDTO<FavoriteWithStore[]>>(`${this.apiUrl}/${user_id}`)
  }
} 