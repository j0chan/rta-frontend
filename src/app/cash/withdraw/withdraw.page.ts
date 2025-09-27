import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CashService } from 'src/app/shared/services/cash.service';

const WITHDRAW_DONE_FLAG = 'withdraw_done_flag';

@Component({
    selector: 'app-withdraw-page',
    templateUrl: './withdraw.page.html',
    styleUrls: ['./withdraw.page.scss'],
    standalone: false,
})
export class WithdrawPage implements OnInit {
    /** 입력된 인출 금액(원) */
    amount = 0;

    /** 보유 중 여민전 */
    owned = 0;

    /** 로딩/에러 */
    loading = false;
    errorMsg: string | null = null;

    constructor(
        private readonly cashService: CashService,
        private readonly router: Router,
    ) { }

    ngOnInit(): void {
        // 새로고침 후 플래그가 있으면 알림 → 메인 이동
        const flag = localStorage.getItem(WITHDRAW_DONE_FLAG);
        if (flag) {
            localStorage.removeItem(WITHDRAW_DONE_FLAG);
            setTimeout(() => {
                alert('인출이 완료되었습니다.');
                this.router.navigateByUrl('/'); // 메인 경로에 맞게 조정
            }, 0);
            return;
        }
        this.fetchBalance();
    }

    /** 잔액 조회 */
    private fetchBalance(): void {
        this.cashService.getMyBalance().subscribe({
            next: (bal) => (this.owned = bal ?? 0),
            error: () => (this.owned = 0),
        });
    }

    /** 숫자만 허용하여 입력값 반영 */
    onAmountInput(v: string): void {
        const onlyDigits = (v || '').replace(/[^\d]/g, '');
        this.amount = Number(onlyDigits || 0);
    }

    /** 빠른 추가 버튼: 누적 가산 */
    add(delta: number): void {
        this.amount = (this.amount || 0) + delta;
    }

    /** 제출(인출) → 성공 시 새로고침, 이후 알림 확인 시 메인 이동 */
    onSubmit(): void {
        if (this.amount <= 0 || this.loading) return;
        // (선택) 보유금액 초과 방지 – 주석 해제 시 프런트에서 선제 차단
        // if (this.amount > this.owned) { this.errorMsg = '보유 금액을 초과할 수 없습니다.'; return; }

        this.loading = true;
        this.errorMsg = null;

        this.cashService
            .withdraw(this.amount)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: () => {
                    localStorage.setItem(WITHDRAW_DONE_FLAG, '1');
                    location.reload(); // 잔액 최신화 목적
                },
                error: (err) => {
                    console.error('[WithdrawPage] withdraw error', err);
                    this.errorMsg = '인출에 실패했습니다. 잠시 후 다시 시도해주세요.';
                },
            });
    }

    /** 표시용: ₩/천단위 콤마 */
    formatKRW(v: number): string {
        try {
            return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(v || 0);
        } catch {
            return `${(v || 0).toLocaleString('ko-KR')}원`;
        }
    }
}
