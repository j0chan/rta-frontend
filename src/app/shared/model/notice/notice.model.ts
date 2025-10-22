export interface Notice {
    notice_id: number;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
    author?: {
        user_id: number;
        username?: string;
        nickname?: string;
        email?: string;
    } | null;
}

export interface NoticeListResponse {
    items: Notice[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ApiResponseDTO<T> {
    success: boolean;
    data?: T;
    message?: string;
}