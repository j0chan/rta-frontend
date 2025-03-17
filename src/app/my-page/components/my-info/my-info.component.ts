import { Component, Input, OnInit } from '@angular/core'
import { ReadUser } from 'src/app/shared/model/users/read-user.interface'
import { MyPageService } from 'src/app/shared/services/my-page.service'

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  standalone: false,
})
export class MyInfoComponent implements OnInit {
  // 임시데이터. loggined user 구현되면 교체 예정
  user_id: number = 1
  user?: ReadUser

  constructor(
    private myPageService: MyPageService,
  ) { }

  ngOnInit() {
    this.myPageService.readUserById(this.user_id).subscribe({
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
