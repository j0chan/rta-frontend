import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ReadUser } from 'src/app/shared/model/users/read-user.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss'],
  standalone: false,
})
export class MyInfoComponent implements OnInit {
  user?: ReadUser

  constructor(
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.myPageService.getMyInfo().subscribe({
      next: response => {
        if (response.success) {
          this.user = response.data ?? undefined
        } else {
          console.error(response.message)
        }
      },
      error: err => {
        console.error('Error fetching reviews: ', err)
      },
      complete: () => {
        console.error('Fetching reviews request completed')
      }
    })
  }

}
