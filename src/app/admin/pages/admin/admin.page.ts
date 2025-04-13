import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  standalone: false,
})
export class AdminPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  goManagerRequestsPage() {
    console.log('go manager request page')
    this.router.navigate(['manager-request-page'], { relativeTo: this.route })
  }
}
