import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshService {
    private _noticeRefresh = new Subject<void>();
    noticeRefresh$ = this._noticeRefresh.asObservable();
    emitNoticeRefresh() { this._noticeRefresh.next(); }
}