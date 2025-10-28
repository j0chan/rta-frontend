import { File } from "../file/file.interface"
import { ReadReply } from "../replies/read-reply.interface"

export interface ReadReview {
    review_id: number
    user: {
        id: number
        nickname: string
        profile_image: {
            url: string
        }
    }
    store: {
        store_id: number
        store_name: string
    }
    content: string
    helpful_count: number
    reply?: ReadReply
    date: Date
    isModified: Boolean
    files: File[]
    isHelpful?: boolean
}