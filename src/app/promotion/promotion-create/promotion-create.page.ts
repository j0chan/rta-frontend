import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Promotion } from 'src/app/shared/model/promotion/promotion.model';
import { PromotionService } from 'src/app/shared/services/promotion.service';

@Component({
    selector: 'app-promotion-create',
    templateUrl: './promotion-create.page.html',
    styleUrls: ['./promotion-create.page.scss'],
    standalone: false,
})
export class PromotionCreatePage implements OnInit, OnDestroy {
    form = this.fb.group({
        image_url: ['', [Validators.required]],
        placement: ['MAIN' as 'MAIN' | 'GIFT_CARD', [Validators.required]], // ✅ 기본 메인
    });

    preview: Promotion | null = null;
    saving = false;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private promoSvc: PromotionService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        // 입력값 변경 → 미리보기 즉시 반영
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(v => {
            const url = (v.image_url || '').trim();
            this.preview = url
                ? ({ promotion_id: 0, image_url: url, placement: v.placement || 'MAIN' } as Promotion)
                : null;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(); this.destroy$.complete();
    }

    setPlacement(p: 'MAIN' | 'GIFT_CARD') {
        if (this.form.value.placement === p) return;
        this.form.patchValue({ placement: p });
    }

    onSubmit() {
        if (this.form.invalid || this.saving) {
            this.form.markAllAsTouched();
            return;
        }
        const payload = {
            image_url: this.form.value.image_url!.trim(),
            placement: this.form.value.placement!,
        };

        this.saving = true;
        this.promoSvc.create(payload).subscribe({
            next: () => {
                this.saving = false;
                this.router.navigate(['/promotion/list']);
            },
            error: (err) => {
                console.error('[PromotionCreate] create failed', err);
                this.saving = false;
                alert('저장에 실패했습니다. 다시 시도해 주세요.');
            }
        });
    }
}