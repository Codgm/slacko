import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, Target } from 'lucide-react';
import { useAuth } from '../../context/UserContext';

const AuthPages = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithGoogle,
    handleLoginSuccess
  } = useAuth();

  // 이미 인증된 사용자는 대시보드로 리디렉션
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // URL 파라미터에서 로그인 성공/실패 처리 (OAuth2 콜백)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'true') {
      setIsLoading(true);
      handleLoginSuccess()
        .then(() => {
          // 성공 시 URL 파라미터 정리 후 대시보드로 이동
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard');
        })
        .catch(err => {
          setErrors({ general: '로그인 처리 중 오류가 발생했습니다.' });
          console.error('Login success handling failed:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (error) {
      setErrors({ general: '로그인이 취소되었거나 오류가 발생했습니다.' });
      // URL 파라미터 정리
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [handleLoginSuccess, navigate]);

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrors({});
      await loginWithGoogle();
      // Google 로그인 성공 시 자동으로 대시보드로 이동
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Google 로그인 중 오류가 발생했습니다.' });
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    university: '',
    major: '',
    agreeTerms: false,
    agreeMarketing: false
  });

  // 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 에러 클리어
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자리여야 합니다';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = '이름을 입력해주세요';
      }

      if (!formData.university) {
        newErrors.university = '대학교를 입력해주세요';
      }

      if (!formData.major) {
        newErrors.major = '전공을 입력해주세요';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = '이용약관에 동의해주세요';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // 로그인 성공 시 바로 대시보드로 이동
        navigate('/dashboard');
      } else {
        // 회원가입 성공 후 로그인 모드로 전환
        setIsLogin(true);
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
          name: '',
          university: '',
          major: '',
          agreeTerms: false,
          agreeMarketing: false
        }));
      }
    } catch (error) {
      setErrors({ general: '오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 모드 전환 핸들러
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: '',
      name: '',
      university: '',
      major: '',
      agreeTerms: false,
      agreeMarketing: false
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* 왼쪽 브랜딩 섹션 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-6">
              <Target size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">과탑에 오신 것을 환영합니다</h1>
            <p className="text-xl text-blue-100 mb-8">
              3,250명의 대학생이 선택한 스마트 학습 관리 플랫폼
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-5 h-5 bg-green-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">AI 우선순위 추천</div>
                <div className="text-sm text-blue-100">중요한 학습부터 자동 정렬</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-5 h-5 bg-green-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">스마트 진도 관리</div>
                <div className="text-sm text-blue-100">학습 현황 실시간 추적</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-5 h-5 bg-green-300 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold">개인 맞춤 분석</div>
                <div className="text-sm text-blue-100">학습 패턴 기반 코칭</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 장식적 요소 */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/10 rounded-full blur-xl"></div>
      </div>

      {/* 오른쪽 폼 섹션 */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="lg:hidden w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6">
              <Target size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? '로그인' : '회원가입'}
            </h2>
            <p className="text-slate-600">
              {isLogin ? '과탑으로 스마트한 학습을 시작하세요' : '과탑과 함께 학습 혁신을 경험하세요'}
            </p>
          </div>

          {/* 에러 메시지 */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 회원가입 전용 필드 */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    이름
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.name 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      대학교
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.university 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="과탑대학교"
                    />
                    {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      전공
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                        errors.major 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="컴퓨터공학과"
                    />
                    {errors.major && <p className="mt-1 text-sm text-red-600">{errors.major}</p>}
                  </div>
                </div>
              </>
            )}

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 (회원가입만) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* 약관 동의 (회원가입만) */}
            {!isLogin && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div className="text-sm">
                    <span className="text-slate-700">
                      <span className="text-red-500">*</span> 이용약관 및 개인정보처리방침에 동의합니다
                    </span>
                  </div>
                </div>
                {errors.agreeTerms && <p className="text-sm text-red-600">{errors.agreeTerms}</p>}
                
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onChange={handleInputChange}
                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <div className="text-sm text-slate-700">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </div>
                </div>
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isLoading 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  처리 중...
                </>
              ) : (
                <>
                  {isLogin ? '로그인' : '회원가입'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* 모드 전환 */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <button
                onClick={toggleMode}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>

          {/* 소셜 로그인 (로그인 모드만) */}
          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">또는</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button 
                  className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">Google</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-5 h-5 bg-yellow-400 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">Kakao</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPages;