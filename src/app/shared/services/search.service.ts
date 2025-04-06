import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { ReadStore } from '../model/stores/read-store.interface'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://localhost:3000/api/stores/'

  constructor(private http: HttpClient) { }

  searchStoresByKeyword(keyword: string): Observable<ApiResponseDTO<ReadStore[]>> {
    return this.http.get<ApiResponseDTO<ReadStore[]>>(`${this.apiUrl}?keyword=${keyword}`)
  }
}
