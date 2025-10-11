import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Promotion, PromotionPlacement } from '../model/promotion/promotion.model';
import { ApiResponseDTO } from 'src/app/shared/model/common/api-response.interface';

@Injectable({ providedIn: 'root' })
export class PromotionService {
    private base = 'http://localhost:3000/api/promotions';

    constructor(private http: HttpClient) { }

    private auth() {
        const t = localStorage.getItem('access_token') || localStorage.getItem('accessToken') || '';
        const headers = t ? new HttpHeaders({ Authorization: `Bearer ${t}` }) : new HttpHeaders();
        return { headers, withCredentials: false };
    }

    /** 프론트에서 'MAIN'을 써도 백엔드 'HOME'으로 매핑 */
    private normalizePlacement(p: string): PromotionPlacement {
        return (p === 'MAIN' ? 'HOME' : p) as PromotionPlacement;
    }

    /** 생성: FormData(image + placement) */
    create(fd: FormData): Observable<Promotion> {
        return this.http
            .post<ApiResponseDTO<Promotion>>(`${this.base}/create`, fd, this.auth())
            .pipe(map(res => res.data as Promotion));
    }

    /** 위치별 조회 */
    listByPlacement(placement: PromotionPlacement | 'MAIN'): Observable<Promotion[]> {
        const serverPlacement = this.normalizePlacement(placement as string);
        return this.http
            .get<ApiResponseDTO<Promotion[]>>(`${this.base}/${serverPlacement}`, this.auth())
            .pipe(
                map(res => (res.data ?? []) as Promotion[]),
                catchError(err => {
                    console.error('[PromotionService] listByPlacement failed', err);
                    return of([]);
                }),
            );
    }

    /** ✅ 기존 코드 호환용 */
    listActive(placement: PromotionPlacement | 'MAIN'): Observable<Promotion[]> {
        return this.listByPlacement(placement);
    }

    /** 삭제 */
    remove(id: number): Observable<void> {
        return this.http
            .delete<ApiResponseDTO<void>>(`${this.base}/${id}`, this.auth())
            .pipe(map(() => void 0));
    }
}