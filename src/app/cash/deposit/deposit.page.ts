import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { CashService } from 'src/app/shared/services/cash.service';

const DEPOSIT_DONE_FLAG = 'deposit_done_flag';

@Component({
    selector: 'app-deposit-page',
    templateUrl: './deposit.page.html',
    styleUrls: ['./deposit.page.scss'],
    standalone: false,
})
export class DepositPage implements OnInit {
    /** 입력된 충전 금액(원) */
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
        const flag = localStorage.getItem(DEPOSIT_DONE_FLAG);
        if (flag) {
            localStorage.removeItem(DEPOSIT_DONE_FLAG);
            // 초기 렌더가 끝난 뒤 알림을 띄우도록 살짝 지연
            setTimeout(() => {
                alert('충전이 완료되었습니다.');
                this.router.navigateByUrl('/'); // 메인 경로가 다르면 수정
            }, 0);
            return; // 굳이 잔액 조회까지는 필요 없음(곧 메인으로 이동)
        }

        this.fetchBalance();
    }

    /** 초기 잔액 불러오기 */
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

    /** 제출(충전) → 성공 시 새로고침, 이후 알림 확인 시 메인 이동 */
    onSubmit(): void {
        if (this.amount <= 0 || this.loading) return;
        this.loading = true;
        this.errorMsg = null;

        this.cashService
            .deposit(this.amount)
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: () => {
                    // 새로고침 후에도 성공 상태를 기억하기 위해 플래그 저장
                    localStorage.setItem(DEPOSIT_DONE_FLAG, '1');
                    // 전체 페이지 새로고침으로 앱 상태/잔액 최신화
                    location.reload();
                },
                error: (err) => {
                    console.error('[DepositPage] deposit error', err);
                    this.errorMsg = '충전에 실패했습니다. 잠시 후 다시 시도해주세요.';
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
