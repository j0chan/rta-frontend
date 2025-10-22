import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponseDTO, GiftCard } from '../model/gift-card/my-gift-card.types';

@Injectable({ providedIn: 'root' })
export class CreateGiftCardService {
    private readonly giftCardApiUrl = 'http://localhost:3000/api/gift-cards/';

    constructor(private http: HttpClient) { }

    /** 토큰 헤더만 추가 (FormData는 Content-Type 자동 세팅) */
    private authOptions() {
        const token = localStorage.getItem('access_token') || localStorage.getItem('accessToken') || '';
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
        return { headers, withCredentials: false };
    }

    /** 관리자 전용: 상품권 생성 (multipart/form-data) */
    createWithFile(fd: FormData): Observable<GiftCard> {
        return this.http
            .post<ApiResponseDTO<GiftCard>>(`${this.giftCardApiUrl}create`, fd, this.authOptions())
            .pipe(map(res => res.data));
    }
}