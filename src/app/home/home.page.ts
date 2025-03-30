import { ImagesService } from './../shared/services/images.service';
import { Component, OnInit } from '@angular/core'
import { AuthService } from '../shared/services/auth.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // 로그인 상태 관찰
  isLoggedIn$ = this.authService.isLoggedIn$

  Pika!: string

  constructor(
    private authService: AuthService,
    private router: Router,
    private imagesService: ImagesService
  ) { }

  async signOut() {
    this.authService.signOut()
    await this.router.navigate(['/signin'])
  }

  ngOnInit() {
    this.imagesService.getImage('pika.jpg').subscribe((response) => {
      if (response && response.url) {
        this.Pika = response.url
      }
    })
  }
}
