import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CashService } from '../shared/services/cash.service';

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

    /** 프로모션 인디케이터 값 */
    promoIndex = 1;
    promoTotal = 0;

    /** 프로모션 트랙/슬라이드 참조 */
    @ViewChild('promoTrack', { static: false }) promoTrack?: ElementRef<HTMLDivElement>;
    @ViewChildren('promoSlide') promoSlides?: QueryList<ElementRef<HTMLElement>>;

    /** 페이지 내 안내 문구 */
    readonly title = '여민동행';
    readonly subtitle = '총 보유금액';

    private destroy$ = new Subject<void>();

    constructor(
        private readonly router: Router,
        private readonly cashService: CashService,
    ) { }

    ngOnInit(): void {
        this.fetchBalance();
    }

    ngAfterViewInit(): void {
        // 슬라이드 개수 계산 및 변화 감지
        this.updatePromoTotal();
        this.promoSlides?.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.updatePromoTotal());

        // 첫 렌더 후 현재 인덱스 보정
        queueMicrotask(() => this.updatePromoIndex());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** 잔액 조회 */
    fetchBalance(): void {
        this.loading$.next(true);
        this.error$.next(null);

        this.cashService.getMyBalance()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (balance) => {
                    this.balance$.next(balance ?? 0);
                    this.loading$.next(false);
                },
                error: (err) => {
                    console.error('[MainPage] getMyBalance error', err);
                    this.error$.next('잔액을 불러오지 못했습니다.');
                    this.loading$.next(false);
                }
            });
    }

    /** 카드 전체 탭 → 여민전 상세로 이동 */
    gotoCashDetail(): void {
        this.router.navigateByUrl('/cash');
    }

    /** 숫자 포맷 (₩, 천단위 콤마) */
    formatKRW(v: number | null | undefined): string {
        try {
            return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(v ?? 0);
        } catch {
            return `${(v ?? 0).toLocaleString('ko-KR')}원`;
        }
    }

    /** 하단 바로가기 */
    goTo(path: string): void {
        this.router.navigateByUrl(path);
    }

    /** 프로모션 트랙 스크롤 시 인덱스 갱신 */
    onPromoScroll(): void {
        this.updatePromoIndex();
    }

    @HostListener('window:resize')
    onResize(): void {
        this.updatePromoIndex();
    }

    /** 현재 인덱스 계산 */
    private updatePromoIndex(): void {
        const track = this.promoTrack?.nativeElement;
        if (!track) return;

        const w = track.clientWidth || 1;
        const idx = Math.round(track.scrollLeft / w) + 1;
        this.promoIndex = Math.min(Math.max(idx, 1), Math.max(this.promoTotal, 1));
    }

    /** 전체 슬라이드 개수 계산 */
    private updatePromoTotal(): void {
        this.promoTotal = this.promoSlides?.length ?? 0;
        if (this.promoTotal === 0) {
            this.promoIndex = 0;
        } else if (this.promoIndex < 1) {
            this.promoIndex = 1;
        }
    }

    goDepositPage() {
        console.log('go deposit page')
        this.router.navigate(['/deposit'])
    }

    goWithdrawPage() {
        console.log('go withdraw page')
        this.router.navigate(['/withdraw'])
    }

    goTransactionPage() {
        console.log('go transaction page')
        this.router.navigate(['/transaction'])
    }
    // ===== 추후 기능 연결용 예시 핸들러 (지금은 사용 안 함) =====
    // onTopUp() { /* 충전 페이지로 이동 로직 */ }
    // onWithdraw() { /* 인출 페이지로 이동 로직 */ }
    // onOpenPromotion(promoId: number) { /* 프로모션 상세로 이동 */ }
    // onNoticeMore() { /* 공지 더보기 이동 */ }
}
