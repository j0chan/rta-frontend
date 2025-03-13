import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../model/common/api-response.interface';
import { ReadStore } from '../model/stores/read-store.interface';
import { ReadEvent } from '../model/events/read-event.interface';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private apiUrl = 'http://localhost:3000/api/stores'

    constructor(private http: HttpClient) { }

    getStoreById(id: number): Observable<ApiResponseDTO<ReadStore>> {
        return this.http.get<ApiResponseDTO<ReadStore>>(`${this.apiUrl}/${id}`)
    }

    getLastestEvent(store_id: number): Observable<ApiResponseDTO<ReadEvent>> {
        return this.http.get<ApiResponseDTO<ReadEvent>>(`${this.apiUrl}/${store_id}/events/latest`)
    }
}
