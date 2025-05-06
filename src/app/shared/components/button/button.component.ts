import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent  implements OnInit {
  // 버튼에 보이는 이름
  @Input() label = "Label"
  // 버튼 색상
  /**
   * filled : (기본) 파란 배경 버튼
   * tinted : 하늘색 배경 + 파란 글씨 버튼
   * tinted-bordered : 하늘색 배경, 파란 테두리 + 파란 글씨 버튼
   * tinted-gray : 회색 배경, 회색 테두리 + 회색 글씨 버튼
   * bordered-gray : 회색 테두리 버튼
   * borderless : 배경없는 회색 비주류 버튼
   * disabled : 회색 배경 + 회색 글씨 버튼
   */
  @Input() variant: 'filled' | 'tinted' | 'tinted-bordered' | 'tinted-gray' | 'bordered-gray' | 'borderless' = 'filled'
  // 버튼 및 텍스트 크기
  /**
   * full : 좌우 여백을 다 채우는 버튼 (16px)
   * fit : 텍스트 사이즈에 맞게 (16px)
   * fit-small : 텍스트 사이즈에 맞게, 작은 버튼 (12px)
   * small : 작은 버튼 (12px)
   * symbol : 심볼이 포함된 버튼 (14px)
   */
  @Input() size: 'full' | 'fit' | 'fit-small' | 'small' | 'symbol' = 'full'
  @Input() disabled = false

  constructor() { }

  ngOnInit() {}
}

/** sample
 * <app-button variant="filled" size="full"></app-button>
  <app-button variant="tinted" size="full"></app-button>
  <app-button variant="tinted-bordered" size="fit"></app-button>
  <app-button variant="bordered-gray" size="fit"></app-button>
  <app-button variant="borderless" size="small"></app-button>
  <app-button size="full" [disabled]="true"></app-button>
 */

