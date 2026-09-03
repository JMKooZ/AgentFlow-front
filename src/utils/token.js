const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * JWT payload 가져오기
 */
export const getTokenPayload = (token) => {
    if (!token) {
        return null;
    }

    try {
        const payload = token.split(".")[1];

        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
};

/**
 * Access Token 만료 시간(ms)
 */
export const getTokenExpiration = (token) => {
    const payload = getTokenPayload(token);

    if (!payload || !payload.exp) {
        return null;
    }

    return payload.exp * 1000;
};

/**
 * Access Token 남은 시간(초)
 */
export const getRemainingTokenSeconds = (token) => {
    const expiration = getTokenExpiration(token);

    if (!expiration) {
        return 0;
    }

    return Math.max(0, Math.floor((expiration - Date.now()) / 1000));
};