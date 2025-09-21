import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['header-bar.component.scss'],
  standalone: false,
})
export class HeaderBarComponent  implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {}

  /* 페이지 이동 */
  goMainPage() {
    console.log('go main page')
    this.router.navigate(['/main'])
  }
}
