import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription, timer } from 'rxjs'
import { GiftCard } from 'src/app/shared/model/gift-card/my-gift-card.types'
import { GiftCardStoreService, GiftCategoryCode } from 'src/app/shared/services/gift-card-store.service'

type UiCategory = { id: GiftCategoryCode | 'ALL'; label: string };

@Component({
    selector: 'app-gift-card-store',
    templateUrl: './gift-card-store.page.html',
    styleUrls: ['./gift-card-store.page.scss'],
    standalone: false,
})
export class GiftCardStorePage implements OnInit, AfterViewInit, OnDestroy {
    readonly categories: UiCategory[] = [
        { id: 'ALL', label: '전체' },
        { id: 'CHICKEN_BURGER', label: '치킨/버거' },
        { id: 'COFFEE_DRINK', label: '커피/음료' },
        { id: 'BAKERY_DESSERT', label: '베이커리/디저트' },
        { id: 'APPAREL', label: '패션' },
        { id: 'ETC', label: '기타' },
    ];
    selectedCategory: UiCategory['id'] = 'ALL';

    loading = false;
    errorMsg = '';
    items: GiftCard[] = [];

    // ✅ 추천 슬라이더
    @ViewChild('recoCarousel', { static: false }) recoCarouselRef?: ElementRef<HTMLDivElement>;
    @ViewChildren('recoCard') recoCardRefs?: QueryList<ElementRef<HTMLDivElement>>;

    recoItems = [
        { imageText: '추천 1' },
        { imageText: '추천 2' },
        { imageText: '추천 3' },
    ];
    recoIndex = 0;
    showRecoCounter = true;
    private recoTimer?: any;         // setInterval 핸들
    private recoTouching = false;
    private startX = 0;
    private lastX = 0;
    private touchStartAt = 0;

    private subList?: Subscription;
    private subLoad?: Subscription;

    constructor(
        private storeSvc: GiftCardStoreService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.subList = this.storeSvc.getCatalog().subscribe((list) => {
            this.items = list ?? [];
        });
        this.fetch(); // 최초
    }

    ngAfterViewInit(): void {
        // 자동 슬라이드
        this.startAutoSlide();

        // 제스처(드래그 후 1장 이동)
        const el = this.recoCarouselRef?.nativeElement;
        if (!el) return;
        el.addEventListener('touchstart', this.onTouchStart, { passive: false });
        el.addEventListener('touchmove', this.onTouchMove, { passive: false });
        el.addEventListener('touchend', this.onTouchEnd, { passive: true });
    }

    ngOnDestroy(): void {
        this.subList?.unsubscribe();
        this.subLoad?.unsubscribe();
        this.stopAutoSlide();

        const el = this.recoCarouselRef?.nativeElement;
        if (el) {
            el.removeEventListener('touchstart', this.onTouchStart as any);
            el.removeEventListener('touchmove', this.onTouchMove as any);
            el.removeEventListener('touchend', this.onTouchEnd as any);
        }
    }

    // --- 데이터 로드 ---
    selectCategory(id: UiCategory['id']) {
        if (this.selectedCategory === id) return;
        this.selectedCategory = id;
        this.fetch();
    }

    private fetch() {
        this.loading = true;
        this.errorMsg = '';
        this.subLoad?.unsubscribe();

        const category = this.selectedCategory === 'ALL' ? undefined : (this.selectedCategory as GiftCategoryCode);
        this.subLoad = this.storeSvc.refreshCatalog({ category, sort: 'LATEST' }).subscribe({
            next: () => (this.loading = false),
            error: (err) => {
                console.error(err);
                this.errorMsg = '상품권 목록을 불러오지 못했습니다.';
                this.loading = false;
            },
        });
    }

    trackById(_: number, item: GiftCard) {
        return item.gift_card_id;
    }
    goDetail(item: GiftCard) {
        this.router.navigate(['/gift-card-store-detail', item.gift_card_id]);
    }

    onImgError(e: Event) {
        const t = e.target as HTMLImageElement;
        t.style.display = 'none';
    }

    // --- 추천 슬라이더 로직 ---
    private startAutoSlide() {
        this.stopAutoSlide();
        this.recoTimer = setInterval(() => {
            this.slideTo(this.recoIndex + 1);
        }, 4000); // 4초 간격
    }
    private stopAutoSlide() {
        if (this.recoTimer) clearInterval(this.recoTimer);
        this.recoTimer = null;
    }
    private slideTo(idx: number) {
        const el = this.recoCarouselRef?.nativeElement;
        const card = this.recoCardRefs?.get(0)?.nativeElement; // 폭 계산 용
        if (!el || !card) return;

        const last = this.recoItems.length - 1;
        const target = Math.max(0, Math.min(last, idx));
        this.recoIndex = target;
        const offset = target * (card.offsetWidth + 12 /*gap*/);
        el.scrollTo({ left: offset, behavior: 'smooth' });
        this.flashCounter();
    }
    private flashCounter() {
        this.showRecoCounter = true;
        // 2초 뒤 자동 숨김
        timer(2000).subscribe(() => (this.showRecoCounter = false));
    }

    // 드래그 제스처 (항상 한 칸만 이동, 드래그 중 이동 없음)
    private onTouchStart = (e: TouchEvent) => {
        this.stopAutoSlide();
        this.recoTouching = true;
        this.startX = e.touches[0].clientX;
        this.lastX = this.startX;
        this.touchStartAt = Date.now();
    };
    private onTouchMove = (e: TouchEvent) => {
        if (!this.recoTouching) return;
        e.preventDefault(); // 콘텐츠 이동 방지
        this.lastX = e.touches[0].clientX;
    };
    private onTouchEnd = () => {
        if (!this.recoTouching) return;
        this.recoTouching = false;

        const dx = this.startX - this.lastX;
        const dt = Math.max(1, Date.now() - this.touchStartAt);
        const v = Math.abs(dx) / dt; // px/ms

        const THRESH_PX = 40;
        const THRESH_V = 0.45;

        let target = this.recoIndex;
        if (Math.abs(dx) > THRESH_PX || v > THRESH_V) {
            target = this.recoIndex + (dx > 0 ? 1 : -1);
        }
        this.slideTo(target);
        this.startAutoSlide(); // 제스처 끝나면 다시 자동슬라이드
    };
}