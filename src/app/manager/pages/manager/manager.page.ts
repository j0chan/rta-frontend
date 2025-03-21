import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  standalone: false,
})
export class ManagerPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  goMyManagerRequestsPage() {
    console.log('go my manager requests page')
    this.router.navigate(['my-manager-requests'], { relativeTo: this.route })
  }

  goMyStoresPage() {
    console.log('go my stores page')
    this.router.navigate(['my-stores'], { relativeTo: this.route })
  }
}
