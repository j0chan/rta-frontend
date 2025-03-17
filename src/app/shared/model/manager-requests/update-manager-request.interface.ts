import { RequestStatus } from "../../shared/common/request-status.enum"

export interface UpdateManagerRequest {
    status: RequestStatus
    remark: string
}