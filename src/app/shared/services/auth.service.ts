import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateUserDTO } from '../model/auth/create-user.interface'
import { Observable } from 'rxjs'
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

  signIn(signInDTO: SignInDTO): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}signin`, signInDTO)
  }
}
