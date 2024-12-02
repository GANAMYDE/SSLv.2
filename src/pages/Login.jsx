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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { user, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (loginError) {
      setError(loginError.message);

      // Focus on the appropriate input field based on the error
      if (loginError.message.toLowerCase().includes('email')) {
        document.getElementById('email-input').focus();
      } else if (loginError.message.toLowerCase().includes('password')) {
        document.getElementById('password-input').focus();
      }
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
      navigate('/dashboard');
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError('');
    const { user, error: oauthError } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);

    if (oauthError) {
      setError(oauthError.message);
    } else {
      localStorage.setItem('user', JSON.stringify(user));
      setEmail(''); // Clear email field
      setPassword(''); // Clear password field
      navigate('/dashboard');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError('Please enter your email.');
    setLoading(true);
    setError('');
    const { error: resetError } = await supabase.auth.api.resetPasswordForEmail(email);
    setLoading(false);
    setError(resetError ? resetError.message : 'Check your email for reset instructions.');
  };

  return (
    <div className="login-container">
      <h1>Welcome!</h1>
      <form onSubmit={handleLogin}>
        <input
          id="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? <Spinner /> : 'Login'}
        </button>
      </form>
      <div className="oauth-options">
        <button onClick={() => handleOAuthLogin('google')} disabled={loading}>
          Google
        </button>
        <button onClick={() => handleOAuthLogin('facebook')} disabled={loading}>
          Facebook
        </button>
      </div>
      <button onClick={handleForgotPassword} disabled={loading} className="forgot-password">
        Forgot Password?
      </button>
    </div>
  );
};

export default Login;
