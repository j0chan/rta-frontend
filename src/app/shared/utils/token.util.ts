export function getUserIdFromToken(): number | null {
    const token = localStorage.getItem('accessToken')
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1])) // JWT payload 추출
        return payload.user_id
    } catch (err) {
        console.error('토큰 디코딩 실패:', err)
        return null
    }
}