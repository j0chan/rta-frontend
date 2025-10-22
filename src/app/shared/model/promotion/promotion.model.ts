export type PromotionPlacement = 'HOME' | 'GIFT_CARD';

export interface Promotion {
    promotion_id: number;
    image_url?: string | null;
    placement: PromotionPlacement;
    created_at: string;
}