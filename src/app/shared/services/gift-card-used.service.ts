import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MyGiftCardService } from 'src/app/shared/services/my-gift-card.service';
import type { GiftCardPocket, GiftCardUsageHistory } from 'src/app/shared/model/gift-card/my-gift-card.types';

/** 표시용 메타를 추가한 뷰 모델 */
export type UsedPocketVM = GiftCardPocket & {
    _usedAt?: string;       // 최종 사용완료 시각(usage-history 기반 보정)
    _purchasedAt?: string;  // 구매 시각
    _price?: number;        // 사용자가 실제로 지불한 금액(추정 우선순위)
};

@Injectable({ providedIn: 'root' })
export class GiftCardUsedService {
    constructor(private readonly mySvc: MyGiftCardService) { }

    /** 백엔드 새로고침: 포켓 목록만 갱신 (사용내역은 스트림 결합 시 매번 불러옴) */
    refresh() {
        return this.mySvc.refreshMyPockets();
    }

    /** 사용완료 포켓 + 메타(구매일/사용일/금액) 주입 + 사용일 내림차순 정렬 */
    getUsedPocketsWithMeta(): Observable<UsedPocketVM[]> {
        return combineLatest([
            this.mySvc.getPockets(),         // 내 포켓
            this.mySvc.getUsageHistory(),    // 사용 내역
        ]).pipe(
            map(([pockets, history]) => {
                const latestUsedAtMap = this.buildLatestUsedAtMap(history || []);
                const result = (pockets ?? [])
                    .filter((p) => this.isUsed(p))                 // 사용완료만
                    .map<UsedPocketVM>((p) => ({
                        ...p,
                        _usedAt: this.pickUsedAt(p, latestUsedAtMap),       // 사용일
                        _purchasedAt: this.pickPurchasedAt(p),               // 구매일
                        _price: this.pickPrice(p),                           // 금액
                    }))
                    .sort((a, b) => (this.toTime(b._usedAt) - this.toTime(a._usedAt))); // 사용일 desc
                return result;
            })
        );
    }

    // --- 내부 유틸 ---

    /** 사용완료 판정 */
    private isUsed(p: GiftCardPocket): boolean {
        const type = p?.giftCard?.type;
        if (type === 'AMOUNT') {
            const remain = p?.remaining_amount ?? 0;
            return remain <= 0 || !!p?.is_used;
        }
        return !!p?.is_used; // EXCHANGE
    }

    /** usage-history에서 포켓별 가장 최근 사용시각 맵 생성 */
    private buildLatestUsedAtMap(history: GiftCardUsageHistory[]) {
        const mapLatest = new Map<number, string>();
        for (const h of history) {
            const anyH: any = h as any;
            const pid: number | undefined =
                anyH?.pocket_id ?? anyH?.pocket?.pocket_id ?? anyH?.pocketId;
            if (!pid) continue;

            const ts: string | undefined =
                anyH?.used_at ??
                anyH?.created_at ??
                anyH?.updated_at ??
                anyH?.timestamp ??
                anyH?.createdAt ??
                anyH?.updatedAt ??
                anyH?.time;

            if (!ts) continue;
            const prev = mapLatest.get(pid);
            if (!prev || this.toTime(ts) > this.toTime(prev)) {
                mapLatest.set(pid, ts);
            }
        }
        return mapLatest;
    }

    /** 사용일 선택: usage-history 최우선 → 포켓의 used_at/updated_at 등 */
    private pickUsedAt(p: any, latestUsedAtMap: Map<number, string>): string | undefined {
        const pid = p?.pocket_id;
        const fromHist = pid ? latestUsedAtMap.get(pid) : undefined;
        if (fromHist) return fromHist;

        return (
            p?.used_at ??
            p?.last_used_at ??
            p?.updated_at ??
            p?.usedAt ??
            p?.updatedAt ??
            undefined
        );
    }

    /** 구매일 선택 */
    private pickPurchasedAt(p: any): string | undefined {
        return (
            p?.purchased_at ??
            p?.purchasedAt ??
            p?.created_at ??
            p?.createdAt ??
            undefined
        );
    }

    /** 금액 선택: 실제 결제금액을 우선으로 추정 */
    private pickPrice(p: any): number {
        const gc = p?.giftCard ?? {};
        const n =
            this.num(p?.purchase_price) ??
            this.num(p?.price_paid) ??
            this.num(p?.paid_amount) ??
            this.num(p?.amount) ??
            this.num(p?.original_amount) ??
            this.num(p?.face_value) ??
            this.num(gc?.price) ??
            0;
        return n;
    }

    private num(v: any): number | undefined {
        return typeof v === 'number' && !isNaN(v) ? v : undefined;
    }

    private toTime(s?: string): number {
        if (!s) return 0;
        const t = new Date(s).getTime();
        return isNaN(t) ? 0 : t;
    }
}
