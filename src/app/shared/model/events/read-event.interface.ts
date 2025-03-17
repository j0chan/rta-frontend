import { EventStatus } from "../../shared/common/event-status.enum"

export interface ReadEvent {
    event_id: number
    title: string
    description: string
    start_date: Date
    end_date: Date
    event_status: EventStatus
    created_at: Date
}