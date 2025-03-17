import { RequestStatus } from "../common/request-status.enum"

export interface UpdateStoreRequest {
    status: RequestStatus
    remark: string
}