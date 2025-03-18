import { Pipe, PipeTransform } from "@angular/core"
import { EventStatus } from "../model/events/event-status.enum"

@Pipe({
    name: "eventStatusPipe",
    pure: true,
    standalone: false,
})

export class EventStatusPipe implements PipeTransform {
    private statusMap: { [key in EventStatus]: string } = {
        [EventStatus.UPCOMING]: "예정",
        [EventStatus.ONGOING]: "진행 중",
        [EventStatus.COMPLETED]: "종료",
        [EventStatus.CANCELED]: "취소됨",
    }

    transform(status: EventStatus): string {
        return this.statusMap[status]
    }
}