// Mock credentials
const MOCK_ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const MOCK_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'password';

export const authService = {
  login: (username: string, pass: string): boolean => {
    if (username === MOCK_ADMIN_USER && pass === MOCK_ADMIN_PASS) {
      localStorage.setItem('replygenie_auth', 'true');
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem('replygenie_auth');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem('replygenie_auth') === 'true';
  }
};