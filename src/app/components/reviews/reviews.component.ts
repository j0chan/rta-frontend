import { Component, OnInit } from '@angular/core'
import { IonicModule } from '@ionic/angular'

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ReviewsComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
