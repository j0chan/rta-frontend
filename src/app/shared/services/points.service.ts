import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDTO } from '../model/common/api-response.interface';
import { PointTransaction, PointTransactionType } from '../model/points/point-transaction.interface';

@Injectable({ providedIn: 'root' })
export class PointsService {
    // ✅ AuthService와 동일한 컨벤션(절대 URL)
    private apiUrl = 'http://localhost:3000/api/points';

    constructor(private http: HttpClient) { }

    /** Authorization 헤더 생성 (인터셉터 도입 전 임시) */
    private authHeaders(): HttpHeaders {
        const token = localStorage.getItem('accessToken') || '';
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);
        return headers;
    }

    /** 잔액 조회: GET /api/points/balance -> { total } */
    getBalance(): Observable<ApiResponseDTO<{ total: number }>> {
        return this.http.get<ApiResponseDTO<{ total: number }>>(
            `${this.apiUrl}/balance`,
            { headers: this.authHeaders() }
        );
    }

    /** 내역 조회: GET /api/points/transactions?type=&q=&limit= */
    getTransactions(opts?: {
        type?: PointTransactionType;
        q?: string;
        limit?: number;
    }): Observable<ApiResponseDTO<PointTransaction[]>> {
        let params = new HttpParams();
        if (opts?.type) params = params.set('type', opts.type);
        if (opts?.q) params = params.set('q', opts.q);
        if (opts?.limit) params = params.set('limit', String(opts.limit));

        return this.http.get<ApiResponseDTO<PointTransaction[]>>(
            `${this.apiUrl}/transactions`,
            { headers: this.authHeaders(), params }
        );
    }

    /** 적립: POST /api/points/earn { amount, reason } */
    earn(amount: number, reason: string): Observable<ApiResponseDTO<{ earned: number }>> {
        return this.http.post<ApiResponseDTO<{ earned: number }>>(
            `${this.apiUrl}/earn`,
            { amount, reason },
            { headers: this.authHeaders() }
        );
    }

    /** 사용: POST /api/points/use { amount, reason } */
    use(amount: number, reason: string): Observable<ApiResponseDTO<{ used: number }>> {
        return this.http.post<ApiResponseDTO<{ used: number }>>(
            `${this.apiUrl}/use`,
            { amount, reason },
            { headers: this.authHeaders() }
        );
    }
}