import { Pipe, PipeTransform } from "@angular/core"
import { RequestStatus } from "../model/common/request-status.enum"

@Pipe({
    name: "requestStatusPipe",
    pure: true,
    standalone: false,
})

export class RequestStatusPipe implements PipeTransform {
    private statusMap: { [key in RequestStatus]: string } = {
        [RequestStatus.SUBMITTED]: "제출됨",
        [RequestStatus.APPROVED]: "승인됨",
        [RequestStatus.REJECTED]: "거절됨",
    }

    transform(status: RequestStatus): string {
        return this.statusMap[status]
    }
}