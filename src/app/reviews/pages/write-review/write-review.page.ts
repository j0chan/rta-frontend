import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.page.html',
  standalone: false,
})
export class WriteReviewPage  implements OnInit {
  reviewText: string = ''

  constructor() { }

  ngOnInit() {}

  submit() {
    console.log('입력한 리뷰: ', this.reviewText)
  }
  
}
