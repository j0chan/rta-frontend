import { UploadType } from "./upload-type.enum"

export interface File {
    file_id: number
    url: string
    upload_type: UploadType
    content_type: string
    created_at: Date
}