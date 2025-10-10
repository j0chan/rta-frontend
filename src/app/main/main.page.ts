import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CashService } from '../shared/services/cash.service';
import { Promotion } from '../shared/model/promotion/promotion.model';
import { PromotionService } from '../shared/services/promotion.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main.page.html',
    styleUrls: ['./main.page.scss'],
    standalone: false,
})
export class MainPage implements OnInit, AfterViewInit, OnDestroy {
    /** 여민전 잔액 */
    balance$ = new BehaviorSubject<number>(0);
    /** 로딩/에러 표시용 */
    loading$ = new BehaviorSubject<boolean>(false);
    error$ = new BehaviorSubject<string | null>(null);

    /** 프로모션 데이터 */
    promos: Promotion[] = [];
    promoIndex = 0;            // 0-based
    promoEmph = false;         // 슬라이드 직후 2초 강조
    private promoTimer?: any;  // 자동 순환
    private promoEmphTimer?: any;

    private destroy$ = new Subject<void>();
    private dragStartX: number | null = null;
    private dragging = false;
    private readonly THRESHOLD = 40; // px

    constructor(
        private readonly router: Router,
        private readonly cashService: CashService,
        private readonly promotionService: PromotionService,
    ) { }

    ngOnInit(): void {
        this.fetchBalance();

        // 프로모션 로드
        this.promotionService.listActive('MAIN')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (list) => {
                    this.promos = list ?? [];
                    this.promoIndex = 0;
                    this.startAuto();
                    this.flashEmphasis();
                },
                error: (err) => { console.error('[MainPage] promotions load error', err); }
            });
    }

    ngAfterViewInit(): void { /* 필요 시 */ }

    ngOnDestroy(): void {
        this.destroy$.next(); this.destroy$.complete();
        clearInterval(this.promoTimer);
        clearTimeout(this.promoEmphTimer);
    }

    /** 잔액 조회 */
    fetchBalance(): void {
        this.loading$.next(true);
        this.error$.next(null);
        this.cashService.getMyBalance()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (balance) => { this.balance$.next(balance ?? 0); this.loading$.next(false); },
                error: (err) => {
                    console.error('[MainPage] getMyBalance error', err);
                    this.error$.next('잔액을 불러오지 못했습니다.');
                    this.loading$.next(false);
                }
            });
    }

    /** 통화 포맷 */
    formatKRW(v: number | null | undefined): string {
        try {
            return new Intl.NumberFormat('ko-KR', {
                style: 'currency', currency: 'KRW', maximumFractionDigits: 0
            }).format(v ?? 0);
        } catch {
            return `${(v ?? 0).toLocaleString('ko-KR')}원`;
        }
    }

    /** 자동 순환 (끝→처음 루프) */
    private startAuto() {
        clearInterval(this.promoTimer);
        if (!this.promos.length) return;
        this.promoTimer = setInterval(() => this.next(), 4500);
    }

    private flashEmphasis() {
        this.promoEmph = true;
        clearTimeout(this.promoEmphTimer);
        this.promoEmphTimer = setTimeout(() => (this.promoEmph = false), 2000);
    }

    private next() {
        if (!this.promos.length) return;
        this.promoIndex = (this.promoIndex + 1) % this.promos.length;
        this.flashEmphasis();
    }

    private prev() {
        if (!this.promos.length) return;
        this.promoIndex = (this.promoIndex - 1 + this.promos.length) % this.promos.length;
        this.flashEmphasis();
    }

    /** 드래그 후 작동(드래그 중에는 화면 고정) */
    onPromoPointerDown(ev: PointerEvent) {
        clearInterval(this.promoTimer);
        this.dragging = true;
        this.dragStartX = ev.clientX;
    }
    onPromoPointerUp(ev: PointerEvent) {
        if (!this.dragging || this.dragStartX == null) { this.dragging = false; return; }
        const dx = ev.clientX - this.dragStartX;
        if (Math.abs(dx) > this.THRESHOLD) {
            dx < 0 ? this.next() : this.prev();
        }
        this.dragging = false;
        this.dragStartX = null;
        this.startAuto();
    }
    onPromoPointerCancel() {
        this.dragging = false;
        this.dragStartX = null;
        this.startAuto();
    }

    /** 배너 클릭: 운영자면 프로모션 리스트 이동 */
    onPromoClick() {
        this.router.navigate(['/promotion/list']);
    }

    /** 하단 바로가기 */
    goTo(path: string): void {
        this.router.navigateByUrl(path);
    }

    goDepositPage() {
        this.router.navigate(['/deposit']);
    }

    goWithdrawPage() {
        this.router.navigate(['/withdraw']);
    }

    goTransactionPage() {
        this.router.navigate(['/transaction']);
    }

    private beginDrag(clientX: number) {
        clearInterval(this.promoTimer);
        this.dragging = true;
        this.dragStartX = clientX;
    }
    private endDrag(clientX?: number) {
        if (!this.dragging || this.dragStartX == null) { this.dragging = false; return; }
        const dx = (clientX ?? this.dragStartX) - this.dragStartX;
        if (Math.abs(dx) > this.THRESHOLD) dx < 0 ? this.next() : this.prev();
        this.dragging = false;
        this.dragStartX = null;
        this.startAuto();
    }


    /** ----- Touch (iOS/Safari 호환) ----- */
    onPromoTouchStart(ev: TouchEvent) {
        if (ev.touches && ev.touches.length) this.beginDrag(ev.touches[0].clientX);
    }
    onPromoTouchEnd(ev: TouchEvent) {
        const t = ev.changedTouches && ev.changedTouches[0];
        this.endDrag(t ? t.clientX : undefined);
    }

    /** ----- Mouse (데스크톱 보강) ----- */
    onPromoMouseDown(ev: MouseEvent) { this.beginDrag(ev.clientX); }
    onPromoMouseUp(ev: MouseEvent) { this.endDrag(ev.clientX); }
    onPromoMouseLeave() { this.endDrag(); }
}