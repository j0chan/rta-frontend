import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private apiUrl = 'http://localhost:3000/api/s3/'


  constructor(private http: HttpClient) { }

  getImage(file_name: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}download/${file_name}`)
  }
}
