import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Notice } from 'src/app/shared/model/notice/notice.model';
import { NoticeService } from 'src/app/shared/services/notice.service';
import { RefreshService } from 'src/app/shared/services/refresh.service';

@Component({
    selector: 'app-notice-detail',
    templateUrl: './notice-detail.page.html',
    styleUrls: ['./notice-detail.page.scss'],
    standalone: false,
})
export class NoticeDetailPage implements OnInit {
    notice?: Notice;
    id!: number;
    loading = false;
    deleting = false;

    /** 템플릿에서 비교할 역할 문자열 ('ADMIN' | 'USER' | null) */
    role: string | null = null;

    constructor(
        private noticeService: NoticeService,
        private route: ActivatedRoute,
        private router: Router,
        private refresh: RefreshService,
    ) { }

    ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.role = this.readRoleFromStorageOrJwt();
        this.fetch();
    }

    fetch() {
        this.loading = true;
        this.noticeService.detail(this.id).subscribe({
            next: (n) => {
                this.notice = n;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    goEdit() {
        this.router.navigate(['/notice/edit', this.id]);
    }

    onDelete(id: number) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        this.deleting = true;

        this.noticeService.delete(id).subscribe({
            next: () => {
                this.deleting = false;
                // 리스트에게 "다시 불러" 신호
                this.refresh.emitNoticeRefresh();
                // 리스트로 이동
                this.router.navigate(['/notice']);
            },
            error: () => {
                this.deleting = false;
            },
        });
    }

    goList() {
        this.router.navigate(['/notice']);
    }

    /** 로컬스토리지/JWT에서 역할을 읽어 안전하게 정규화 */
    private readRoleFromStorageOrJwt(): string | null {
        let raw: unknown =
            localStorage.getItem('role') ?? localStorage.getItem('user_role');

        if (
            typeof raw === 'string' &&
            (raw.startsWith('"') || raw.startsWith('{') || raw.startsWith('['))
        ) {
            try {
                raw = JSON.parse(raw);
            } catch {
                /* ignore */
            }
        }

        if (!raw) {
            const token =
                localStorage.getItem('accessToken') ||
                localStorage.getItem('access_token');
            if (token && token.includes('.')) {
                const payload = this.parseJwt(token);
                raw = payload?.role ?? (Array.isArray(payload?.roles) ? payload.roles[0] : null);
            }
        }

        if (raw == null) return null;
        const norm = String(raw).trim().toUpperCase();
        return norm || null;
    }

    /** 간단한 JWT payload 파서 */
    private parseJwt(token: string): any | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(''),
            );
            return JSON.parse(json);
        } catch {
            return null;
        }
    }
}
