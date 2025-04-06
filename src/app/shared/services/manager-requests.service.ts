import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { Observable } from 'rxjs'
import { CreateManagerRequest } from '../model/manager-requests/create-manager-request.interface'
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface'
import { UpdateManagerRequest } from '../model/manager-requests/update-manager-request.interface'

@Injectable({
  providedIn: 'root'
})
export class ManagerRequestsService {
  private apiUrl = 'http://localhost:3000/api/manager-requests/'

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    console.log('access Token: ', localStorage.getItem('accessToken'))

    const token = localStorage.getItem('accessToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
  }

  createManagerRequest(createManagerRequest: CreateManagerRequest): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}`, createManagerRequest, { headers: this.getAuthHeaders()} )
  }

  readAllManagerRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}`, { headers: this.getAuthHeaders() })
  }

  getMyManagerRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}my`, { headers: this.getAuthHeaders() })
  }

  updateManagerRequest(request_id: number, updateManagerRequest: UpdateManagerRequest): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}${request_id}`, updateManagerRequest, { headers: this.getAuthHeaders() })
  }
}
