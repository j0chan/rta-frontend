import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateEvent } from '../model/events/create-event.interface'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { UpdateEvent } from '../model/events/update-event.interface'

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:3000/api/managers/'

  constructor(private http: HttpClient) { }

  createEvent(createEvent: CreateEvent): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}`, createEvent)
  }

  updateEvent(updateEvent: UpdateEvent): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}`, updateEvent)
  }
}
