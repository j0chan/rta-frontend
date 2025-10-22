import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { ApiResponseDTO, GiftCard } from '../model/gift-card/my-gift-card.types'

export type GiftCategoryCode =
    | 'CHICKEN_BURGER'
    | 'COFFEE_DRINK'
    | 'BAKERY_DESSERT'
    | 'APPAREL'
    | 'ETC';

type GiftCardLike = Record<string, any> & { gift_card_id?: number; id?: number };

@Injectable({ providedIn: 'root' })
export class GiftCardStoreService {
    private giftCardApiUrl = 'http://localhost:3000/api/gift-cards/';

    private readonly _catalog$ = new BehaviorSubject<GiftCard[]>([]);

    constructor(private http: HttpClient) { }

    private authOptions() {
        const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken') || '';
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
        return { headers, withCredentials: false };
    }

    private normalize = (raw: GiftCardLike): GiftCard => {
        const gift_card_id = raw.gift_card_id ?? raw.id;
        return { ...raw, gift_card_id } as GiftCard;
    };

    refreshCatalog(opts?: {
        category?: GiftCategoryCode;
        page?: number;
        pageSize?: number;
        keyword?: string;
        sort?: 'LATEST' | 'POPULAR' | 'PRICE_ASC' | 'PRICE_DESC';
    }): Observable<GiftCard[]> {
        let params = new HttpParams();
        if (opts?.category) params = params.set('category', opts.category);
        if (opts?.sort) params = params.set('sort', opts.sort);

        return this.http
            .get<ApiResponseDTO<GiftCard[]>>(`${this.giftCardApiUrl}catalog`, { ...this.authOptions(), params })
            .pipe(
                map(res => (res.data ?? []).map(this.normalize)),
                tap(list => this._catalog$.next(list)),
                catchError(err => {
                    console.error('GET /gift-cards/catalog failed', err);
                    this._catalog$.next([]);
                    return of([]);
                }),
            );
    }

    getCatalog(): Observable<GiftCard[]> {
        return this._catalog$.asObservable();
    }

    getCatalogItemById(id: number): Observable<GiftCard | undefined> {
        return this.http
            .get<ApiResponseDTO<GiftCard>>(`${this.giftCardApiUrl}catalog/${id}`, this.authOptions())
            .pipe(
                map(res => (res.data ? this.normalize(res.data) : undefined)),
                catchError(err => {
                    console.error(`GET /gift-cards/catalog/${id} failed`, err);
                    return of(undefined);
                }),
            );
    }
}