import { Pipe, PipeTransform } from '@angular/core'
import { UserRole } from '../model/users/user-role.enum'

@Pipe({
    name: 'userRolePipe',
    pure: true,
    standalone: false
})
export class UserRolePipe implements PipeTransform {
    private statusMap: { [key in UserRole]: string } = {
        [UserRole.USER]: "사용자",
        [UserRole.MANAGER]: "매니저",
        [UserRole.ADMIN]: "어드민",
    }

    transform(userRole: UserRole | undefined): string {
        if (!userRole) return '알 수 없음'
        return this.statusMap[userRole]
    }
}
