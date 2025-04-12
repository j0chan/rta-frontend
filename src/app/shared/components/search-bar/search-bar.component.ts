import { Component, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    standalone: false
})
export class SearchBarComponent {
    searchQuery: string = ''

    @Output() searchEvent = new EventEmitter<string>()
    @Output() clearEvent = new EventEmitter<void>() // X 버튼 클릭 시 알림용

    search() {
        this.searchEvent.emit(this.searchQuery) // 입력된 검색어를 부모 컴포넌트로 전달
    }

    clearSearch() {
        this.searchQuery = ''
        this.clearEvent.emit()
    }
}