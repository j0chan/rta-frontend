import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Promotion } from '../../model/promotion/promotion.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-promo-carousel',
    templateUrl: './promo-carousel.component.html',
    styleUrls: ['./promo-carousel.component.scss'],
    standalone: false,
})
export class PromoCarouselComponent implements OnInit, OnDestroy {
    @Input() promotions: Promotion[] = [];
    @Input() isAdmin = false;

    current = 0;
    private autoTimer: any;
    private emphasizeTimer: any;
    emphasize = false;

    private startX: number | null = null;
    private dragging = false;
    private readonly threshold = 40; // px

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.startAuto();
    }

    ngOnDestroy(): void {
        clearInterval(this.autoTimer);
        clearTimeout(this.emphasizeTimer);
    }

    startAuto() {
        clearInterval(this.autoTimer);
        this.autoTimer = setInterval(() => this.next(), 4500);
    }

    next() {
        if (!this.promotions?.length) return;
        this.current = (this.current + 1) % this.promotions.length;
        this.flashIndicator();
    }

    prev() {
        if (!this.promotions?.length) return;
        this.current = (this.current - 1 + this.promotions.length) % this.promotions.length;
        this.flashIndicator();
    }

    flashIndicator() {
        this.emphasize = true;
        clearTimeout(this.emphasizeTimer);
        this.emphasizeTimer = setTimeout(() => (this.emphasize = false), 2000);
    }

    onPointerDown(ev: PointerEvent) {
        this.startX = ev.clientX;
        this.dragging = true;
    }
    onPointerUp(ev: PointerEvent) {
        if (!this.dragging || this.startX == null) return;
        const delta = ev.clientX - this.startX;
        if (Math.abs(delta) > this.threshold) {
            delta < 0 ? this.next() : this.prev();
        }
        this.dragging = false;
        this.startX = null;
    }
    onPointerCancel() { this.dragging = false; this.startX = null; }

    onBannerClick() {
        if (this.isAdmin) {
            this.router.navigate(['/promotion/list']);
        }
    }
}