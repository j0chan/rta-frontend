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
    // 실제 애플리케이션에서는 인증 토큰을 여기에 추가해야 합니다.
    // 예: const token = localStorage.getItem('jwt_token');
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // return this.http.get<RecommendationResponse>(this.apiUrl, { headers });

    // 현재는 인증 없이 요청 (개발용)
    return this.http.get<RecommendationResponse>(this.apiUrl);
  }
}
