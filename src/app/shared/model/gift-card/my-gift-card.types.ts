export type GiftCardType = 'EXCHANGE' | 'AMOUNT'

export type GiftCategoryCode =
    | 'CHICKEN_BURGER'
    | 'COFFEE_DRINK'
    | 'BAKERY_DESSERT'
    | 'APPAREL'
    | 'ETC';

export interface GiftCard {
    gift_card_id: number;
    name: string;
    type: GiftCardType;
    amount: number;
    category: GiftCategoryCode;
    image_url?: string | null;
    brand?: string;
    title?: string;
    shortDesc?: string;
    longDesc?: string;
}

export interface GiftCardPocket {
    pocket_id: number
    giftCard: GiftCard
    remaining_amount?: number
    is_used: boolean
}

export interface UseGiftCardDTO {
    pocket_id: number
    amount?: number
    store: string
}

export interface PurchaseGiftCardDTO {
    gift_card_id: number
}

export interface GiftCardUsageHistory {
    usage_id: number
    pocket_id: number
    amount_used?: number | null
    store: string
    used_at: string
}

export interface ApiResponseDTO<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

/** 참고용 DTO: 파일 업로드 흐름에서는 FormData를 사용합니다. */
export interface CreateGiftCardDTO {
    name: string;
    type: GiftCardType;
    amount: number;
    category: GiftCategoryCode;
    // image_url?: string; // ← URL 입력 방식이 아니라면 제거해도 됩니다.
}