import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { PointsService } from '../shared/services/points.service';
import {
    PointTransaction,
    PointTransactionType
} from '../shared/model/points/point-transaction.interface';

type ApiResp<T> = { success: boolean; status: number; message: string; data: T };

interface Group {
    dateKey: string;   // YYYY-MM-DD
    dateLabel: string; // 예: 8월 29일 (금)
    items: PointTransaction[];
}

@Component({
    selector: 'app-point',
    templateUrl: './point.page.html',
    styleUrls: ['./point.page.scss'],
    standalone: false,
})
export class PointPage implements OnInit {
    // 템플릿에서 enum 사용
    readonly PointTransactionType = PointTransactionType;

    // 상태
    loading = true;
    error: string | null = null;

    // 잔액(백엔드 응답: { total })
    summary: { total: number } | null = null;

    // 전체 내역(최신→과거), 그리고 화면에 표시할 내역
    private fullTransactions: PointTransaction[] = [];
    transactions: PointTransaction[] = [];
    groups: Group[] = [];

    // 클라이언트 필터/검색(서버 호출 최소화 + 러닝밸런스 정확성)
    filter: 'ALL' | PointTransactionType = 'ALL';
    q = '';
    pageSize = 200; // 필요시 조정

    constructor(private points: PointsService) { }

    ngOnInit(): void {
        this.fetchAll();
    }

    /** 화면 표시 잔액: 0 미만 방어 */
    get displayBalance(): number {
        return Math.max(0, this.summary?.total ?? 0);
    }

    /** 전체 로드(요약 → 내역[전체] → 러닝밸런스 계산 → 화면 반영) */
    async fetchAll() {
        this.loading = true;
        this.error = null;

        try {
            await this.fetchSummary();         // 1) 현재 잔액
            await this.fetchAllTransactions(); // 2) 전체 내역(최신순)
            this.computeRunningBalances();     // 3) 러닝밸런스(전체 기준으로 정확히)
            this.applyFilterAndGroup();        // 4) 필터/검색 반영
        } catch (e) {
            this.error = this.formatHttpError(e, '포인트 정보 로드');
        } finally {
            this.loading = false;
        }
    }

    /** GET /api/points/balance → ApiResponseDTO<{ total:number }> */
    private async fetchSummary() {
        const resp = await firstValueFrom(this.points.getBalance()) as ApiResp<{ total: number }>;
        const total = Math.max(0, resp.data?.total ?? 0);
        this.summary = { total };
    }

    /** GET /api/points/transactions → 전체(필터 없이) 최신순으로 보관 */
    private async fetchAllTransactions() {
        const resp = await firstValueFrom(
            this.points.getTransactions({ limit: this.pageSize })
        ) as ApiResp<PointTransaction[]>;

        const list = resp.data ?? [];
        // 최신 → 과거 순 정렬(서버가 보장해도 안전하게 유지)
        this.fullTransactions = list.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    /** 전체 내역 기준으로 각 항목의 "해당 거래 직후 잔액"을 계산해 저장 */
    private computeRunningBalances() {
        let curr = this.displayBalance; // 최신 시점(현재 잔액)
        for (const t of this.fullTransactions) {
            // 해당 거래가 끝난 직후의 잔액
            t.runningBalance = curr;

            // 과거로 한 스텝 이동(다음 루프를 위해 업데이트)
            if (t.type === PointTransactionType.EARN) {
                // 적립 전 상태로 돌아가면 잔액 감소
                curr -= t.amount;
            } else {
                // 사용 전 상태로 돌아가면 잔액 증가
                curr += t.amount;
            }
        }
    }

    /** 현재 필터/검색(q)을 전체 내역에 적용하고, 날짜 그룹 구성 */
    private applyFilterAndGroup() {
        const term = this.q.trim().toLowerCase();
        const filtered = this.fullTransactions.filter(t => {
            const okType = this.filter === 'ALL' ? true : t.type === this.filter;
            const okText = term ? (t.reason?.toLowerCase().includes(term)) : true;
            return okType && okText;
        });

        // 화면 표시용 배열에 복사(참조 유지해도 무방)
        this.transactions = filtered.slice();
        this.groups = this.groupByDate(this.transactions);
    }

    /** UI: 필터 버튼 */
    setFilter(next: 'ALL' | PointTransactionType) {
        this.filter = next;
        this.applyFilterAndGroup(); // 서버 재호출 없이 즉시 반영
    }

    /** UI: 검색 입력 */
    onSearchChange() {
        this.applyFilterAndGroup();
    }

    /** 날짜별 그룹핑(YYYY-MM-DD 기준) */
    private groupByDate(list: PointTransaction[]): Group[] {
        const map = new Map<string, Group>();
        for (const t of list) {
            const d = new Date(t.created_at);
            const key = d.toISOString().slice(0, 10);
            if (!map.has(key)) {
                map.set(key, {
                    dateKey: key,
                    dateLabel: this.formatKoreanDate(d),
                    items: []
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

    signByType(type: PointTransactionType): string {
        return type === PointTransactionType.USE ? '-' : '+';
    }

    krw(n: number): string {
        return new Intl.NumberFormat('ko-KR').format(n) + '원';
    }

    trackByTx = (_: number, t: PointTransaction) => t.point_transaction_id;

    private formatHttpError(e: any, label: string) {
        if (e instanceof HttpErrorResponse) {
            const msg = e.error?.message || e.statusText || '네트워크 오류';
            return `${label} 실패: [${e.status}] ${msg}`;
        }
        return `${label} 실패`;
    }
}