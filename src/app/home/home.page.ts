import { Component } from '@angular/core'
import { AuthService } from '../shared/services/auth.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  // 로그인 상태 관찰
  isLoggedIn$ = this.authService.isLoggedIn$

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  async signOut() {
    this.authService.signOut()
    await this.router.navigate(['/signin'])
  }
}
