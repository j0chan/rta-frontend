import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api/users/'

  constructor(private http: HttpClient) { }

  // 이메일 중복 검사
  readEmailExists(email: string): Observable<ApiResponseDTO<boolean>> {
    return this.http.get<ApiResponseDTO<boolean>>(`${this.apiUrl}check-email?email=${email}`)
  }
}
