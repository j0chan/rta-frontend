import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GiftCard, PurchaseGiftCardDTO } from 'src/app/shared/model/gift-card/my-gift-card.types';
import { GiftCardStoreDetailService } from 'src/app/shared/services/gift-card-store-detail.service';

@Component({
    selector: 'app-gift-card-store-detail',
    templateUrl: './gift-card-store-detail.page.html',
    styleUrls: ['./gift-card-store-detail.page.scss'],
    standalone: false,
})
export class GiftCardStoreDetailPage implements OnInit, OnDestroy {
    item?: GiftCard;
    loading = true;
    errorMsg = '';
    submitting = false;
    private sub?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private detailSvc: GiftCardStoreDetailService
    ) { }

    ngOnInit(): void {
        this.sub = this.route.paramMap.subscribe((params) => {
            const id = Number(params.get('id'));
            if (!id) {
                this.router.navigate(['/gift-card-store']);
                return;
            }
            this.loading = true;
            this.errorMsg = '';
            this.detailSvc.getDetail(id).subscribe({
                next: (res) => {
                    this.item = res;
                    if (!this.item) this.errorMsg = '상품권 정보를 찾을 수 없습니다.';
                    this.loading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.errorMsg = '상품권 정보를 불러오지 못했습니다.';
                    this.loading = false;
                },
            });
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    onImgError(e: Event) {
        (e.target as HTMLImageElement).style.display = 'none';
    }

    purchase() {
        if (!this.item || this.submitting) return;
        const payload: PurchaseGiftCardDTO = { gift_card_id: this.item.gift_card_id };
        this.submitting = true;
        this.detailSvc.purchase(payload).subscribe({
            next: () => {
                this.submitting = false;
                alert('구매가 완료되었습니다.');
                this.router.navigate(['/gift-card-store']);
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                alert('구매에 실패했습니다.');
            },
        });
    }
}