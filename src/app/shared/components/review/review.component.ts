import { Component, Input, OnInit } from '@angular/core'
import { ReadReview } from '../../model/reviews/read-review.interface'

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  standalone: false,
})
export class ReviewComponent  implements OnInit {
  @Input() review!: ReadReview

  constructor() { }

  ngOnInit() {}

}
