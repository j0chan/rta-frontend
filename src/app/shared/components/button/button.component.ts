import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent  implements OnInit {
  // 버튼에 보이는 이름
  @Input() label = "Button"
  // 버튼의 종류(디자인)
  /**
   * primary : 기본 버튼 (예: 리뷰 작성하기)
   * secondary : 하위 페이지 접속과 같은 비주류 버튼 (예: 더보기)
   * small : 기본 버튼의 작은 크기
   * primary-full : 좌우 여백 없이 꽉찬 기본 버튼
   */
  @Input() variant: 'primary' | 'secondary' | 'small' | 'primary-full' = 'secondary'
  @Input() disabled = false

  constructor() { }

  ngOnInit() {}
}
