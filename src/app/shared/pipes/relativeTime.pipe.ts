import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'relativeTime',
    pure: true,
    standalone: false
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: Date | string): string {
        const actualDate = new Date(value)

        if (isNaN(actualDate.getTime())) return '유효하지 않은 날짜'

        const now = new Date()
        const diff = Math.floor((now.getTime() - actualDate.getTime()) / 1000)

        if (diff < 60) return `방금 전`
        if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
        if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
        if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`
        return `${Math.floor(diff / 2592000)}개월 전`
    }
}
