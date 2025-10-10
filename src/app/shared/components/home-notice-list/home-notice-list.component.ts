// src/app/shared/components/home-notice-list/home-notice-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notice } from 'src/app/shared/model/notice/notice.model';
import { NoticeService } from 'src/app/shared/services/notice.service';

@Component({
    selector: 'app-home-notice-list',
    templateUrl: './home-notice-list.component.html',
    styleUrls: ['./home-notice-list.component.scss'],
    standalone: false,
})
export class HomeNoticeListComponent implements OnInit {
    loading = false;
    total = 0;
    items: Notice[] = [];
    private lastFetchedCount = 0;

    readonly VISIBLE_COUNT = 3;

    constructor(
        private noticeService: NoticeService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.fetchTop4();
    }

    fetchTop4(): void {
        this.loading = true;
        this.noticeService
            .list({ page: 1, pageSize: 4 })
            .subscribe({
                next: (res) => {
                    this.total = res?.total ?? 0;
                    this.lastFetchedCount = res?.items?.length ?? 0;
                    this.items = (res?.items ?? []).slice(0, this.VISIBLE_COUNT);
                    this.loading = false;
                },
                error: () => { this.loading = false; }
            });
    }

    get showMore(): boolean {
        const basis = this.total > 0 ? this.total : this.lastFetchedCount;
        return basis >= 4;
    }

    goDetail(n: Notice) {
        this.router.navigate(['/notice/detail', n.notice_id]);
    }

    goMore() {
        this.router.navigate(['/notice']);
    }

    trackById(_: number, n: Notice) { return n.notice_id; }
}