import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from '../model/auth/create-user.interface';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../model/common/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth/'

  constructor(private http: HttpClient) { }

  createUser(createUser: CreateUser): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}signup`, createUser)
  }
}
