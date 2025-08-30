// src/app/shared/model/gift-card/my-gift-card.types.ts
export type GiftCardType = 'EXCHANGE' | 'AMOUNT';

export interface GiftCard {
    gift_card_id: number;
    name: string;
    type: GiftCardType;
    exchange_item_name?: string;
    image_url?: string | null;
}

export interface GiftCardPocket {
    pocket_id: number;
    giftCard: GiftCard;
    remaining_amount?: number;
    is_used: boolean;
}

export interface UseGiftCardDTO {
    pocket_id: number;
    amount?: number;
    store: string;
}

export interface PurchaseGiftCardDTO {
    gift_card_id: number;
}

export interface GiftCardUsageHistory {
    usage_id: number;
    pocket_id: number;
    amount_used?: number | null;
    store: string;
    used_at: string; // ISO datetime
}

/** ✅ 백엔드에서 쓰는 공용 래퍼 구조 */
export interface ApiResponseDTO<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}