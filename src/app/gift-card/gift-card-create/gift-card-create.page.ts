import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CreateGiftCardDTO, GiftCardType, GiftCategoryCode, } from 'src/app/shared/model/gift-card/my-gift-card.types'
import { CreateGiftCardService } from 'src/app/shared/services/create-gift-card.service'

type Option<T extends string> = { label: string; value: T };

@Component({
    selector: 'app-gift-card-create',
    templateUrl: './gift-card-create.page.html',
    styleUrls: ['./gift-card-create.page.scss'],
    standalone: false,
})
export class GiftCardCreatePage {
    readonly typeOptions: Option<GiftCardType>[] = [
        { label: '금액권', value: 'AMOUNT' },
        { label: '교환권', value: 'EXCHANGE' },
    ];
    readonly categoryOptions: Option<GiftCategoryCode>[] = [
        { label: '치킨/버거', value: 'CHICKEN_BURGER' },
        { label: '커피/음료', value: 'COFFEE_DRINK' },
        { label: '베이커리/디저트', value: 'BAKERY_DESSERT' },
        { label: '패션', value: 'APPAREL' },
        { label: '기타', value: 'ETC' },
    ];

    form: {
        name: string;
        type: GiftCardType | '';
        amount: number | null;
        category: GiftCategoryCode | '';
        image_url: string;
    } = {
            name: '',
            type: '',
            amount: null,
            category: '',
            image_url: '',
        };

    submitting = false;
    errorMsg = '';

    constructor(private api: CreateGiftCardService, private router: Router) { }

    typeLabel(t: GiftCardType | '') { return this.typeOptions.find(o => o.value === t)?.label || ''; }
    categoryLabel(c: GiftCategoryCode | '') { return this.categoryOptions.find(o => o.value === c)?.label || ''; }

    isValid(): boolean {
        if (!this.form.name.trim()) return false;
        if (!this.form.type) return false;
        if (!this.form.category) return false;
        const amt = Number(this.form.amount);
        return Number.isFinite(amt) && amt >= 0;
    }

    onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

    create() {
        if (this.submitting || !this.isValid()) return;
        this.submitting = true; this.errorMsg = '';

        const payload: CreateGiftCardDTO = {
            name: this.form.name.trim(),
            type: this.form.type as GiftCardType,
            amount: Number(this.form.amount),
            category: this.form.category as GiftCategoryCode,
            image_url: this.form.image_url?.trim() || undefined,
        };

        this.api.create(payload).subscribe({
            next: () => {
                this.submitting = false;
                alert('상품권이 생성되었습니다.');
                this.router.navigate(['/gift-card-store']);
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                this.errorMsg = err?.error?.message || '생성에 실패했습니다.';
            },
        });
    }
}