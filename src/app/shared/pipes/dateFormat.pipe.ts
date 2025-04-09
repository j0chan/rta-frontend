import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'dateFormatPipe',
    pure: true,
    standalone: false,
})
export class DateFormatPipe implements PipeTransform {
    transform(value: Date | string | null): string {
        if (!value) return ''

        const date = new Date(value)
        if (isNaN(date.getTime())) return '유효하지 않은 날짜'

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')

        return `${year}년 ${month}월 ${day}일`
    }
}