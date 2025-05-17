import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/shared/services/auth.service'

@Component({
  selector: 'app-loggined',
  templateUrl: './loggined.component.html',
  styleUrls: ['./loggined.component.scss'],
  standalone: false,
})
export class LogginedComponent implements OnInit {
  isLoggined: Boolean = false
  userName: string | null = null
  userProfileImage: string | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    // 로그인 상태 구독
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggined = loggedIn;
      if (loggedIn) {
        this.loadLogginedUserInfo(); // 로그인 정보 로드
      } else {
        this.clearUserInfo(); // 로그아웃 시 사용자 정보 초기화
      }
    })
  }

  clearUserInfo() {
    this.userName = null
    this.userProfileImage = null
  }

  loadLogginedUserInfo() {
    this.userName = this.authService.getLogginedUserName()
    this.userProfileImage = this.authService.getUserProfileImage()
    if (this.userName) {
      this.isLoggined = true
    }
    console.log('username: ', this.userName)
  }

  /* 페이지 이동 */
  goSignInPage() {
    console.log('go sign in page')
    this.router.navigate(['/signin'])
  }

  goMyPage() {
    console.log('go my page')
    this.router.navigate(['/my-page'])
  }
}
