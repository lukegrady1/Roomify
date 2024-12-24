import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase/firebaseConfig'; // Import Firebase app
import '../styles/CombinedAuth.css';

const CombinedAuth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setError('Full name is required for sign up.');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/search'); // Redirect to SearchPage
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/search'); // Redirect to SearchPage
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{isSignUp ? 'Sign Up for Roomify' : 'Log in to Roomify'}</h1>
        <p>{isSignUp ? 'Create your account to get started.' : 'Welcome back! Please log in.'}</p>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleAuth}>
          {isSignUp && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <div className="separator">or</div>
        <div className="social-login">
          <button className="social-button google" onClick={handleGoogleSignIn}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google"
            />
            Continue with Google
          </button>
          <button className="social-button apple" disabled>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
            />
            Continue with Apple
          </button>
          <button className="social-button email" disabled>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Email_icon.svg/512px-Email_icon.svg.png"
              alt="Email"
            />
            Continue with Email
          </button>
          <button className="social-button facebook" disabled>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/512px-Facebook_f_logo_%282019%29.svg.png"
              alt="Facebook"
            />
            Continue with Facebook
          </button>
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
