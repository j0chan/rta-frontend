import { UserRole } from "../users/user-role.enum"

export interface CreateUser {
    email: string
    password: string
    nickname: string
    phone_number: string
    role: UserRole
}