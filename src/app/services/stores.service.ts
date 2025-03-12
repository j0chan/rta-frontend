import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../model/common/api-response.interface';
import { Store } from '../model/stores/read-store.interface';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private apiUrl = 'http://localhost:3000/api/stores'

    constructor(private http: HttpClient) { }

    getStoreById(id: number): Observable<ApiResponseDTO<Store>> {
        return this.http.get<ApiResponseDTO<Store>>(`${this.apiUrl}/${id}`)
    }
}
