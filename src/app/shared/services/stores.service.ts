import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadStore } from '../model/stores/read-store.interface'
import { UpdateStoreDetail } from '../model/stores/update-store-detail.interface'

@Injectable({
    providedIn: 'root'
})
export class StoresService {
    private apiUrl = 'http://localhost:3000/api/stores/'

    constructor(private http: HttpClient) { }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken')
        return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
    }

    getStoreById(id: number): Observable<ApiResponseDTO<ReadStore>> {
        return this.http.get<ApiResponseDTO<ReadStore>>(`${this.apiUrl}${id}`)
    }

    getAllStores(): Observable<ApiResponseDTO<ReadStore[]>> {
        return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}`)
    }

    getAllStoresByUserId(user_id: number): Observable<ApiResponseDTO<ReadStore[]>> {
        return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}user/${user_id}`)
    }

    updateStoreDetail(store_id: number, updateStoreDetail: UpdateStoreDetail): Observable<ApiResponseDTO<void>> {
        return this.http.put<ApiResponseDTO<void>>(
            `${this.apiUrl}${store_id}`,
            updateStoreDetail,
            {headers: this.getAuthHeaders()}
        )
    }
}
