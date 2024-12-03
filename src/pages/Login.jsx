import { useState } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

// Spinner component for loading state
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
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle Forgot Password view
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
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

    if (resetError) {
      setError(resetError.message);
    } else {
      setForgotPasswordMessage('Check your email for reset instructions.');
    }
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setError('');
    setForgotPasswordMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">{isForgotPassword ? 'Reset Password' : 'Welcome Back!'}</h1>

        {isForgotPassword ? (
          // Forgot Password View
          <div>
            <div className="mb-4">
              <input
                id="email-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {forgotPasswordMessage && (
              <p className="text-green-500 text-sm text-center mb-4">{forgotPasswordMessage}</p>
            )}
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <Spinner />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center mt-4">
              <button
                onClick={toggleForgotPassword}
                className="text-sm text-indigo-600 hover:underline focus:outline-none"
                disabled={loading}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          // Login Form View
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                id="email-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            <div className="mb-6">
              <input
                id="password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center space-x-2">
                  <Spinner />
                  <span>Loading...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          {!isForgotPassword && (
            <button
              onClick={toggleForgotPassword}
              className="text-sm text-indigo-600 hover:underline focus:outline-none"
              disabled={loading}
            >
              Forgot Password?
            </button>
          )}
        </div>

        {/* OAuth Login Buttons */}
        {!isForgotPassword && (
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-50 transition"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
            >
              <i className="fab fa-google text-indigo-600"></i>
            </button>
            <button
              className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-indigo-50 transition"
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
            >
              <i className="fab fa-facebook text-indigo-600"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
