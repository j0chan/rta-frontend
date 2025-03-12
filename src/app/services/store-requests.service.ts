import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient } from '@angular/common/http'
import { UpdateStoreRequest } from '../model/store-requests/update-store-request.interface'
import { ReadStoreRequest } from '../model/store-requests/read-store-request.interface'

@Injectable({
  providedIn: 'root'
})
export class StoreRequestsService {
  private apiUrl = 'http://localhost:3000/api/store-requests/'

  constructor(private http: HttpClient) { }

  readAllStoreRequests(): Observable<ApiResponseDTO<ReadStoreRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadStoreRequest[]>>(`${this.apiUrl}`)
  }

  updateStoreRequest(request_id: number, updateStoreRequest: UpdateStoreRequest): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}${request_id}`, updateStoreRequest)
  }

}
