import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/shared/services/auth.service'

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.page.html',
  styleUrls: ['./my-page.page.scss'],

  standalone: false,
})
export class MyPagePage implements OnInit {
  role: string | null = null

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.role = this.authService.getUserRole()
  }

  goToManagerRequestPage() {
    this.router.navigate(['/admin/manager-request-page'])
  }

  goToPromotionListPage() {
    this.router.navigate(['/promotion'])
  }

  goToNoticeListPage() {
    this.router.navigate(['/notice'])
  }

  goToGiftCardCreatePage() {
    this.router.navigate(['/gift-card/create'])
  }
}