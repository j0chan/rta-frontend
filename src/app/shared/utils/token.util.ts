export function getUserIdFromToken(): number | null {
    const token = localStorage.getItem('accessToken')
    if (!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1])) // JWT payload 추출
        return payload.user_id
    } catch (err) {
        console.error('토큰 디코딩 실패: ', err)
        return null
    }
}

export function getRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken')
    if(!token) return null

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.role
    } catch(err) {
        console.error('토큰 디코딩 실패: ', err)
        return null
    }
}

// 토큰 파싱 유틸 함수
export function parseJwt(token: string): any | null {
    try {
        const payloadBase64 = token.split('.')[1];
        // '+'를 '-'로, '/'를 '_'로 변환하여 Base64 디코딩
        const base64Url = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(base64Url); // Base64 디코딩
        return JSON.parse(decodedPayload); // JSON으로 변환하여 리턴
    } catch (e) {
        console.error('Invalid token:', e);
        return null;
    }
}