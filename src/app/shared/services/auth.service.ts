import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateUserDTO } from '../model/auth/create-user.interface'
import { Observable, tap } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { SignInDTO } from '../model/auth/singin.interface'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/'

  constructor(private http: HttpClient) { }

  createUser(createUserDTO: CreateUserDTO): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}signup`, createUserDTO)
  }

  signIn(signInDTO: SignInDTO): Observable<ApiResponseDTO<{ accessToken: string }>> {
    return this.http.post<ApiResponseDTO<{ accessToken: string }>>(`${this.apiUrl}signin`, signInDTO).pipe(
      tap((response) => {
        if (response.success && response.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
        }
      })
    )
  }

  signOut(): void {
    localStorage.removeItem('accessToken') // 로그아웃 시 토큰 삭제
  }
}
