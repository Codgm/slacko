// src/services/authAPI.js
class AuthAPI {
  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    const useMock = process.env.REACT_APP_USE_MOCK === 'true';

    if (isDev && useMock) {
      this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
      console.log('🔧 Mock API 서버 사용:', this.baseURL);
    } else {
      this.baseURL = 'https://a1d862e78d7d.ngrok-free.app/api';
    }
    this.endpoints = {
      oauth2Google: '/auth/oauth2/google',
      loginSuccess: '/auth/login/success',
      me: '/auth/me',
      validate: '/auth/validate',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
      logout: '/auth/logout',
      deleteAccount: '/auth/account'
    };
  }

  // HTTP 요청 헬퍼
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // 204 No Content 응답 처리
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`API Request failed [${endpoint}]:`, error);
      throw error;
    }
  }

  // 인증된 요청 헬퍼
  async authenticatedRequest(endpoint, options = {}, accessToken) {
    return this.request(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  // 1. OAuth2 로그인 URL 가져오기 - 수정됨
  async getGoogleAuthUrl() {
    try {
      const response = await this.request(this.endpoints.oauth2Google);
      console.log('Auth URL response:', response); // 디버깅용
      
      // Mock 서버의 응답 구조에 맞게 수정
      if (response.authUrl) {
        return { authUrl: response.authUrl };
      }
      
      // 기존 구조도 지원
      return response;
    } catch (error) {
      console.error('Google auth URL request failed:', error);
      throw new Error(`Google 인증 URL 요청 실패: ${error.message}`);
    }
  }

  // 2. 로그인 성공 처리
  async handleLoginSuccess() {
    try {
      const response = await fetch(`${this.baseURL}${this.endpoints.loginSuccess}`, {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '로그인 처리 실패');
      }

      return await response.json();
    } catch (error) {
      console.error('Login success handling failed:', error);
      throw new Error(`로그인 성공 처리 실패: ${error.message}`);
    }
  }

  // 3. 현재 사용자 정보 조회
  async getCurrentUser(accessToken) {
    try {
      return await this.authenticatedRequest(this.endpoints.me, {}, accessToken);
    } catch (error) {
      throw new Error(`사용자 정보 조회 실패: ${error.message}`);
    }
  }

  // 4. 토큰 유효성 검증
  async validateToken(accessToken) {
    try {
      const response = await this.authenticatedRequest(
        this.endpoints.validate, 
        { method: 'POST' }, 
        accessToken
      );
      return response;
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  // 5. 토큰 갱신
  async refreshToken(refreshToken) {
    try {
      return await this.authenticatedRequest(
        this.endpoints.refresh,
        { method: 'POST' },
        refreshToken
      );
    } catch (error) {
      throw new Error(`토큰 갱신 실패: ${error.message}`);
    }
  }

  // 6. 프로필 업데이트
  async updateProfile(profileData, accessToken) {
    try {
      // 빈 값 제거 및 데이터 정제
      const cleanData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      );

      return await this.authenticatedRequest(
        this.endpoints.profile,
        {
          method: 'PUT',
          body: JSON.stringify(cleanData)
        },
        accessToken
      );
    } catch (error) {
      throw new Error(`프로필 업데이트 실패: ${error.message}`);
    }
  }

  // 7. 로그아웃
  async logout(accessToken) {
    try {
      return await this.authenticatedRequest(
        this.endpoints.logout,
        { method: 'POST' },
        accessToken
      );
    } catch (error) {
      // 로그아웃은 실패해도 클라이언트에서 처리
      console.warn('Logout request failed:', error);
      return { success: true, message: '로그아웃이 완료되었습니다' };
    }
  }

  // 8. 계정 비활성화
  async deactivateAccount(accessToken) {
    try {
      return await this.authenticatedRequest(
        this.endpoints.deleteAccount,
        { method: 'DELETE' },
        accessToken
      );
    } catch (error) {
      throw new Error(`계정 비활성화 실패: ${error.message}`);
    }
  }

  // 유틸리티: 토큰 만료 시간 확인
  isTokenExpired(expiresAt, buffer = 5 * 60 * 1000) { // 5분 버퍼
    if (!expiresAt) return true;
    return Date.now() > (expiresAt - buffer);
  }

  // 유틸리티: 토큰에서 사용자 ID 추출 (JWT 디코딩)
  getUserIdFromToken(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  // 유틸리티: 에러 타입 확인
  isAuthError(error) {
    return error.message.includes('401') || 
           error.message.includes('Unauthorized') ||
           error.message.includes('Invalid token') ||
           error.message.includes('Token expired');
  }

  // 유틸리티: 네트워크 에러 확인
  isNetworkError(error) {
    return error.message.includes('fetch') ||
           error.message.includes('Network') ||
           error.message.includes('Failed to fetch');
  }
}

// 싱글톤 인스턴스 생성
const authAPI = new AuthAPI();

export default authAPI;

// 개별 함수도 export (필요시 사용)
export const {
  getGoogleAuthUrl,
  handleLoginSuccess,
  getCurrentUser,
  validateToken,
  refreshToken,
  updateProfile,
  logout,
  deactivateAccount
} = authAPI;