import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Promotion, PromotionPlacement } from '../model/promotion/promotion.model';

interface ApiResponse<T> { ok: boolean; data: T; }

@Injectable({ providedIn: 'root' })
export class PromotionService {
    private readonly base = 'http://localhost:3000/api/promotions';

    constructor(private http: HttpClient) { }

    listActive(placement: PromotionPlacement): Observable<Promotion[]> {
        const params = new HttpParams().set('placement', placement);
        return this.http.get<ApiResponse<Promotion[]>>(`${this.base}/active`, { params })
            .pipe(map(res => res.data));
    }

    adminList(): Observable<Promotion[]> {
        return this.http.get<ApiResponse<Promotion[]>>(this.base)
            .pipe(map(res => res.data));
    }

    create(payload: { image_url: string; placement: PromotionPlacement }): Observable<Promotion> {
        return this.http.post<ApiResponse<Promotion>>(this.base, payload)
            .pipe(map(res => res.data));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<ApiResponse<unknown>>(`${this.base}/${id}`)
            .pipe(map(() => void 0));
    }
}