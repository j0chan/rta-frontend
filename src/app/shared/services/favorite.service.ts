import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'

interface Favorite {
    store_id: number
    store_name: string
}

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private apiUrl = 'http://localhost:3000/api/favorites/'

    constructor(private http: HttpClient) { }

    createFavorite(user_id: number, store_id: number): Observable<ApiResponseDTO<void>> {
        return this.http.post<ApiResponseDTO<void>>(this.apiUrl, { user_id, store_id })
    }

    readFavoritesById(user_id: number): Observable<ApiResponseDTO<Favorite[]>> {
        return this.http.get<ApiResponseDTO<Favorite[]>>(`${this.apiUrl}${user_id}`)
    }

    deleteFavorite(user_id: number, store_id: number): Observable<ApiResponseDTO<void>> {
        return this.http.request<ApiResponseDTO<void>>('delete', `${this.apiUrl}${user_id}/${store_id}`)
    }
}