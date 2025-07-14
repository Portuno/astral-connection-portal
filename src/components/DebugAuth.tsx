import { useAuth } from './AuthProvider';

export const DebugAuth = () => {
  const auth = useAuth();
  
  const handleTestGoogle = () => {
    console.log('[DebugAuth] Testing Google sign in...');
    console.log('[DebugAuth] Auth object:', auth);
    console.log('[DebugAuth] signInWithGoogle type:', typeof auth.signInWithGoogle);
    
    if (typeof auth.signInWithGoogle === 'function') {
      console.log('[DebugAuth] signInWithGoogle is a function, calling it...');
      auth.signInWithGoogle().catch(error => {
        console.error('[DebugAuth] Error calling signInWithGoogle:', error);
      });
    } else {
      console.error('[DebugAuth] signInWithGoogle is not a function!');
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999 
    }}>
      <div>Auth Debug</div>
      <div>User: {auth.user ? 'Logged in' : 'Not logged in'}</div>
      <div>Loading: {auth.loading ? 'Yes' : 'No'}</div>
      <div>signInWithGoogle: {typeof auth.signInWithGoogle}</div>
      <button 
        onClick={handleTestGoogle}
        style={{ 
          background: '#4285f4', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px', 
          borderRadius: '3px',
          fontSize: '11px',
          marginTop: '5px'
        }}
      >
        Test Google Auth
      </button>
    </div>
  );
}; 