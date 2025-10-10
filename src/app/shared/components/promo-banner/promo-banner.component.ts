import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Promotion } from '../../model/promotion/promotion.model';

@Component({
    selector: 'app-promo-banner',
    templateUrl: './promo-banner.component.html',
    styleUrls: ['./promo-banner.component.scss'],
    standalone: false,
})
export class PromoBannerComponent {
    @Input() promotion!: Promotion;
    @Input() index = 0;
    @Input() total = 1;
    @Input() emphasize = false; // 슬라이드 직후 2초 강조
    @Input() isAdmin = false;

    @Output() clicked = new EventEmitter<void>();

    onClick() {
        this.clicked.emit();
    }
}