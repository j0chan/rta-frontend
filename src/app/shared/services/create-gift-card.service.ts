import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { ApiResponseDTO, GiftCard, CreateGiftCardDTO, } from '../model/gift-card/my-gift-card.types'

@Injectable({ providedIn: 'root' })
export class CreateGiftCardService {
    private readonly giftCardApiUrl = 'http://localhost:3000/api/gift-cards/';

    constructor(private http: HttpClient) { }

    /** 팀 컨벤션: 토큰 키 혼용 대응 */
    private authOptions() {
        const token =
            localStorage.getItem('access_token') ||
            localStorage.getItem('accessToken') ||
            '';
        const headers = token
            ? new HttpHeaders({ Authorization: `Bearer ${token}` })
            : new HttpHeaders();
        return { headers, withCredentials: false };
    }

    /** 관리자 전용: 상품권 생성 */
    create(dto: CreateGiftCardDTO): Observable<GiftCard> {
        return this.http
            .post<ApiResponseDTO<GiftCard>>(
                `${this.giftCardApiUrl}create`,
                dto,
                this.authOptions()
            )
            .pipe(map((res) => res.data));
    }
}