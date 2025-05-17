import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: "stripHtml",
    pure: true,
    standalone: false,
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/<[^>]*>/g, '')
  }
}