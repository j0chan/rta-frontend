import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ApiResponseDTO, GiftCard, GiftCardPocket, PurchaseGiftCardDTO } from '../model/gift-card/my-gift-card.types'

type GiftCardLike = Record<string, any> & { gift_card_id?: number; id?: number };

@Injectable({ providedIn: 'root' })
export class GiftCardStoreDetailService {
    private giftCardApiUrl = 'http://localhost:3000/api/gift-cards/';

    constructor(private http: HttpClient) { }

    private authOptions() {
        const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken') || '';
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
        return { headers, withCredentials: false };
    }

    getDetail(id: number): Observable<GiftCard | undefined> {
        return this.http
            .get<ApiResponseDTO<GiftCard>>(`${this.giftCardApiUrl}catalog/${id}`, this.authOptions())
            .pipe(
                map(res => {
                    const raw = res.data as GiftCardLike | undefined;
                    if (!raw) return undefined;
                    const gift_card_id = raw.gift_card_id ?? raw.id;
                    return { ...raw, gift_card_id } as GiftCard;
                })
            );
    }

    purchase(payload: PurchaseGiftCardDTO): Observable<GiftCardPocket> {
        return this.http
            .post<ApiResponseDTO<GiftCardPocket>>(`${this.giftCardApiUrl}purchase`, payload, this.authOptions())
            .pipe(map(res => res.data));
    }
}