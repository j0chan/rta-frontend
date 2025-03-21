import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateUserDTO } from '../model/auth/create-user.interface'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { SignInDTO } from '../model/auth/singin.interface'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/'
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('accessToken'))

  constructor(private http: HttpClient) { }

  // 로그인 상태를 구독하는 BehaviorSubject 사용
  isLoggedIn$ = this.isLoggedInSubject.asObservable()

  createUser(createUserDTO: CreateUserDTO): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}signup`, createUserDTO)
  }

  signIn(signInDTO: SignInDTO): Observable<ApiResponseDTO<{ accessToken: string }>> {
    return this.http.post<ApiResponseDTO<{ accessToken: string }>>(`${this.apiUrl}signin`, signInDTO).pipe(
      tap((response) => {
        if (response.success && response.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken)
          this.isLoggedInSubject.next(true) // 로그인 상태 변경
        }
      })
    )
  }

  signOut(): void {
    localStorage.removeItem('accessToken') // 로그아웃 시 토큰 삭제
    this.isLoggedInSubject.next(false)
  }
}
