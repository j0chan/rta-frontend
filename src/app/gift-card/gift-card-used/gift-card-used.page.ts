import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GiftCardUsedService, UsedPocketVM } from 'src/app/shared/services/gift-card-used.service';

@Component({
    selector: 'app-gift-card-used',
    templateUrl: './gift-card-used.page.html',
    styleUrls: ['./gift-card-used.page.scss'],
    standalone: false,
})
export class GiftCardUsedPage implements OnInit, OnDestroy {
    usedPockets: UsedPocketVM[] = [];
    totalCount = 0;

    private sub?: Subscription;

    constructor(private readonly svc: GiftCardUsedService) { }

    ngOnInit(): void {
        this.onRefresh();
        this.sub = this.svc.getUsedPocketsWithMeta().subscribe({
            next: (arr) => {
                this.usedPockets = arr ?? [];
                this.totalCount = this.usedPockets.length;
            },
            error: (err: any) => {
                console.error('getUsedPocketsWithMeta error', err);
                this.usedPockets = [];
                this.totalCount = 0;
            }
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    onRefresh() {
        this.svc.refresh().subscribe({
            error: (err: any) => console.error('refresh error', err),
        });
    }

    trackByPocket(_i: number, p: UsedPocketVM) {
        return p.pocket_id;
    }

    // ---------- 표시 헬퍼 ----------
    formatKRW(n?: number): string {
        const v = n ?? 0;
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            maximumFractionDigits: 0,
        }).format(v);
    }

    getTypeLabel(p: UsedPocketVM): string {
        const t = p?.giftCard?.type;
        if (t === 'AMOUNT') return '금액권';
        if (t === 'EXCHANGE') return '교환권';
        return '기타';
    }

    /** 실제 결제 금액(뷰모델 주입 우선) */
    getPrice(p: UsedPocketVM): number {
        if (typeof p._price === 'number') return p._price;
        return 0;
    }

    getPurchasedAt(p: UsedPocketVM): string {
        return this.formatDateTime(p._purchasedAt);
    }

    getUsedAt(p: UsedPocketVM): string {
        return this.formatDateTime(p._usedAt);
    }

    private formatDateTime(raw?: string): string {
        if (!raw) return '-';
        const d = new Date(raw);
        if (isNaN(d.getTime())) return '-';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const mi = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
    }
}