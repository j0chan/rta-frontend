import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UsersService } from './../../../shared/services/users.service'
import { ReadUser } from 'src/app/shared/model/users/read-user.interface'
import { AuthService } from 'src/app/shared/services/auth.service'

@Component({
  selector: 'app-edit-my-info',
  templateUrl: './edit-my-info.component.html',
  styleUrls: ['./edit-my-info.component.scss'],
  standalone: false
})
export class EditMyInfoComponent implements OnInit {
  user?: ReadUser
  new_nickname: string = ''
  selectedFile?: File
  original_nickname: string = ''
  original_image?: string // 기존 이미지 URL (이미지가 있을 경우)
  previewUrls: string[] = []

  // 버튼 활성화 여부
  isButtonDisabled: boolean = true

  constructor(
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    const nav = this.router.getCurrentNavigation()
    this.user = nav?.extras.state?.['user']
  }

  ngOnInit(): void {
    if (this.user) {
      this.new_nickname = this.user.nickname
      this.original_nickname = this.user.nickname
      this.original_image = this.user.profile_image.url // 사용자 정보에 프로필 이미지 URL이 있다면 저장
    }
  }

  async onSubmit() {
    if (this.isButtonDisabled) return

    const formData = new FormData()
    formData.append('nickname', this.new_nickname)

    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile, this.selectedFile.name)
    }

    this.usersService.updateUserById(formData).subscribe({
      next: () => {
        console.log('User Info Updated Successfully')
        window.alert('변경이 완료되었습니다. 다시 로그인해주세요.')
        this.authService.signOut()
        this.router.navigate(['/signin'])
      },
      error: (err) => {
        window.alert('변경 실패.')
        console.log('Failed to Update User Info', err)
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]

      // 단일 파일만 미리보기 (다중 파일의 경우 반복문 처리)
      const reader = new FileReader()
      reader.onload = () => {
        this.previewUrls = [reader.result as string]  // 배열에 저장
      }
      reader.readAsDataURL(this.selectedFile)
    }

    this.checkIfButtonShouldBeEnabled()
  }

  onNicknameChange() {
    // 닉네임이 변경되었을 때 버튼 활성화
    this.checkIfButtonShouldBeEnabled()
  }

  checkIfButtonShouldBeEnabled() {
    if (
      (this.new_nickname !== this.original_nickname) || // 닉네임이 변경되었을 때
      (this.selectedFile) // 이미지가 선택되었을 때
    ) {
      this.isButtonDisabled = false
    } else {
      this.isButtonDisabled = true
    }
  }
}
