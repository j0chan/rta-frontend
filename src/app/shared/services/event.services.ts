import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { CreateEvent } from '../model/events/create-event.interface'
import { Observable } from 'rxjs'
import { ApiResponseDTO } from '../model/common/api-response.interface'
import { UpdateEvent } from '../model/events/update-event.interface'
import { ReadEvent } from '../model/events/read-event.interface'

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/stores/'

  constructor(private http: HttpClient) { }

  createEvent(store_id: number, createEvent: CreateEvent): Observable<ApiResponseDTO<void>> {
    return this.http.post<ApiResponseDTO<void>>(`${this.apiUrl}${store_id}/events`, createEvent)
  }

  getEventById(store_id: number, event_id: number): Observable<ApiResponseDTO<ReadEvent>> {
    return this.http.get<ApiResponseDTO<ReadEvent>>(`${this.apiUrl}${store_id}/events/${event_id}`)
  }

  updateEvent(store_id: number, event_id: number,  updateEvent: UpdateEvent): Observable<ApiResponseDTO<void>> {
    return this.http.put<ApiResponseDTO<void>>(`${this.apiUrl}${store_id}/events/${event_id}`, updateEvent)
  }
}
