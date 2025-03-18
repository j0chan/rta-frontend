import { Component, OnInit } from '@angular/core';
import { CreateUser } from '../shared/model/auth/create-user.interface';
import { UserRole } from '../shared/model/users/user-role.enum';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: false,
})
export class RegisterPage {
  form: CreateUser = {
    email: '',
    password: '',
    nickname: '',
    phone_number: '',
    role: UserRole.USER
  }

  constructor(private authService: AuthService) { }

  onSubmit() {
    if(!this.form.email || !this.form.password || !this.form.nickname || !this.form.phone_number) {
      alert('모든 정보를 입력하세요!')
      return
    }

    this.authService.createUser(this.form).subscribe({
      next: (response) => {
        console.log(response)
        alert('회원가입 완료')
      },
      error: (err) => {
        console.error('회원가입 오류: ', err)
        alert('회원가입 실패')
      }
    })
  }
}
