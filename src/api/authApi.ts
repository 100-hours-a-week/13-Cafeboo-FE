const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const requestKakaoLogin = async () => {
    const Rest_api_key='2907e2b3aedc68d90405573c5ff85da4'; 
    const redirect_uri = `${apiBaseUrl}oauth/kakao/callback`;
    const redirectUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&scope=profile_nickname,profile_image`;
    window.location.href = redirectUrl;
};
