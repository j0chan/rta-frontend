import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { ReadReply } from 'src/app/model/replies/read-reply.interface'
import { ReadReview } from 'src/app/model/reviews/read-review.interface'

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  standalone: false,
})
export class ReviewComponent implements OnInit, OnChanges {
  @Input() review!: ReadReview
  reply?: ReadReply

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['review']?.currentValue) {
      this.reply = this.review?.reply
    }
  }

  private getRelativeTime(date: Date | string): string {
    const actualDate = new Date(date) // Date 객체로 변환

    // 날짜가 유효하지 않으면 '유효하지 않은 날짜' 반환
    if (isNaN(actualDate.getTime())) return '유효하지 않은 날짜'

    const now = new Date()
    const diff = Math.floor((now.getTime() - actualDate.getTime()) / 1000) // 초 단위 차이 계산

    if (diff < 60) return `방금 전`
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    if (diff < 2592000) return `${Math.floor(diff / 86400)}일 전`
    return `${Math.floor(diff / 2592000)}개월 전`
  }

  get relativeReviewDate(): string {
    return this.review?.date ? this.getRelativeTime(this.review.date) : ''
  }

  get relativeReplyDate(): string {
    return this.reply?.date ? this.getRelativeTime(this.reply.date) : ''
  }
}
