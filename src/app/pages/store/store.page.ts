import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-store',
  templateUrl: './store.page.html',
  styleUrls: ['./store.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class StorePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
