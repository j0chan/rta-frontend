import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { MyGiftCardService } from 'src/app/shared/services/my-gift-card.service'
import type { GiftCardPocket } from 'src/app/shared/model/gift-card/my-gift-card.types'

@Component({
    selector: 'app-my-gift-card',
    templateUrl: './my-gift-card.page.html',
    styleUrls: ['./my-gift-card.page.scss'],
    standalone: false,
})
export class MyGiftCardPage implements AfterViewInit, OnDestroy {
    @ViewChild('carousel', { static: true }) carouselRef!: ElementRef<HTMLDivElement>;
    @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLDivElement>>;

    visiblePockets: GiftCardPocket[] = [];
    totalCount = 0;
    currentIndex = 0; // 0-based

    /** 슬라이드 시 2초간 표시되는 페이지 카운터 */
    showCounter = false;
    private counterTimer: any | null = null;

    private pocketsSub?: Subscription;
    private rafId: number | null = null;

    // 제스처 상태 (콘텐츠는 드래그 중에 이동하지 않음)
    private touching = false;
    private startX = 0;
    private lastX = 0;
    private touchStartAt = 0;

    constructor(private svc: MyGiftCardService) { }

    ngAfterViewInit(): void {
        this.onRefresh();

        this.pocketsSub = this.svc.getPockets()
            .pipe(
                map((list: GiftCardPocket[]) =>
                    list.filter((p: GiftCardPocket) =>
                        !p.is_used && (
                            p.giftCard.type === 'AMOUNT'
                                ? (p.remaining_amount ?? 0) > 0
                                : true
                        )
                    )
                )
            )
            .subscribe((filtered: GiftCardPocket[]) => {
                this.visiblePockets = filtered;
                this.totalCount = filtered.length;
                this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.totalCount - 1));
                setTimeout(() => this.scrollToIndex(this.currentIndex), 0);
            });

        // 스크롤 발생 시 현재 인덱스 계산 (프로그램 스크롤에 의해 발생)
        const onScroll = () => {
            if (this.rafId != null) return;
            this.rafId = requestAnimationFrame(() => {
                this.rafId = null;
                this.updateCurrentIndex(true); // 인덱스 바뀔 때만 카운터 표시
            });
        };
        this.carousel.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        // 드래그 제스처: 드래그 중에는 콘텐츠를 움직이지 않고, 놓는 순간에 한 칸만 이동
        this.carousel.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.carousel.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.carousel.addEventListener('touchend', this.onTouchEnd, { passive: true });
    }

    ngOnDestroy(): void {
        this.pocketsSub?.unsubscribe();
        if (this.rafId != null) cancelAnimationFrame(this.rafId);

        this.carousel.removeEventListener('touchstart', this.onTouchStart as any);
        this.carousel.removeEventListener('touchmove', this.onTouchMove as any);
        this.carousel.removeEventListener('touchend', this.onTouchEnd as any);
    }

    // --- 편의 getter ---
    private get carousel(): HTMLDivElement {
        return this.carouselRef.nativeElement;
    }
    get displayIndex(): string {
        if (this.totalCount === 0) return '0/0';
        return `${this.currentIndex + 1}/${this.totalCount}`;
    }

    // --- 액션 ---
    onRefresh() {
        this.svc.refreshMyPockets().subscribe();
    }

    formatKRW(amount?: number): string {
        const n = amount ?? 0;
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n);
    }

    trackByPocket(_i: number, p: GiftCardPocket) { return p.pocket_id; }

    // --- 인덱스 계산/이동 & 카운터 표시 ---
    private updateCurrentIndex(maybeFlash = false) {
        const container = this.carousel;
        if (!container || this.totalCount === 0) { this.currentIndex = 0; return; }

        const center = container.scrollLeft + container.clientWidth / 2;
        let best = 0, bestDist = Number.MAX_VALUE;
        this.cardRefs.forEach((ref, i) => {
            const card = ref.nativeElement;
            const c = card.offsetLeft + card.offsetWidth / 2;
            const d = Math.abs(c - center);
            if (d < bestDist) { bestDist = d; best = i; }
        });

        const changed = best !== this.currentIndex;
        this.currentIndex = best;

        if (maybeFlash && changed) this.flashCounter();
    }

    private scrollToIndex(idx: number) {
        const container = this.carousel;
        const card = this.cardRefs.get(idx)?.nativeElement;
        if (!container || !card) return;
        const left = card.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
        container.scrollTo({ left, behavior: 'smooth' });
    }

    private flashCounter() {
        this.showCounter = true;
        if (this.counterTimer) clearTimeout(this.counterTimer);
        this.counterTimer = setTimeout(() => (this.showCounter = false), 2000);
    }

    // --- 드래그 제스처 (항상 한 칸만 이동, 드래그 중에는 콘텐츠 고정) ---
    private onTouchStart = (e: TouchEvent) => {
        if (this.totalCount === 0) return;
        this.touching = true;
        this.startX = e.touches[0].clientX;
        this.lastX = this.startX;
        this.touchStartAt = Date.now();
    };

    private onTouchMove = (e: TouchEvent) => {
        if (!this.touching) return;
        // 콘텐츠는 이동하지 않도록 기본 가로 스크롤을 막는다
        e.preventDefault();
        this.lastX = e.touches[0].clientX;
    };

    private onTouchEnd = (_e: TouchEvent) => {
        if (!this.touching) return;
        this.touching = false;

        const dx = this.startX - this.lastX;
        const dt = Math.max(1, Date.now() - this.touchStartAt);
        const v = Math.abs(dx) / dt; // px/ms

        const THRESH_PX = 40;  // 이동 임계값(픽셀)
        const THRESH_V = 0.45; // 속도 임계값

        let target = this.currentIndex;
        if (Math.abs(dx) > THRESH_PX || v > THRESH_V) {
            target = this.currentIndex + (dx > 0 ? 1 : -1);
        }
        target = Math.max(0, Math.min(this.totalCount - 1, target));

        if (target !== this.currentIndex) {
            this.scrollToIndex(target); // 프로그램 스크롤 → onScroll로 인덱스 갱신 & 카운터 표시
        } else {
            // 이동 조건 미충족이면 현재 카드로 재센터링(미세한 흔들림 방지)
            this.scrollToIndex(this.currentIndex);
        }
    };
    private readonly fallbackImage = 'assets/images/giftcard-placeholder.png';

    // ...생명주기/기존 메서드 유지

    /** 카드 이미지 URL 결정 (없으면 null) */
    getCardImage(p: GiftCardPocket): string | null {
        // 서버가 절대 URL(S3 등)을 내려주면 그대로 사용.
        // 만약 상대경로를 내린다면 여기서 baseUrl을 붙이는 로직을 추가해도 됨.
        const url = p?.giftCard?.image_url?.trim();
        return url && url.length > 0 ? url : null;
    }

    /** 이미지 에러 시 자동 대체 */
    onImgError(e: Event) {
        const img = e.target as HTMLImageElement;
        if (img && img.src !== this.fallbackImage) {
            img.src = this.fallbackImage;
        }
    }
}