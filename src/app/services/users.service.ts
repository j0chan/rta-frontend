import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadReview } from '../model/reviews/read-review.interface'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/api/users/'

  readReviewById(user_id: number): Observable<ApiResponseDTO<ReadReview>> {
    return this.http.get<ApiResponseDTO<ReadReview>>(`${this.apiUrl}${user_id}`)
  }
}