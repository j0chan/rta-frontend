import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-my-manager-requests',
  templateUrl: './my-manager-requests.page.html',
  standalone: false,
})
export class MyManagerRequestsPage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  goCreateManagerRequest() {
    console.log('go create manager request page')
    this.router.navigate(['/manager/create-manager-request'])
  }
}
