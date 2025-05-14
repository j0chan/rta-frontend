import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})
export class InputComponent  implements OnInit {
  // 입력이 아무것도 없을 때 보이는 안내 메세지
  @Input() placeholder: string = ''
  // 입력받는 값
  @Input() value: string = ''
  @Output() valueChange = new EventEmitter<string>()

  // 검색창 여부
  @Input() isSearch: Boolean = false
  
  // 텍스트 영역 크기
  /**
   * one-line : 한 줄짜리 입력창
   * box : 여러 줄짜리 입력창
   */
  @Input() area: 'one-line' | 'box' = 'one-line'
  @Input() type: string = 'text'

  constructor() { }

  ngOnInit() {}

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.valueChange.emit(this.value);
  }
}
