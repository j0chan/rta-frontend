import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ReadUser } from 'src/app/shared/model/users/read-user.interface'
import { AuthService } from 'src/app/shared/services/auth.service'
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
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
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
        console.log('Fetching reviews request completed')
      }
    })
  }

  async signOut() {
    this.authService.signOut()
    await this.router.navigate(['/signin'])
  }

  /* 페이지 이동 */
  goEditMyInfoPage() {
    this.router.navigate([`edit`], {
      relativeTo: this.route,
      state: { user: this.user }
    })
    console.log('go edit-my-info page')
  }
}
