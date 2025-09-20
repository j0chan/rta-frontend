import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ApiResponseDTO, GiftCardPocket, GiftCard, GiftCardUsageHistory, PurchaseGiftCardDTO, UseGiftCardDTO, } from '../model/gift-card/my-gift-card.types'

@Injectable({ providedIn: 'root' })
export class MyGiftCardService {
    private giftCardApiUrl = 'http://localhost:3000/api/gift-cards/';

    private readonly _pockets$ = new BehaviorSubject<GiftCardPocket[]>([]);

    constructor(private http: HttpClient) { }

    private authOptions() {
        const token = localStorage.getItem('access_token'); // 프로젝트 토큰 키에 맞게
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
        // 쿠키 세션이면 withCredentials: true
        return { headers, withCredentials: false };
    }

    /** 내 상품권 목록 */
    refreshMyPockets(): Observable<GiftCardPocket[]> {
        return this.http
            .get<ApiResponseDTO<GiftCardPocket[]>>(`${this.giftCardApiUrl}my`, this.authOptions())
            .pipe(
                map(res => res.data ?? []),
                tap(arr => this._pockets$.next(arr)),
                catchError(err => {
                    console.error('GET /gift-cards/my failed', err);
                    this._pockets$.next([]);
                    return of([]);
                })
            );
    }

    /** 화면 구독 */
    getPockets(): Observable<GiftCardPocket[]> {
        return this._pockets$.asObservable();
    }

    /** 카탈로그 */
    getCatalog(): Observable<GiftCard[]> {
        return this.http
            .get<ApiResponseDTO<GiftCard[]>>(`${this.giftCardApiUrl}catalog`, this.authOptions())
            .pipe(map(res => res.data ?? []));
    }

    /** 사용 내역 */
    getUsageHistory(): Observable<GiftCardUsageHistory[]> {
        return this.http
            .get<ApiResponseDTO<GiftCardUsageHistory[]>>(`${this.giftCardApiUrl}usage-history`, this.authOptions())
            .pipe(map(res => res.data ?? []));
    }

    /** 사용 처리 */
    useGiftCard(dto: UseGiftCardDTO): Observable<void> {
        return this.http
            .post<ApiResponseDTO<null>>(`${this.giftCardApiUrl}use`, dto, this.authOptions())
            .pipe(
                tap(() => {
                    const next = this._pockets$.value.map(p =>
                        p.pocket_id === dto.pocket_id ? { ...p, is_used: true } : p
                    );
                    this._pockets$.next(next);
                }),
                map(() => void 0)
            );
    }

    /** (호환용) 예전 페이지 코드가 부르던 이름 */
    markUsed(pocketId: number, store = '테스트매장') {
        return this.useGiftCard({ pocket_id: pocketId, store });
    }

    /** 구매 */
    purchaseGiftCard(payload: PurchaseGiftCardDTO): Observable<GiftCardPocket> {
        return this.http
            .post<ApiResponseDTO<GiftCardPocket>>(`${this.giftCardApiUrl}purchase`, payload, this.authOptions())
            .pipe(
                map(res => res.data),
                tap(pocket => this._pockets$.next([pocket, ...this._pockets$.value]))
            );
    }
}