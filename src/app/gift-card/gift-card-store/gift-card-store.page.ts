import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GiftCard } from 'src/app/shared/model/gift-card/my-gift-card.types';
import { GiftCardStoreService, GiftCategoryCode } from 'src/app/shared/services/gift-card-store.service';
import { Promotion } from 'src/app/shared/model/promotion/promotion.model';
import { PromotionService } from 'src/app/shared/services/promotion.service';

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

    /* ===== 프로모션 캐러셀 (GIFT_CARD) ===== */
    promos: Promotion[] = [];
    promoIndex = 0;            // 0-based
    promoEmph = false;         // 슬라이드 직후 강조
    private promoTimer?: any;

    private subList?: Subscription;
    private subLoad?: Subscription;

    private dragStartX: number | null = null;
    private dragging = false;
    private readonly THRESHOLD = 40;

    constructor(
        private storeSvc: GiftCardStoreService,
        private promoSvc: PromotionService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // 프로모션 로드
        this.promoSvc.listActive('GIFT_CARD').subscribe({
            next: (list) => {
                this.promos = list ?? [];
                this.promoIndex = 0;
                this.startAuto();
                this.flashEmphasis();
            },
            error: (err) => console.error('[GiftCardStore] promotions load error', err),
        });

        // 상품 리스트 구독
        this.subList = this.storeSvc.getCatalog().subscribe((list) => this.items = list ?? []);
        this.fetch();
    }

    ngAfterViewInit(): void { /* 필요 시 */ }

    ngOnDestroy(): void {
        this.subList?.unsubscribe();
        this.subLoad?.unsubscribe();
        clearInterval(this.promoTimer);
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
    goDetail(item: GiftCard) { this.router.navigate(['/gift-card/detail', item.gift_card_id]); }
    onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

    /* ===== 프로모션 캐러셀: 한 번에 1장, 드래그 후 이동 ===== */
    private startAuto() {
        clearInterval(this.promoTimer);
        if (!this.promos.length) return;
        this.promoTimer = setInterval(() => this.next(), 4500);
    }

    private flashEmphasis() {
        this.promoEmph = true;
        setTimeout(() => (this.promoEmph = false), 2000);
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

    /** 배너 클릭: 운영자면 리스트 이동 */
    onPromoClick() {
        this.router.navigate(['/promotion/list']);
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

    /** Touch */
    onPromoTouchStart(ev: TouchEvent) {
        if (ev.touches && ev.touches.length) this.beginDrag(ev.touches[0].clientX);
    }
    onPromoTouchEnd(ev: TouchEvent) {
        const t = ev.changedTouches && ev.changedTouches[0];
        this.endDrag(t ? t.clientX : undefined);
    }

    /** Mouse */
    onPromoMouseDown(ev: MouseEvent) { this.beginDrag(ev.clientX); }
    onPromoMouseUp(ev: MouseEvent) { this.endDrag(ev.clientX); }
    onPromoMouseLeave() { this.endDrag(); }
}