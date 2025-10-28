import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ReadReview } from '../model/reviews/read-review.interface'
import { ApiResponseDTO } from '../model/common/api-response.interface'

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = 'http://localhost:3000/api/stores'

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
  }

  createReview(store_id: number, formData: FormData): Observable<ApiResponseDTO<{ review_id: number }>> {
    return this.http.post<ApiResponseDTO<{ review_id: number }>>(`${this.apiUrl}/${store_id}/reviews`, formData, { headers: this.getAuthHeaders() })
  }

  getReviewsByStoreId(store_id: number): Observable<ApiResponseDTO<ReadReview[]>> {
    return this.http.get<ApiResponseDTO<ReadReview[]>>(`${this.apiUrl}/${store_id}/reviews`)
  }

  deleteReview(store_id: number, review_id: number): Observable<any> {
    return this.http.delete<ApiResponseDTO<void>>(`${this.apiUrl}/${store_id}/reviews/${review_id}`, { headers: this.getAuthHeaders() }
    )
  }

  toggleHelpful(store_id: number, review_id: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${store_id}/reviews/${review_id}/helpful`,
      {},
      { headers: this.getAuthHeaders() }
    )
  }

}
