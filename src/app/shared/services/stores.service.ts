import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadStore } from '../model/stores/read-store.interface'
import { ReadMenu } from '../model/menus/read-menu.interface'
import { ReadReview } from '../model/reviews/read-review.interface'
import { ReadEvent } from '../model/events/read-event.interface'

@Injectable({
    providedIn: 'root'
})
export class StoresService {
    private apiUrl = 'http://localhost:3000/api/stores/'

    constructor(private http: HttpClient) { }

    getStoreById(id: number): Observable<ApiResponseDTO<ReadStore>> {
        return this.http.get<ApiResponseDTO<ReadStore>>(`${this.apiUrl}${id}`)
    }

    getLastestEventByStoreId(store_id: number): Observable<ApiResponseDTO<ReadEvent>> {
        return this.http.get<ApiResponseDTO<ReadEvent>>(`${this.apiUrl}${store_id}/events/latest`)
    }

    getMenusByStoreId(store_id: number): Observable<ApiResponseDTO<ReadMenu[]>> {
        return this.http.get<ApiResponseDTO<ReadMenu[]>>(`${this.apiUrl}${store_id}/menus`)
    }

    getReviewsByStoreId(store_id: number): Observable<ApiResponseDTO<ReadReview[]>> {
        return this.http.get<ApiResponseDTO<ReadReview[]>>(`${this.apiUrl}${store_id}/reviews`)
    }

    getAllEventsByStore(store_id: number): Observable<ApiResponseDTO<ReadEvent[]>> {
        return this.http.get<ApiResponseDTO<ReadEvent[]>>(`${this.apiUrl}${store_id}/events`)
    }

    createReview(store_id: number, createReview: CreateReview): Observable<ApiResponseDTO<void>> {
        return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}${store_id}/reviews`, createReview)
    }

    getAllStores(): Observable<ApiResponseDTO<ReadStore[]>> {
        return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}`)
    }
}