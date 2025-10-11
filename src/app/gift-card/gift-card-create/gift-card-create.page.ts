import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GiftCardType, GiftCategoryCode } from 'src/app/shared/model/gift-card/my-gift-card.types';
import { CreateGiftCardService } from 'src/app/shared/services/create-gift-card.service';

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
    } = {
            name: '',
            type: '',
            amount: null,
            category: '',
        };

    submitting = false;
    errorMsg = '';

    // 파일 업로드 상태
    selectedFile: File | null = null;
    previewDataUrl: string | null = null;

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

    onFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files && input.files[0];
        this.selectedFile = file ?? null;

        // 미리보기
        if (file) {
            const reader = new FileReader();
            reader.onload = () => this.previewDataUrl = String(reader.result);
            reader.readAsDataURL(file);
        } else {
            this.previewDataUrl = null;
        }
    }

    create() {
        if (this.submitting || !this.isValid()) return;
        this.submitting = true; this.errorMsg = '';

        // multipart/form-data 구성
        const fd = new FormData();
        fd.append('name', this.form.name.trim());
        fd.append('type', this.form.type as GiftCardType);
        fd.append('amount', String(Number(this.form.amount)));
        fd.append('category', this.form.category as GiftCategoryCode);
        if (this.selectedFile) fd.append('image', this.selectedFile); // ★ 백엔드 FileInterceptor('image')와 일치

        this.api.createWithFile(fd).subscribe({
            next: () => {
                this.submitting = false;
                alert('상품권이 생성되었습니다.');
                this.router.navigate(['/gift-card-store']); // 성공 시에만 이동
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                this.errorMsg = err?.error?.message || '생성에 실패했습니다.';
            },
        });
    }
}