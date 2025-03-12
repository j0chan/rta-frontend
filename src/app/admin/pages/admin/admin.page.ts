import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  goStoreRequestsPage() {
    this.router.navigate(['store-request-page'], { relativeTo: this.route })
  }

  goManagerRequestsPage() {
    this.router.navigate(['manager-request-page'], { relativeTo: this.route })
  }
}
