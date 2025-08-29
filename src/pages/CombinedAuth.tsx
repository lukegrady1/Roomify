import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, isSupabaseReady } from '../lib/supabase';
import '../styles/CombinedAuth.css';

const CombinedAuth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set initial auth mode based on route
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsSignUp(true);
    } else if (location.pathname === '/login') {
      setIsSignUp(false);
    }
    // /auth defaults to login (false)
  }, [location.pathname]);
  
  // Get redirect URL from query params
  const getRedirectUrl = () => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    // Validate redirect URL to prevent open redirects
    if (redirect && redirect.startsWith('/')) {
      return redirect;
    }
    return '/search';
  };
  
  // Get redirect destination name for display
  const getRedirectDestination = () => {
    const redirectUrl = getRedirectUrl();
    switch (redirectUrl) {
      case '/list-your-place':
        return 'List Your Space';
      case '/messages':
        return 'Messages';
      case '/profile':
        return 'Profile';
      default:
        return 'continue browsing';
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // In development mode without Supabase, just redirect
    if (!isSupabaseReady()) {
      console.warn('Supabase not configured, using mock auth');
      setSuccess('✅ Mock authentication successful!');
      setTimeout(() => navigate(getRedirectUrl()), 1000);
      setIsLoading(false);
      return;
    }

    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!firstName.trim() || !lastName.trim()) {
          setError('First and last name are required for sign up.');
          setIsLoading(false);
          return;
        }
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `${firstName} ${lastName}`,
              first_name: firstName,
              last_name: lastName
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user && !data.session) {
          setSuccess('✅ Please check your email for a confirmation link.');
        } else {
          setSuccess('✅ Account created successfully!');
          setTimeout(() => navigate(getRedirectUrl()), 1000);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setSuccess('✅ Welcome back!');
        setTimeout(() => navigate(getRedirectUrl()), 1000);
      }
    } catch (err: any) {
      // Provide more user-friendly error messages
      const errorMessage = err.message;
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSupabaseReady()) {
      console.warn('Supabase not configured, using mock auth');
      setSuccess('✅ Mock Google authentication successful!');
      setTimeout(() => navigate(getRedirectUrl()), 1000);
      return;
    }

    try {
      const redirectUrl = getRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`
        }
      });
      
      if (error) throw error;
      // OAuth redirect will handle navigation
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email first, then click "Forgot password?"');
      return;
    }
    
    if (isSupabaseReady()) {
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?mode=reset`
        });
        setSuccess('✅ Password reset email sent! Check your inbox.');
        setError('');
      } catch (err: any) {
        setError('Failed to send reset email. Please try again.');
      }
    } else {
      setSuccess('✅ In development mode: Password reset email would be sent.');
    }
  };

  return (
    <div className="auth-container">
      <div className="background-decor"></div>
      <div className="background-decor-secondary"></div>

      <div className="auth-card">
        <div className="auth-header">
          <h1>{isSignUp ? 'Sign Up for Roomify' : 'Log in to Roomify'}</h1>
          <p>{isSignUp ? 'Create your account to get started.' : 'Welcome back! Please log in.'}</p>
          
          {getRedirectUrl() !== '/search' && (
            <div className="redirect-notice">
              <span>After authentication, you'll be redirected to <strong>{getRedirectDestination()}</strong></span>
            </div>
          )}
        </div>
        
        {!isSupabaseReady() && (
          <div className="info-message">
            <strong>Development Mode:</strong> Supabase authentication not configured. 
            Any credentials will work for testing.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="auth-form" onSubmit={handleAuth}>
          {isSignUp && (
            <div className="name-fields">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {isSignUp && password.length > 0 && password.length < 6 && (
              <small className="password-hint">Password must be at least 6 characters</small>
            )}
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        {!isSignUp && (
          <p className="forgot-password">
            <span onClick={handleForgotPassword}>
              Forgot password?
            </span>
          </p>
        )}

        <div className="separator">or</div>
        
        <div className="social-login">
          <button 
            className="social-button google" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            type="button"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
            />
            Continue with Google
          </button>
          
          <div className="disabled-providers">
            <button className="social-button apple" disabled>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
              />
              Continue with Apple (Coming Soon)
            </button>
            <button className="social-button facebook" disabled>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/512px-Facebook_f_logo_%282019%29.svg.png"
                alt="Facebook"
              />
              Continue with Facebook (Coming Soon)
            </button>
          </div>
        </div>
        
        <div className="auth-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={toggleAuthMode}>
              {isSignUp ? 'Log in here' : 'Sign up here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CombinedAuth;