import { Component, OnInit } from '@angular/core';
import { Promotion } from 'src/app/shared/model/promotion/promotion.model';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-promotion-list',
    templateUrl: './promotion-list.page.html',
    styleUrls: ['./promotion-list.page.scss'],
    standalone: false,
})
export class PromotionListPage implements OnInit {
    items: Promotion[] = [];
    loading = false;

    constructor(private promo: PromotionService, private router: Router) { }

    ngOnInit(): void {
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.promo.adminList().subscribe({
            next: (res) => { this.items = res; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    remove(id: number) {
        if (!confirm('이 프로모션을 삭제할까요?')) return;
        this.promo.delete(id).subscribe(() => {
            this.items = this.items.filter(x => x.promotion_id !== id);
        });
    }

    goCreate() {
        this.router.navigate(['/promotion/create']);
    }

    onImgError(ev: Event) {
        const img = ev.target as HTMLImageElement | null;
        if (img) img.style.display = 'none';
    }

}