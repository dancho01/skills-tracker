import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

const refreshToken = async () => {
  try {
    const res = await fetch('http://localhost:5001/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to refresh token');

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;

  } catch (err) {
    console.error('Refresh error:', err);
    return null;
  }
};

export async function fetchWithAuth(url, options = {}, token) {

  if (!token || isTokenExpired(token)) {
    token = await refreshToken(); // new access token
    console.log(token)
    if (!token) {
      throw new Error('Unable to refresh access token');
    }
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  
  return res;
}