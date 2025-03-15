import { Component, Input, OnInit } from '@angular/core'
import { ReadUser } from 'src/app/model/users/read-user.interface'
import { UserRole } from 'src/app/model/users/user-role.enum'

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss'],
  standalone: false,
})
export class MyInfoComponent implements OnInit {
  user!: ReadUser

  constructor() { }

  ngOnInit() {
    // 임시데이터. loggined user 구현되면 교체 예정
    this.user = {
      user_id: 1,
      email: 'example@example.com',
      nickname: '재은이',
      phone_number: '010-1234-4567',
      role: UserRole.USER,
      created_at: new Date()
    }
  }

}
