import { RequestStatus } from "../common/request-status.enum"

export interface UpdateManagerRequest {
    status: RequestStatus
    remark: string
}