// 외부 API 서버 연결
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

console.log('API_BASE_URL:', API_BASE_URL);

interface ApiResponse<T> {
  success?: boolean;
  description?: string;
  data?: T;
  detail?: string;
  message?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  time_created: string;
}

interface ImageUploadResponse {
  id: number;
  user_id: number;
  time_created: string;
}

interface ValidateResponse {
  message: string;
  input_data: string;
  '64bit': number;
  output_sr_h_data: string;
}

class ApiClient {
  private static instance: ApiClient;
  private accessToken: string | null = null;

  private constructor() {
    // 브라우저 환경에서만 쿠키에서 토큰 읽기
    if (typeof window !== 'undefined') {
      this.accessToken = this.getCookie('access_token');
    }
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // 쿠키 설정
  private setCookie(name: string, value: string, days: number = 7) {
    if (typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }
  }

  // 쿠키 읽기
  private getCookie(name: string): string | null {
    if (typeof window !== 'undefined') {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // 쿠키 삭제
  private deleteCookie(name: string) {
    if (typeof window !== 'undefined') {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    console.log('Setting access token:', token);
    // 쿠키에 토큰 저장 (7일간 유지)
    this.setCookie('access_token', token, 7);
  }

  setRefreshToken(token: string) {
    console.log('Setting refresh token:', token);
    // 쿠키에 리프레시 토큰 저장 (30일간 유지)
    this.setCookie('refresh_token', token, 30);
  }

  clearTokens() {
    this.accessToken = null;
    // 쿠키에서 토큰 삭제
    this.deleteCookie('access_token');
    this.deleteCookie('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['access-token'] = this.accessToken;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers,
      body: options.body
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  }

  // 회원가입
  async signup(name: string, email: string, password: string): Promise<ApiResponse<string>> {
    return this.request<ApiResponse<string>>('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
  }

  // 로그인
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<ApiResponse<LoginResponse[]>>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // 응답 형식에 따라 토큰 설정
    if (response.data && response.data[0]) {
      const { access_token, refresh_token } = response.data[0];
      this.setAccessToken(access_token);
      this.setRefreshToken(refresh_token);
      return response.data[0];
    }

    throw new Error('로그인 응답 형식 오류');
  }

  // 내 정보 조회
  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>('/users/me', {
      method: 'GET',
    });
  }

  // 이미지 업로드
  async uploadImage(copyright: string, file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    // 쿼리 파라미터로 전달
    const query = copyright ? `?copyright=${encodeURIComponent(copyright)}` : '';
    return this.request<ImageUploadResponse>(`/upload${query}`, {
      method: 'POST',
      body: formData,
    });
  }

  // 이미지 검증
  async validateImage(file: File): Promise<ValidateResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<ValidateResponse>('/validate', {
      method: 'POST',
      body: formData,
    });
  }

  // 사용자 이미지 목록 조회
  async getUserImages(): Promise<ImageUploadResponse[]> {
    return this.request<ImageUploadResponse[]>('/images', {
      method: 'GET',
    });
  }

  // 로그아웃
  logout() {
    this.clearTokens();
  }

  // 토큰 확인
  isAuthenticated(): boolean {
    // 쿠키에서 토큰을 다시 읽어와서 확인
    const cookieToken = this.getCookie('access_token');
    const hasToken = !!(this.accessToken || cookieToken);
    
    // 토큰이 쿠키에 있지만 메모리에 없으면 메모리에 저장
    if (cookieToken && !this.accessToken) {
      this.accessToken = cookieToken;
    }
    
    console.log('isAuthenticated check:', { 
      accessToken: this.accessToken ? 'exists' : 'null',
      cookieToken: cookieToken ? 'exists' : 'null',
      hasToken 
    });
    return hasToken;
  }

  // 토큰 갱신
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getCookie('refresh_token');
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          this.setAccessToken(data.access_token);
          return true;
        }
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
    }

    return false;
  }
}

export const apiClient = ApiClient.getInstance();
export type { LoginResponse, UserResponse, ImageUploadResponse, ValidateResponse };