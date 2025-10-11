import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Promotion, PromotionPlacement } from 'src/app/shared/model/promotion/promotion.model';
import { PromotionService } from 'src/app/shared/services/promotion.service';

@Component({
    selector: 'app-promotion-create',
    templateUrl: './promotion-create.page.html',
    styleUrls: ['./promotion-create.page.scss'],
    standalone: false,
})
export class PromotionCreatePage {

    placement: PromotionPlacement | '' = '';
    selectedFile: File | null = null;
    preview: string | null = null;                   // <img> 미리보기
    previewPromotion: Promotion | null = null;       // <app-promo-banner> 바인딩용
    submitting = false;
    errorMsg = '';

    placementOptions: { label: string; value: PromotionPlacement }[] = [
        { label: '홈', value: 'HOME' },
        { label: '기프트카드', value: 'GIFT_CARD' },
    ];

    constructor(private promo: PromotionService, private router: Router) { }

    setPlacement(p: PromotionPlacement) {
        this.placement = p;
        if (this.previewPromotion) {
            this.previewPromotion = { ...this.previewPromotion, placement: p };
        }
    }

    onFileChange(e: Event) {
        const f = (e.target as HTMLInputElement).files?.[0] ?? null;
        this.selectedFile = f;

        if (f) {
            const r = new FileReader();
            r.onload = () => {
                this.preview = String(r.result);
                // 배너 컴포넌트가 Promotion 타입을 요구 → 더미 객체 생성
                const normalizedPlacement = (this.placement || 'HOME') as PromotionPlacement;
                this.previewPromotion = {
                    promotion_id: 0,
                    image_url: this.preview || undefined,
                    placement: normalizedPlacement,
                    created_at: new Date().toISOString(),
                };
            };
            r.readAsDataURL(f);
        } else {
            this.preview = null;
            this.previewPromotion = null;
        }
    }

    isValid() {
        return !!this.placement && !!this.selectedFile;
    }

    onSubmit() { this.submit(); } // 템플릿 호환용

    submit() {
        if (this.submitting || !this.isValid()) return;
        this.submitting = true; this.errorMsg = '';

        const fd = new FormData();
        fd.append('placement', this.placement as PromotionPlacement);   // 'MAIN'도 그대로 전달 → 서비스에서 HOME으로 매핑됨
        if (this.selectedFile) fd.append('image', this.selectedFile); // 백엔드 필드명: image

        this.promo.create(fd).subscribe({
            next: () => {
                this.submitting = false;
                alert('프로모션이 생성되었습니다.');
                this.router.navigate(['/promotion/list']);
            },
            error: (err) => {
                this.submitting = false;
                console.error(err);
                this.errorMsg = err?.error?.message || '생성 실패';
            },
        });
    }
}