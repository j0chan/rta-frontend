import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadReview } from '../model/reviews/read-review.interface'
import { HttpClient } from '@angular/common/http'
import { ReadUser } from '../model/users/read-user.interface'

@Injectable({
  providedIn: 'root'
})
export class MyPageService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/api/users/'

  readReviewsById(user_id: number): Observable<ApiResponseDTO<ReadReview[]>> {
    return this.http.get<ApiResponseDTO<ReadReview[]>>(`${this.apiUrl}${user_id}/reviews`)
  }

  readUserById(user_id: number): Observable<ApiResponseDTO<ReadUser>> {
    return this.http.get<ApiResponseDTO<ReadUser>>(`${this.apiUrl}${user_id}`)
  }
}