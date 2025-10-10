export type PromotionPlacement = 'MAIN' | 'GIFT_CARD';

export interface Promotion {
    promotion_id: number;
    image_url: string;
    placement: PromotionPlacement;
    created_at?: string;
}