import { Pipe, PipeTransform } from '@angular/core'
import { Category } from '../model/stores/category.enum'

@Pipe({
    name: 'categoryPipe',
    pure: true,
    standalone: false
})
export class CategoryPipe implements PipeTransform {
    private statusMap: { [key in Category]: string } = {
        [Category.CAFE]: "카페",
        [Category.RESTAURANT]: "식당",
    }

    transform(category: Category): string {
        return this.statusMap[category]
    }
}
