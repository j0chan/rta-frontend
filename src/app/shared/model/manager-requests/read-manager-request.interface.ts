import { RequestStatus } from "../../shared/common/request-status.enum"

export interface ReadManagerRequest {
    request_id: number
    user_id: number
    user_name: string
    store_id: number
    store_name: string
    created_at: Date
    status: RequestStatus
    remark: string
}