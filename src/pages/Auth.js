import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(`/api/auth/${mode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Store auth token
            localStorage.setItem('sellora:auth', JSON.stringify({
                token: data.token,
                user: data.user
            }));

            // Redirect to account or previous page
            const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
            window.location.href = returnUrl || '/account';

        } catch (error) {
            console.error('Auth error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMagicLink = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/magic-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send magic link');
            }

            setMagicLinkSent(true);

        } catch (error) {
            console.error('Magic link error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (magicLinkSent) {
        return (
            <div className="auth-page">
                <div className="container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Check Your Email</h1>
                            <p>We've sent a magic link to {email}</p>
                        </div>
                        <div className="auth-content">
                            <p>Click the link in your email to sign in. The link expires in 15 minutes.</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setMagicLinkSent(false)}
                            >
                                Try Another Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h1>
                        <p>
                            {mode === 'signin'
                                ? 'Sign in to access your account'
                                : 'Sign up to get started with Sellora'}
                        </p>
                    </div>

                    <div className="auth-content">
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="error-message" role="alert">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? 'Please wait...'
                                    : mode === 'signin'
                                    ? 'Sign In'
                                    : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        <button
                            className="btn btn-outline"
                            onClick={handleMagicLink}
                            disabled={isLoading || !email}
                        >
                            Continue with Magic Link
                        </button>

                        <div className="auth-footer">
                            {mode === 'signin' ? (
                                <p>
                                    Don't have an account?{' '}
                                    <button
                                        className="link-button"
                                        onClick={() => setMode('signup')}
                                    >
                                        Sign Up
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{' '}
                                    <button
                                        className="link-button"
                                        onClick={() => setMode('signin')}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
