import { ReadReply } from "../replies/read-reply.interface"

export interface ReadReview {
    review_id: number
    user_name: string
    user_id: number
    store_name: string
    content: string
    helpful_count: number
    reply?: ReadReply
    date: Date
    isModified: Boolean
    image_urls: string[]
}