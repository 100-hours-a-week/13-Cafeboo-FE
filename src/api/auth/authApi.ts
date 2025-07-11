const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const requestKakaoLogin = async () => {
    const Rest_api_key = import.meta.env.VITE_REST_API_KEY;
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);

    const redirect_uri = `${apiBaseUrl}oauth/kakao/callback`;
    const isAfterLogout = localStorage.getItem('afterLogout') === 'true';
    const promptParam = isAfterLogout ? '&prompt=login' : '';
    if (isAfterLogout) localStorage.removeItem('afterLogout');
  
    const redirectUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${Rest_api_key}` +
      `&redirect_uri=${encodeURIComponent(redirect_uri)}` +
      `&response_type=code` +
      `&scope=profile_nickname,profile_image` +
      promptParam;
  
    window.location.href = redirectUrl;
  };