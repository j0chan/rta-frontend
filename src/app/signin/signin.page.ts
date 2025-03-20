import { Component } from '@angular/core'
import { SignInDTO } from '../shared/model/auth/singin.interface'
import { AuthService } from '../shared/services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  standalone: false
})
export class SigninPage {
  homePageUrl = 'http://localhost:8100/'

  form: SignInDTO = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    this.authService.signIn(this.form).subscribe({
      // 로그인 성공 시 home으로 이동
      next: (response) => {
        console.log(response)
        alert('로그인 성공')
        this.router.navigate(['/home'])
      },
      error: (err) => {
        console.error('로그인 오류', err)
        alert('로그인 실패')
      }
    })
  }
}
