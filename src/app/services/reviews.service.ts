import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ReadAllReviews } from '../model/reviews/read-all-reviews.interface'
import { ApiResponseDTO } from '../model/common/api-response.interface'

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = 'http://localhost:3000/api/reviews/'

  constructor(private http: HttpClient) { }

  readAllReviews(): Observable<ApiResponseDTO<ReadAllReviews[]>> {
    return this.http.get<ApiResponseDTO<ReadAllReviews[]>>(`${this.apiUrl}`)
  }

  readReviewById() {

  }
}
