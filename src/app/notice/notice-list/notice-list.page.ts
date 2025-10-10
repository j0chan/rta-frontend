import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notice } from 'src/app/shared/model/notice/notice.model';
import { NoticeService } from 'src/app/shared/services/notice.service';

@Component({
    selector: 'app-notice-list',
    templateUrl: './notice-list.page.html',
    styleUrls: ['./notice-list.page.scss'],
    standalone: false,
})
export class NoticeListPage implements OnInit {
    keyword = '';
    pinned: Notice[] = [];
    loadingPinned = false;

    regular: Notice[] = [];
    loadingRegular = false;
    page = 1;
    readonly pageSize = 10;
    totalRegular = 0;

    constructor(
        private noticeService: NoticeService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.refreshAll();
    }

    refreshAll() {
        this.page = 1;
        this.fetchPinned();
        this.fetchRegular(true);
    }

    fetchPinned() {
        this.loadingPinned = true;
        this.noticeService.list({ keyword: this.keyword || undefined, page: 1, pageSize: 50, isPinnedOnly: true })
            .subscribe({
                next: (res) => {
                    this.pinned = res.items;
                    this.loadingPinned = false;
                },
                error: () => { this.loadingPinned = false; }
            });
    }

    fetchRegular(reset = false) {
        if (reset) this.regular = [];
        this.loadingRegular = true;

        this.noticeService.list({
            keyword: this.keyword || undefined,
            page: this.page,
            pageSize: this.pageSize,
            excludePinned: true,
        }).subscribe({
            next: (res) => {
                this.totalRegular = res.total;
                this.regular = reset ? res.items : [...this.regular, ...res.items];
                this.loadingRegular = false;
            },
            error: () => { this.loadingRegular = false; }
        });
    }

    onSearch() {
        this.page = 1;
        this.fetchPinned();
        this.fetchRegular(true);
    }

    loadMore() {
        if (this.hasMore) {
            this.page++;
            this.fetchRegular(false);
        }
    }

    get hasMore(): boolean {
        const loaded = this.regular.length;
        return loaded < this.totalRegular;
    }

    goDetail(n: Notice) {
        this.router.navigate(['/notice/detail', n.notice_id]);
    }

    trackById(_: number, n: Notice) {
        return n.notice_id;
    }

    get isAdmin(): boolean {
        const role = (localStorage.getItem('role') || localStorage.getItem('user_role') || '').toUpperCase();
        return role === 'ADMIN' || role === 'ROLE_ADMIN';
    }

    goCreate() {
        this.router.navigate(['/notice/write']);
    }
}