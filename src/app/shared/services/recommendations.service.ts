import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RecommendationResponse {
  message: string;
  criteriaDate: string;
  recommended_store_ids: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  private apiUrl = 'http://localhost:3000/recommendations'; // 백엔드 API URL (NestJS 기본 포트)

  constructor(private http: HttpClient) { }

  getRecommendations(): Observable<RecommendationResponse> {
    return this.http.get<RecommendationResponse>(this.apiUrl);
  }
}
