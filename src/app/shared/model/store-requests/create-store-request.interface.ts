export interface CreateStoreRequest {
    user_id: number
    store_name: string
    address: string
    phone?: string
    category?: string
}