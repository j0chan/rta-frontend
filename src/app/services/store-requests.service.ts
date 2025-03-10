import { Injectable } from '@angular/core'
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class StoreRequestsService {
  private apiUrl = 'http://localhost:3000/api/store-requests/'

  constructor(private http: HttpClient) { }

  readAllStoreRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
      return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}`)
    }
}
