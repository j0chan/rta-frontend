import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/shared/services/auth.service'

@Component({
  selector: 'app-loggined',
  templateUrl: './loggined.component.html',
  standalone: false,
})
export class LogginedComponent  implements OnInit {
  isLoggined: Boolean = false
  userName: string | null = null

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadLogginedUserName()
  }

  loadLogginedUserName() {
    this.userName = this.authService.getLogginedUserName()
    if (this.userName) { 
      this.isLoggined = true
    }
    console.log('username: ', this.userName)
  }

  async signOut() {
    this.authService.signOut()
    await this.router.navigate(['/'])
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
