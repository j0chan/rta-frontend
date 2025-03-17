import { UserRole } from "./user-role.enum"

export interface ReadUser {
    user_id: number
    email: string
    nickname: string
    phone_number: string
    role: UserRole
    created_at: Date
}