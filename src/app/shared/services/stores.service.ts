import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadStore } from '../model/stores/read-store.interface'
import { ReadMenu } from '../model/menus/read-menu.interface'

@Injectable({
    providedIn: 'root'
})
export class StoresService {
    private apiUrl = 'http://localhost:3000/api/stores/'

    constructor(private http: HttpClient) { }

    getStoreById(id: number): Observable<ApiResponseDTO<ReadStore>> {
        return this.http.get<ApiResponseDTO<ReadStore>>(`${this.apiUrl}${id}`)
    }

    getMenusByStoreId(store_id: number): Observable<ApiResponseDTO<ReadMenu[]>> {
        return this.http.get<ApiResponseDTO<ReadMenu[]>>(`${this.apiUrl}${store_id}/menus`)
    }

    getAllStores(): Observable<ApiResponseDTO<ReadStore[]>> {
        return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}`)
    }

    getAllStoresByUserId(user_id: number): Observable<ApiResponseDTO<ReadStore[]>> {
        return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}user/${user_id}`)
    }
}
