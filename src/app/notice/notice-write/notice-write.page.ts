import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticeService } from 'src/app/shared/services/notice.service';

@Component({
  selector: 'app-notice-write',
  templateUrl: './notice-write.page.html',
  styleUrls: ['./notice-write.page.scss'],
  standalone: false,
})
export class NoticeWritePage {
  isEdit = false;
  id?: number;
  saving = false;
  errorMsg = '';

  // 단순 바인딩 모델 (템플릿-드리븐)
  model = {
    title: '',
    content: '',
    is_pinned: false,
  };

  constructor(
    private noticeService: NoticeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = Number(idParam);
      this.loadDetail(this.id);
    }
  }

  // 유효성: 제목과 내용이 모두 입력되어야 활성화
  isValid(): boolean {
    return this.model.title.trim().length > 0 && this.model.content.trim().length > 0;
  }

  loadDetail(id: number) {
    this.noticeService.detail(id).subscribe({
      next: (n) => {
        this.model.title = n.title ?? '';
        this.model.content = n.content ?? '';
        this.model.is_pinned = !!n.is_pinned;
      },
      error: () => { this.errorMsg = '상세 정보를 불러오지 못했어요.'; }
    });
  }

  submit() {
    if (!this.isValid() || this.saving) return;

    this.saving = true;
    const payload = { ...this.model };

    const obs = this.isEdit && this.id
      ? this.noticeService.update(this.id, payload)
      : this.noticeService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/notice']);
      },
      error: () => {
        this.saving = false;
        this.errorMsg = '저장 중 오류가 발생했어요.';
      }
    });
  }

  cancel() {
    if (this.isEdit && this.id) this.router.navigate(['/notice/detail', this.id]);
    else this.router.navigate(['/notice']);
  }
}
