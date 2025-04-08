export const useAuthToken = () => {
  const refreshAuthToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken })
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const { access } = await response.json();

      sessionStorage.setItem('accessToken', access);
      return access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      sessionStorage.clear();
      return null;
    }
  };

  return { refreshAuthToken };
};
