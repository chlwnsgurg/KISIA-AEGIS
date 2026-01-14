import { apiClient } from './api';

// 간단한 JWT 토큰 생성 (실제로는 jsonwebtoken 라이브러리 사용)
export function generateToken(userId: number): string {
  const payload = {
    userId,
    exp: Date.now() + 3600000, // 1시간 후 만료
  };
  // Base64 인코딩으로 간단한 토큰 생성
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 토큰 검증
export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // 만료 시간 확인
    if (payload.exp < Date.now()) {
      return null;
    }
    
    // 외부 API를 통해 사용자 존재 확인
    try {
      await apiClient.getMe();
      return { userId: payload.userId };
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// refresh token 생성 (더 긴 만료 시간)
export function generateRefreshToken(userId: number): string {
  const payload = {
    userId,
    exp: Date.now() + 30 * 24 * 3600000, // 30일 후 만료
    type: 'refresh',
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// 쿠키에서 토큰 확인
export function isAuthenticated(): boolean {
  return apiClient.isAuthenticated();
}

// 로그아웃
export function logout(): void {
  apiClient.logout();
}