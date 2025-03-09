import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponseDTO } from '../model/common/api-response.interface';
import { Observable } from 'rxjs';
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerRequestsService {
  private apiUrl = 'http://localhost:3000/api/manager-requests/'

  constructor(private http: HttpClient) { }

  readAllManagerRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}`)
  }
}
