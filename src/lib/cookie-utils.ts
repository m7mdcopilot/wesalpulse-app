/**
 * Cookie utility functions for authentication
 */

/**
 * Clear all authentication-related cookies from client-side
 */
export function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;
  
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  // Clear each cookie
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    
    // Clear auth-related cookies
    if (name && (
      name.includes('auth') || 
      name.includes('token') || 
      name.includes('session') ||
      name.toLowerCase().includes('auth')
    )) {
      // Clear cookie with multiple path combinations
      const domains = ['', window.location.hostname];
      const paths = ['/', '/api', ''];
      
      domains.forEach(domain => {
        paths.forEach(path => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''} secure; samesite=strict;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''} samesite=strict;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''};`;
        });
      });
    }
  });
}

/**
 * Clear all authentication-related localStorage items
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Clear specific auth-related items
  const authKeys = [
    'userToken',
    'authToken',
    'authData',
    'userData',
    'sessionData',
    'token'
  ];
  
  authKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  
  // Also clear any items that contain 'auth' or 'token' in their name
  Object.keys(localStorage).forEach(key => {
    if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
      localStorage.removeItem(key);
    }
  });
  
  Object.keys(sessionStorage).forEach(key => {
    if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
      sessionStorage.removeItem(key);
    }
  });
}

/**
 * Complete logout cleanup - clears cookies, storage, and redirects
 */
export function performLogoutCleanup(): void {
  clearAuthCookies();
  clearAuthStorage();
}