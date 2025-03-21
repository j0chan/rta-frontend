import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ReadStore } from '../model/stores/read-store.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class MapsService {
    private apiUrl = 'http://localhost:3000/api/maps'  // 실제 API 주소로 변경

  constructor(private http: HttpClient) {}

  // 가게 조회
  readStoresByName(lat: number, lng: number, query: string): Observable<ReadStore[]> {
    return this.http.get<ReadStore[]>(`${this.apiUrl}/${lat}/${lng}/${query}`)
  }
}





