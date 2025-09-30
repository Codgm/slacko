// src/context/UserContext.js
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authAPI from '../api/AuthAPI'; 

const UserContext = createContext();

const UserProvider = ({ children }) => {
  // 사용자 상태
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresIn: null,
    expiresAt: null
  });

  // 토큰 저장 헬퍼
  const saveTokens = useCallback((tokenData) => {
    const expiresAt = Date.now() + (tokenData.expiresIn || 86400000); // 기본 24시간
    const newTokens = {
      ...tokenData,
      expiresAt
    };
    
    setTokens(newTokens);
    localStorage.setItem('slacko_tokens', JSON.stringify(newTokens));
    return newTokens;
  }, []);

  // 인증 정보 초기화
  const clearAuth = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setTokens({
      accessToken: null,
      refreshToken: null,
      tokenType: 'Bearer',
      expiresIn: null,
      expiresAt: null
    });
    localStorage.removeItem('slacko_tokens');
  }, []);

  // 5. 토큰 갱신
  const refreshAccessToken = useCallback(async (refreshToken) => {
    try {
      const tokenToUse = refreshToken || tokens.refreshToken;
      if (!tokenToUse) {
        throw new Error('Refresh token not available');
      }

      const data = await authAPI.refreshToken(tokenToUse);
      
      // 새 토큰 저장
      const newTokens = saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType || 'Bearer',
        expiresIn: data.expiresIn
      });
      
      setUser(data.userInfo);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuth();
      return false;
    }
  }, [tokens.refreshToken, saveTokens, clearAuth]);

  // 3. 현재 사용자 정보 조회
  const fetchCurrentUser = useCallback(async (accessToken) => {
    try {
      const tokenToUse = accessToken || tokens.accessToken;
      if (!tokenToUse) {
        throw new Error('Access token not available');
      }

      const userData = await authAPI.getCurrentUser(tokenToUse);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      
      // 인증 에러인 경우 로그아웃 처리
      if (authAPI.isAuthError(error)) {
        clearAuth();
      }
      
      throw new Error('사용자 정보를 가져올 수 없습니다');
    }
  }, [tokens.accessToken, clearAuth]);

  // 앱 초기화 시 인증 상태 복원
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedTokens = localStorage.getItem('slacko_tokens');
        if (!savedTokens) {
          setIsLoading(false);
          return;
        }

        const parsedTokens = JSON.parse(savedTokens);
        
        // 토큰 만료 확인
        if (authAPI.isTokenExpired(parsedTokens.expiresAt)) {
          // 리프레시 토큰으로 갱신 시도
          if (parsedTokens.refreshToken) {
            await refreshAccessToken(parsedTokens.refreshToken);
          } else {
            clearAuth();
          }
        } else {
          // 토큰이 유효하면 사용자 정보 가져오기
          setTokens(parsedTokens);
          await fetchCurrentUser(parsedTokens.accessToken);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchCurrentUser, refreshAccessToken, clearAuth]);

  // 1. Google 로그인 - 수정됨
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('Requesting Google auth URL...');
      
      const authData = await authAPI.getGoogleAuthUrl();
      console.log('Received auth data:', authData);
      
      // 백엔드 응답 구조에 따라 URL 처리
      let authUrl;
      
      if (typeof authData === 'string') {
        // 응답이 문자열인 경우 (직접 URL)
        authUrl = authData;
      } else if (authData.authUrl) {
        // 응답이 객체이고 authUrl 속성이 있는 경우
        authUrl = authData.authUrl;
      } else if (authData.url) {
        // url 속성이 있는 경우
        authUrl = authData.url;
      } else {
        // 기본적으로 전체 응답을 URL로 처리
        authUrl = authData;
      }

      console.log('Final auth URL:', authUrl);

      // URL이 이미 완전한 URL인지 확인
      if (authUrl.startsWith('http://') || authUrl.startsWith('https://')) {
        window.location.href = authUrl;
      } else {
        // 상대 경로인 경우 authAPI의 baseURL과 결합
        window.location.href = `${authAPI.baseURL}${authUrl}`;
      }
      
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
      
      // 더 구체적인 에러 메시지 제공
      if (error.message.includes('Failed to fetch') || error.message.includes('DNS')) {
        throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`Google 로그인을 시작할 수 없습니다: ${error.message}`);
      }
    }
  };

  // 2. 로그인 성공 처리 (OAuth2 콜백 후)
  const handleLoginSuccess = async () => {
    try {
      setIsLoading(true);
      const data = await authAPI.handleLoginSuccess();
      
      // 토큰 저장
      saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType || 'Bearer',
        expiresIn: data.expiresIn
      });
      
      setUser(data.userInfo);
      setIsAuthenticated(true);
      
      return data.userInfo;
    } catch (error) {
      console.error('Login success handling failed:', error);
      clearAuth();
      throw new Error('로그인 처리 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 토큰 유효성 검증
  const validateToken = async (accessToken = tokens.accessToken) => {
    try {
      if (!accessToken) return false;
      
      const result = await authAPI.validateToken(accessToken);
      return result.valid;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  // 6. 프로필 업데이트
  const updateProfile = async (profileData) => {
    try {
      if (!tokens.accessToken) {
        throw new Error('로그인이 필요합니다');
      }

      const updatedUser = await authAPI.updateProfile(profileData, tokens.accessToken);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update failed:', error);
      
      if (authAPI.isAuthError(error)) {
        clearAuth();
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요');
      }
      
      throw new Error('프로필 업데이트에 실패했습니다');
    }
  };

  // 7. 로그아웃
  const logout = async () => {
    try {
      if (tokens.accessToken) {
        await authAPI.logout(tokens.accessToken);
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      clearAuth();
    }
  };

  // 8. 계정 비활성화
  const deactivateAccount = async () => {
    try {
      if (!tokens.accessToken) {
        throw new Error('로그인이 필요합니다');
      }

      await authAPI.deactivateAccount(tokens.accessToken);
      clearAuth();
    } catch (error) {
      console.error('Account deactivation failed:', error);
      
      if (authAPI.isAuthError(error)) {
        clearAuth();
        throw new Error('인증이 만료되었습니다');
      }
      
      throw new Error('계정 비활성화에 실패했습니다');
    }
  };

  // 자동 토큰 갱신 (만료 5분 전)
  useEffect(() => {
    if (!tokens.accessToken || !tokens.expiresAt) return;

    const now = Date.now();
    const expiresAt = tokens.expiresAt;
    const refreshTime = expiresAt - now - (5 * 60 * 1000); // 5분 전

    if (refreshTime <= 0) {
      // 이미 만료되었거나 곧 만료됨
      if (tokens.refreshToken) {
        refreshAccessToken(tokens.refreshToken);
      } else {
        clearAuth();
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      refreshAccessToken(tokens.refreshToken);
    }, refreshTime);

    return () => clearTimeout(timeoutId);
  }, [tokens.accessToken, tokens.expiresAt, tokens.refreshToken, refreshAccessToken, clearAuth]);

  // 인증된 API 요청 헬퍼 (다른 API들을 위한)
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    try {
      if (!tokens.accessToken) {
        throw new Error('인증이 필요합니다');
      }

      // 토큰 만료 확인
      if (authAPI.isTokenExpired(tokens.expiresAt)) {
        const refreshed = await refreshAccessToken(tokens.refreshToken);
        if (!refreshed) {
          throw new Error('인증이 만료되었습니다. 다시 로그인해주세요');
        }
      }

      return await authAPI.request(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `${tokens.tokenType} ${tokens.accessToken}`
        }
      });
    } catch (error) {
      if (authAPI.isAuthError(error)) {
        clearAuth();
        throw new Error('인증이 만료되었습니다. 다시 로그인해주세요');
      }
      throw error;
    }
  }, [tokens.accessToken, tokens.tokenType, tokens.expiresAt, tokens.refreshToken, refreshAccessToken, clearAuth]);

  // Context value
  const contextValue = {
    // 상태
    user,
    isLoading,
    isAuthenticated,
    tokens,
    
    // 인증 관련 함수들
    loginWithGoogle,
    handleLoginSuccess,
    logout,
    refreshAccessToken,
    validateToken,
    deactivateAccount,
    
    // 사용자 관련 함수들
    updateProfile,
    fetchCurrentUser,
    
    // 유틸리티 함수들
    setUser,
    clearAuth,
    apiRequest,
    
    // API 인스턴스 (필요시 직접 접근)
    authAPI
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// useUser 훅 - 전체 기능
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// useAuth 훅 - 인증 관련 기능만
const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  
  const {
    isAuthenticated,
    isLoading,
    tokens,
    loginWithGoogle,
    handleLoginSuccess,
    logout,
    refreshAccessToken,
    validateToken,
    deactivateAccount,
    clearAuth
  } = context;

  return {
    isAuthenticated,
    isLoading,
    tokens,
    loginWithGoogle,
    handleLoginSuccess,
    logout,
    refreshAccessToken,
    validateToken,
    deactivateAccount,
    clearAuth
  };
};

// useProfile 훅 - 프로필 관련 기능만
const useProfile = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useProfile must be used within a UserProvider');
  }
  
  const {
    user,
    updateProfile,
    fetchCurrentUser,
    setUser
  } = context;

  return {
    user,
    updateProfile,
    fetchCurrentUser,
    setUser
  };
};

// useApi 훅 - API 요청 헬퍼
const useApi = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useApi must be used within a UserProvider');
  }
  
  return {
    apiRequest: context.apiRequest,
    authAPI: context.authAPI
  };
};

export { 
  UserProvider, 
  useUser, 
  useAuth, 
  useProfile, 
  useApi, 
  UserContext 
};