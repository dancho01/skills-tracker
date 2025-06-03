
export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('accessToken');

  let res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (res.status === 403) {
    const refreshRes = await fetch('/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      localStorage.setItem('accessToken', accessToken);

      res = await fetch(url, {
        ...options,
        headers: {        
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });
      return res;
    } else {
      throw new Error('Session expired. Please log in again.');
    }
  }
  
  return res;
}