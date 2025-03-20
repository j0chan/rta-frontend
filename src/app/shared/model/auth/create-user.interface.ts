import { UserRole } from "../users/user-role.enum"

export interface CreateUserDTO {
    email: string
    password: string
    nickname: string
    phone_number: string
    role: UserRole
}