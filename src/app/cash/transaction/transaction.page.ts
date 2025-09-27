import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CashService } from '../../shared/services/cash.service';

export enum CashTransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW',
    PAYMENT = 'PAYMENT',
}

export interface CashTransaction {
    cash_transaction_id: string | number;
    type: CashTransactionType;   // 'DEPOSIT' | 'WITHDRAW' | 'PAYMENT'
    amount: number;              // 양수
    reason: string;              // 상호/사유
    created_at: string;          // ISO
    runningBalance?: number;     // 화면 계산용(해당 거래 직후 잔액)
}

type ApiResp<T> = { success: boolean; status: number; message: string; data: T };

interface Group {
    dateKey: string;   // YYYY-MM-DD
    dateLabel: string; // 8월 29일 (금)
    items: CashTransaction[];
}

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.page.html',
    styleUrls: ['./transaction.page.scss'],
    standalone: false,
})
export class CashTransactionPage implements OnInit {
    // 템플릿에서 enum 사용
    readonly CashTransactionType = CashTransactionType;

    // 상태
    loading = true;
    error: string | null = null;

    // 잔액
    summary: { total: number } | null = null;

    // 전체/표시용/그룹
    private fullTransactions: CashTransaction[] = [];
    transactions: CashTransaction[] = [];
    groups: Group[] = [];

    // 필터/검색
    filter: 'ALL' | CashTransactionType = 'ALL';
    q = '';
    pageSize = 200;

    constructor(private cash: CashService) { }

    ngOnInit(): void {
        this.fetchAll();
    }

    get displayBalance(): number {
        return Math.max(0, this.summary?.total ?? 0);
    }

    async fetchAll() {
        this.loading = true;
        this.error = null;
        try {
            await this.fetchSummary();
            await this.fetchAllTransactions();
            this.computeRunningBalances();
            this.applyFilterAndGroup();
        } catch (e) {
            this.error = this.formatHttpError(e, '캐쉬 정보 로드');
        } finally {
            this.loading = false;
        }
    }

    /** GET /api/cash/balance → { data: { total } } */
    private async fetchSummary() {
        const resp = await firstValueFrom(this.cash.getMyBalanceRaw()) as ApiResp<{ total: number }>;
        const total = Math.max(0, resp?.data?.total ?? 0);
        this.summary = { total };
    }

    /** GET /api/cash/transactions → 전체 최신순 */
    private async fetchAllTransactions() {
        const resp = await firstValueFrom(
            this.cash.getTransactions({ limit: this.pageSize })
        ) as ApiResp<CashTransaction[]>;
        const list = resp?.data ?? [];
        this.fullTransactions = list.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    /** 전체 기준 “해당 거래 직후 잔액” 계산 */
    private computeRunningBalances() {
        let curr = this.displayBalance; // 최신 시점의 잔액
        for (const t of this.fullTransactions) {
            t.runningBalance = curr;
            // 과거로 한 스텝 이동
            if (t.type === CashTransactionType.DEPOSIT) {
                // 충전 전 상태로 돌아가면 잔액 감소
                curr -= t.amount;
            } else {
                // 인출/사용 전 상태로 돌아가면 잔액 증가
                curr += t.amount;
            }
        }
    }

    private applyFilterAndGroup() {
        const term = this.q.trim().toLowerCase();
        const filtered = this.fullTransactions.filter(t => {
            const okType = this.filter === 'ALL' ? true : t.type === this.filter;
            const okText = term ? (t.reason?.toLowerCase().includes(term)) : true;
            return okType && okText;
        });

        this.transactions = filtered.slice();
        this.groups = this.groupByDate(this.transactions);
    }

    setFilter(next: 'ALL' | CashTransactionType) {
        this.filter = next;
        this.applyFilterAndGroup();
    }

    onSearchChange() {
        this.applyFilterAndGroup();
    }

    private groupByDate(list: CashTransaction[]): Group[] {
        const map = new Map<string, Group>();
        for (const t of list) {
            const d = new Date(t.created_at);
            const key = d.toISOString().slice(0, 10);
            if (!map.has(key)) {
                map.set(key, {
                    dateKey: key,
                    dateLabel: this.formatKoreanDate(d),
                    items: [],
                });
            }
            map.get(key)!.items.push(t);
        }
        return Array.from(map.values()).sort((a, b) => b.dateKey.localeCompare(a.dateKey));
    }

    private formatKoreanDate(d: Date): string {
        const wk = ['일', '월', '화', '수', '목', '금', '토'];
        return `${d.getMonth() + 1}월 ${d.getDate()}일 (${wk[d.getDay()]})`;
    }

    timeHHMM(iso: string): string {
        const d = new Date(iso);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    typeLabel(t: CashTransactionType): string {
        switch (t) {
            case CashTransactionType.DEPOSIT: return '충전';
            case CashTransactionType.WITHDRAW: return '인출';
            default: return '사용';
        }
    }

    signByType(type: CashTransactionType): string {
        return type === CashTransactionType.DEPOSIT ? '+' : '-';
    }

    krw(n: number): string {
        return new Intl.NumberFormat('ko-KR').format(n) + '원';
    }

    trackByTx = (_: number, t: CashTransaction) => t.cash_transaction_id;

    private formatHttpError(e: any, label: string) {
        if (e instanceof HttpErrorResponse) {
            const msg = e.error?.message || e.statusText || '네트워크 오류';
            return `${label} 실패: [${e.status}] ${msg}`;
        }
        return `${label} 실패`;
    }
}
