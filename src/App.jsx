import { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

const Spinner = () => (
  <div className="spinner">
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { user, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);

      if (loginError) {
        setError(loginError.message);
        if (loginError.message.toLowerCase().includes('email')) {
          document.getElementById('email-input').focus();
        } else if (loginError.message.toLowerCase().includes('password')) {
          document.getElementById('password-input').focus();
        }
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        setEmail('');
        setPassword('');
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { user, error: oauthError } = await supabase.auth.signInWithOAuth({ provider });
      setLoading(false);

      if (oauthError) {
        setError(oauthError.message);
      } else {
        localStorage.setItem('user', JSON.stringify(user));
        setEmail('');
        setPassword('');
        setSuccessMessage('Login successful via OAuth! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred during OAuth login.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('An error occurred while resetting the password.');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <input
          id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />

        {/* Password Input */}
        <div className="password-container">
          <input
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Login'}
        </button>
      </form>

      {/* OAuth Login Options */}
      <div className="oauth-options">
        <button onClick={() => handleOAuthLogin('google')} disabled={loading}>
          Login with Google
        </button>
        <button onClick={() => handleOAuthLogin('facebook')} disabled={loading}>
          Login with Facebook
        </button>
      </div>

      {/* Forgot Password */}
      <button onClick={handleForgotPassword} disabled={loading} className="forgot-password">
        Forgot Password?
      </button>
    </div>
  );
};

export default Login;
