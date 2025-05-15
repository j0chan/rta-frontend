import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private openaiApiUrl = 'http://localhost:3000/api/openai/keywords'  // openai API

  constructor(private http: HttpClient) {}

  // JWT 토큰 헤더
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders()
  }

  // 프롬프트 기반 키워드 추천
  getRecommendedKeywords(prompt: string): Observable<string[]> {
    return this.http.post<{ keywords: string[] }>(this.openaiApiUrl, { prompt }, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(response => response.keywords ?? [])
    )
  }
}
