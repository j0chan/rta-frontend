import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadReview } from '../model/reviews/read-review.interface'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ReadUser } from '../model/users/read-user.interface'
import { ReadStore } from '../model/stores/read-store.interface'
import { ReadManagerRequest } from '../model/manager-requests/read-manager-request.interface'

@Injectable({
  providedIn: 'root'
})
export class MyPageService {
  private apiUrl = 'http://localhost:3000/api/'
  
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
  }

  getMyReviews(): Observable<ApiResponseDTO<ReadReview[]>> {
    return this.http.get<ApiResponseDTO<ReadReview[]>>(`${this.apiUrl}my/reviews`, { headers: this.getAuthHeaders() })
  }

  getMyInfo(): Observable<ApiResponseDTO<ReadUser>> {
    return this.http.get<ApiResponseDTO<ReadUser>>(`${this.apiUrl}users/my`, { headers: this.getAuthHeaders() })
  }

  getMyManagerRequests(): Observable<ApiResponseDTO<ReadManagerRequest[]>> {
    return this.http.get<ApiResponseDTO<ReadManagerRequest[]>>(`${this.apiUrl}manager-requests/my`, { headers: this.getAuthHeaders() })
  }

  getMyStores(): Observable<ApiResponseDTO<ReadStore[]>> {
    return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}stores/my`, { headers: this.getAuthHeaders() })
  }
}