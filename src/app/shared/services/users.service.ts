import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient } from '@angular/common/http'
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users/'

  constructor(private http: HttpClient) { }

  readMyManagerRequests(user_id: number): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}${user_id}/manager-requests`)
  }
}
