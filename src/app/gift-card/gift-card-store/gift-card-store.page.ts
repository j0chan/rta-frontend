import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GiftCard } from 'src/app/shared/model/gift-card/my-gift-card.types';
import { GiftCardStoreService, GiftCategoryCode } from 'src/app/shared/services/gift-card-store.service';

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

    /* ===== 추천 캐러셀 ===== */
    @ViewChild('recoCarousel', { static: false }) recoCarouselRef?: ElementRef<HTMLDivElement>;
    @ViewChildren('recoCard') recoCardRefs?: QueryList<ElementRef<HTMLDivElement>>;

    // 이미지 전용
    recoItems = [
        { image_url: '', imageText: '추천 1' },
        { image_url: '', imageText: '추천 2' },
        { image_url: '', imageText: '추천 3' },
    ];
    recoIndex = 0;

    // 카운터는 항상 표시
    showRecoCounter = true;

    private recoTimer?: any;     // setInterval 핸들
    private recoTouching = false;
    private startX = 0;
    private lastX = 0;

    private subList?: Subscription;
    private subLoad?: Subscription;

    constructor(
        private storeSvc: GiftCardStoreService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.subList = this.storeSvc.getCatalog().subscribe((list) => this.items = list ?? []);
        this.fetch();
    }
    ngAfterViewInit(): void { this.startAutoSlide(); }
    ngOnDestroy(): void {
        this.subList?.unsubscribe();
        this.subLoad?.unsubscribe();
        this.stopAutoSlide();
    }

    /* ===== 데이터 로드 ===== */
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
            error: (err) => { console.error(err); this.errorMsg = '상품권 목록을 불러오지 못했습니다.'; this.loading = false; },
        });
    }

    trackById(_: number, item: GiftCard) { return item.gift_card_id; }
    goDetail(item: GiftCard) { this.router.navigate(['/gift-card-store-detail', item.gift_card_id]); }
    onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

    /* ===== 캐러셀 로직 ===== */
    private startAutoSlide() {
        this.stopAutoSlide();
        this.recoTimer = setInterval(() => this.slideTo(this.recoIndex + 1), 4000);
    }
    private stopAutoSlide() {
        if (this.recoTimer) clearInterval(this.recoTimer);
        this.recoTimer = undefined;
    }
    private getCardGap(): number {
        const el = this.recoCarouselRef?.nativeElement;
        if (!el) return 12;
        const gap = getComputedStyle(el).gap || '12px';
        const n = parseFloat(gap);
        return isNaN(n) ? 12 : n;
    }
    /** index로 이동 (마지막→첫, 첫→마지막 루프) */
    private slideTo(idx: number) {
        const el = this.recoCarouselRef?.nativeElement;
        const card = this.recoCardRefs?.get(0)?.nativeElement;
        if (!el || !card || this.recoItems.length === 0) return;

        const last = this.recoItems.length - 1;
        if (idx > last) idx = 0;
        if (idx < 0) idx = last;

        this.recoIndex = idx;

        const offset = idx * (card.offsetWidth + this.getCardGap());
        el.scrollTo({ left: offset, behavior: 'smooth' });
    }

    // 수동 스와이프 (템플릿 바인딩용 public)
    public onTouchStart = (e: TouchEvent) => {
        this.stopAutoSlide();
        this.recoTouching = true;
        this.startX = e.touches[0].clientX;
        this.lastX = this.startX;
    };
    public onTouchMove = (e: TouchEvent) => {
        if (!this.recoTouching) return;
        e.preventDefault();
        this.lastX = e.touches[0].clientX;
    };
    public onTouchEnd = (_e: TouchEvent) => {
        if (!this.recoTouching) return;
        this.recoTouching = false;

        const dx = this.startX - this.lastX;
        const THRESH_PX = 40;

        let target = this.recoIndex;
        if (Math.abs(dx) > THRESH_PX) target = this.recoIndex + (dx > 0 ? 1 : -1);

        this.slideTo(target);
        this.startAutoSlide();
    };
}