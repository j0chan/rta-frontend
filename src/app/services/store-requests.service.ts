import { Injectable } from '@angular/core'
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient } from '@angular/common/http'
import { UpdateStoreRequest } from '../model/store-requests/update-store-request.interface'

@Injectable({
  providedIn: 'root'
})
export class StoreRequestsService {
  private apiUrl = 'http://localhost:3000/api/store-requests/'

  constructor(private http: HttpClient) { }

  readAllStoreRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}`)
  }

  updateManagerRequest(request_id: number, updateStoreRequest: UpdateStoreRequest): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}${request_id}`, updateStoreRequest)
  }

}
