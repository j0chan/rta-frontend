import { Component, OnInit } from '@angular/core'
import { CreateUserDTO } from '../shared/model/auth/create-user.interface'
import { UserRole } from '../shared/model/users/user-role.enum'
import { AuthService } from '../shared/services/auth.service'
import { UsersService } from '../shared/services/users.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  // 로그인 상태면 (token 보유 시) 자동으로 home으로 이동
  ngOnInit() {
    const token = localStorage.getItem('accessToken')
    if (token) {
      this.router.navigate(['/home'])
    }
  }

  form: CreateUserDTO = {
    email: '',
    password: '',
    nickname: '',
    phone_number: '',
    role: UserRole.USER
  }

  isEmailChecked = false // 중복 검사 완료 여부, true일 때 입력 필드 비활성화.
  isEmailUsable = false // 이메일 사용 가능 여부 (중복 없을 시 true)

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) { }

  // 이메일 변경 시 중복 검사 상태 초기화
  onEmailChange() {
    this.isEmailChecked = false
    this.isEmailUsable = false
  }

  // 중복 검사 버튼 클릭 시
  duplicateCheck() {
    // 이메일 미기입
    if (!this.form.email) {
      alert('이메일을 입력하세요.')
      return
    }

    this.usersService.readEmailExists(this.form.email).subscribe({
      next: (response) => {
        this.isEmailChecked = true
        this.isEmailUsable = !response.data

        if (this.isEmailUsable) {
          alert('사용 가능한 이메일입니다.')
        } else {
          alert('이미 존재하는 이메일입니다.')
          this.isEmailChecked = false // 입력 필드 재활성화
        }
      },
      error: (err) => {
        console.error('이메일 중복 검사 오류:', err)
        alert('중복 검사 중 오류가 발생했습니다.')
        this.isEmailChecked = false // 입력 필드 재활성화
      }
    })
  }

  // 회원가입 폼 제출 버튼 클릭 시
  onSubmit() {
    if (!this.form.email || !this.form.password || !this.form.nickname || !this.form.phone_number) {
      alert('모든 정보를 입력하세요!')
      return
    }

    if (!this.isEmailChecked) {
      alert('이메일 중복 검사를 진행해주세요.')
      return
    }

    if (!this.isEmailUsable) {
      alert('이미 사용 중인 이메일입니다.')
      return
    }

    this.authService.createUser(this.form).subscribe({
      next: (response) => {
        console.log(response)
        alert('회원가입 완료')
        this.router.navigate(['/signin'])
      },
      error: (err) => {
        console.error('회원가입 오류: ', err)
        alert('회원가입 실패')
      }
    })
  }
}
