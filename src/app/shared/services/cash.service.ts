import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface ApiResponseDTO<T> {
    success?: boolean;
    message?: string;
    status?: number;
    data?: T;
}

interface BalanceDTO {
    total?: number;
    balance?: number;
}

interface DepositResult { balance: number; transaction: any; }
interface WithdrawResult { balance: number; transaction: any; }

@Injectable({ providedIn: 'root' })
export class CashService {
    private readonly base = `http://localhost:3000/api/cash`;

    constructor(private readonly http: HttpClient) { }

    /** (페이지 상단에 바로 쓰는) 숫자만 추출한 잔액 */
    getMyBalance(): Observable<number> {
        return this.http.get<ApiResponseDTO<BalanceDTO> | BalanceDTO>(`${this.base}/balance`).pipe(
            map((res: any) => {
                if (res && typeof res === 'object' && 'data' in res && res.data) {
                    const d = res.data as BalanceDTO;
                    if (typeof d.total === 'number') return d.total;
                    if (typeof d.balance === 'number') return d.balance;
                }
                if (res && typeof res === 'object') {
                    if (typeof res.total === 'number') return res.total;
                    if (typeof res.balance === 'number') return res.balance;
                }
                return 0;
            })
        );
    }

    /** (요약/러닝밸런스 계산용) 원시 응답 그대로 */
    getMyBalanceRaw(): Observable<ApiResponseDTO<{ total: number }>> {
        return this.http.get<ApiResponseDTO<{ total: number }>>(`${this.base}/balance`);
    }

    /** 거래 내역 조회 */
    getTransactions(params?: { limit?: number }): Observable<ApiResponseDTO<any[]>> {
        const query = params?.limit ? `?limit=${encodeURIComponent(params.limit)}` : '';
        return this.http.get<ApiResponseDTO<any[]>>(`${this.base}/transactions${query}`);
    }

    /** 여민전 충전 */
    deposit(amount: number): Observable<DepositResult> {
        return this.http.post<ApiResponseDTO<DepositResult> | DepositResult>(`${this.base}/deposit`, { amount }).pipe(
            map((res: any) => {
                if (res && typeof res === 'object' && 'data' in res && res.data) {
                    return res.data as DepositResult;
                }
                return res as DepositResult;
            })
        );
    }

    /** 여민전 인출 */
    withdraw(amount: number): Observable<WithdrawResult> {
        return this.http.post<ApiResponseDTO<WithdrawResult> | WithdrawResult>(`${this.base}/withdraw`, { amount }).pipe(
            map((res: any) => {
                if (res && typeof res === 'object' && 'data' in res && res.data) {
                    return res.data as WithdrawResult;
                }
                return res as WithdrawResult;
            })
        );
    }
}
