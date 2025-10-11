// src/app/promotion/promotion-list/promotion-list.page.ts
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Promotion, PromotionPlacement } from 'src/app/shared/model/promotion/promotion.model';
import { PromotionService } from 'src/app/shared/services/promotion.service';

@Component({
    selector: 'app-promotion-list',
    templateUrl: './promotion-list.page.html',
    styleUrls: ['./promotion-list.page.scss'],
    standalone: false,
})
export class PromotionListPage implements OnInit {
    placement: PromotionPlacement = 'GIFT_CARD';
    items: Promotion[] = [];
    loading = false;
    errorMsg = '';

    uiFilter: 'ALL' | 'HOME' | 'GIFT_CARD' = 'GIFT_CARD';

    placementOptions: { label: string; value: PromotionPlacement }[] = [
        { label: '홈', value: 'HOME' },
        { label: '기프트카드', value: 'GIFT_CARD' },
    ];

    constructor(private promo: PromotionService) { }

    ngOnInit(): void {
        this.refresh();
    }

    setFilter(f: 'ALL' | 'HOME' | 'GIFT_CARD') {
        this.uiFilter = f;
        this.refresh();
    }

    refresh() {
        this.loading = true; this.errorMsg = '';

        if (this.uiFilter === 'ALL') {
            forkJoin([
                this.promo.listByPlacement('HOME'),
                this.promo.listByPlacement('GIFT_CARD'),
            ]).subscribe({
                next: ([home, gift]) => {
                    // id 기준 중복 제거 및 최신순 정렬(원하면 변경)
                    const map = new Map<number, Promotion>();
                    [...home, ...gift].forEach(p => map.set(p.promotion_id, p));
                    this.items = Array.from(map.values())
                        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
                    this.loading = false;
                },
                error: (err) => { console.error(err); this.loading = false; this.errorMsg = '목록 조회 실패'; }
            });
            return;
        }

        const placement = this.uiFilter as PromotionPlacement;
        this.promo.listByPlacement(placement).subscribe({
            next: (list) => { this.items = list; this.loading = false; },
            error: (err) => { console.error(err); this.loading = false; this.errorMsg = '목록 조회 실패'; }
        });
    }

    onImgError(e: Event) {
        const img = e.target as HTMLImageElement;
        if (img) img.style.display = 'none';
    }

    onPlacementChange() {
        this.refresh();
    }

    remove(item: Promotion) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        this.promo.remove(item.promotion_id).subscribe({
            next: () => {
                this.items = this.items.filter(x => x.promotion_id !== item.promotion_id);
            },
            error: (err) => {
                console.error(err);
                alert('삭제 실패');
            }
        });
    }
}