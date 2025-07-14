export const getAuthConfig = () => {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // URLs base
  const prodUrl = 'https://astral-connection-portal.vercel.app';
  const devUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  
  const baseUrl = isLocalhost || isDevelopment ? devUrl : prodUrl;
  
  return {
    redirectUrl: `${baseUrl}/auth/callback`,
    siteUrl: baseUrl,
    isProduction: !isLocalhost && !isDevelopment,
    isLocalhost,
    isDevelopment
  };
};

export const logAuthDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH] ${message}`, data);
  }
}; 