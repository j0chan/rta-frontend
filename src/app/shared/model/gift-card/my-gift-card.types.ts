export type GiftCardType = 'EXCHANGE' | 'AMOUNT';

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
    // 필요시 확장 필드 (브랜드/설명 등)
    brand?: string;
    title?: string;
    shortDesc?: string;
    longDesc?: string;
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
    used_at: string;
}

export interface ApiResponseDTO<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}