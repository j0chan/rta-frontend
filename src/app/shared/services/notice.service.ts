import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Notice, NoticeListResponse } from '../model/notice/notice.model';
import { ApiResponseDTO } from '../model/common/api-response.interface';

@Injectable({ providedIn: 'root' })
export class NoticeService {
    private readonly base = 'http://localhost:3000/api/notices';

    constructor(private http: HttpClient) { }

    list(params: { keyword?: string; page?: number; pageSize?: number; isPinnedOnly?: boolean; excludePinned?: boolean }): Observable<NoticeListResponse> {
        let hp = new HttpParams();
        if (params.keyword) hp = hp.set('keyword', params.keyword);
        if (params.page) hp = hp.set('page', params.page);
        if (params.pageSize) hp = hp.set('pageSize', params.pageSize);
        if (typeof params.isPinnedOnly === 'boolean') hp = hp.set('isPinnedOnly', String(params.isPinnedOnly));
        if (typeof params.excludePinned === 'boolean') hp = hp.set('excludePinned', String(params.excludePinned));

        return this.http.get<ApiResponseDTO<NoticeListResponse>>(this.base, { params: hp }).pipe(
            map(res => res.data as NoticeListResponse),
        );
    }

    detail(notice_id: number): Observable<Notice> {
        return this.http.get<ApiResponseDTO<Notice>>(`${this.base}/${notice_id}`).pipe(
            map(res => res.data as Notice),
        );
    }

    create(payload: { title: string; content: string; is_pinned?: boolean }): Observable<Notice> {
        return this.http.post<ApiResponseDTO<Notice>>(this.base, payload).pipe(
            map(res => res.data as Notice),
        );
    }

    update(notice_id: number, payload: Partial<{ title: string; content: string; is_pinned: boolean }>): Observable<Notice> {
        return this.http.patch<ApiResponseDTO<Notice>>(`${this.base}/${notice_id}`, payload).pipe(
            map(res => res.data as Notice),
        );
    }

    delete(notice_id: number): Observable<void> {
        return this.http.delete<ApiResponseDTO<unknown>>(`${this.base}/${notice_id}`).pipe(
            map(() => void 0),
        );
    }
}