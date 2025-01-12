import axios from 'axios';

export const useAuthToken = () => {
  const refreshAuthToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { access } = response.data;
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
