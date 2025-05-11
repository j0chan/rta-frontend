import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users/'

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return new HttpHeaders().set('Authorization', `Bearer ${token ?? ''}`)
  }

  // 이메일 중복 검사
  readEmailExists(email: string): Observable<ApiResponseDTO<boolean>> {
    return this.http.get<ApiResponseDTO<boolean>>(`${this.apiUrl}check-email?email=${email}`)
  }

  // 유저 정보 변경
  updateUserById(formdata: FormData): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(
      `${this.apiUrl}`,
      formdata,
      { headers: this.getAuthHeaders() }
    )
  }
}
