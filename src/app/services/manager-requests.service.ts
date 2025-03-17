import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseDTO } from '../model/common/api-response.interface';
import { Observable } from 'rxjs';
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface';
import { UpdateManagerRequest } from '../model/manager-requests/update-manager-request.interface';
import { CreateManagerRequestDTO } from '../model/manager-requests/create-manager-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerRequestsService {
  private apiUrl = 'http://localhost:3000/api/manager-requests/'

  constructor(private http: HttpClient) { }

  createManagerRequest(createManagerRequest: CreateManagerRequestDTO): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}`, createManagerRequest)
  }

  readAllManagerRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}`)
  }

  updateManagerRequest(request_id: number, updateManagerRequest: UpdateManagerRequest): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}${request_id}`, updateManagerRequest)
  }
  
}
