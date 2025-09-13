import React, { useState, useEffect } from 'react';
import './Account.css';

const Account = () => {
    const [user, setUser] = useState(null);
    const [credits, setCredits] = useState(0);
    const [creditHistory, setCreditHistory] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAccountData();
    }, []);

    const loadAccountData = async () => {
        try {
            // Load user data
            const userResponse = await fetch('/api/user');
            if (!userResponse.ok) throw new Error('Failed to load user data');
            const userData = await userResponse.json();
            setUser(userData);

            // Load credits
            const creditsResponse = await fetch('/api/credits');
            if (!creditsResponse.ok) throw new Error('Failed to load credits');
            const creditsData = await creditsResponse.json();
            setCredits(creditsData.credits);
            setCreditHistory(creditsData.history);

            // Load subscription
            const subResponse = await fetch('/api/subscription');
            if (!subResponse.ok) throw new Error('Failed to load subscription');
            const subData = await subResponse.json();
            setSubscription(subData);

        } catch (error) {
            console.error('Account data error:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = () => {
        window.location.href = '/checkout';
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) {
            return;
        }

        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            // Reload account data
            loadAccountData();

        } catch (error) {
            console.error('Cancel subscription error:', error);
            alert('Failed to cancel subscription. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="loading">Loading account data...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="account-page">
            <div className="container">
                <div className="account-header">
                    <h1>Account Settings</h1>
                    <p className="welcome-message">
                        Welcome back, {user.name || user.email}
                    </p>
                </div>

                <div className="account-grid">
                    {/* Credits Section */}
                    <div className="account-section credits-section">
                        <h2>Credits</h2>
                        <div className="credits-card">
                            <div className="credits-amount">
                                <span className="number">{credits}</span>
                                <span className="label">credits remaining</span>
                            </div>
                            {credits < 3 && !subscription && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpgrade}
                                >
                                    Get More Credits
                                </button>
                            )}
                        </div>

                        <div className="credit-history">
                            <h3>Credit History</h3>
                            {creditHistory.length > 0 ? (
                                <ul className="history-list">
                                    {creditHistory.map((item) => (
                                        <li key={item.id} className="history-item">
                                            <div className="history-info">
                                                <span className="history-type">
                                                    {item.type === 'add' ? '➕' : '➖'}
                                                </span>
                                                <span className="history-description">
                                                    {item.description}
                                                </span>
                                            </div>
                                            <div className="history-details">
                                                <span className="history-amount">
                                                    {item.type === 'add' ? '+' : '-'}
                                                    {item.amount} credits
                                                </span>
                                                <span className="history-date">
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-history">No credit history yet</p>
                            )}
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="account-section subscription-section">
                        <h2>Subscription</h2>
                        {subscription ? (
                            <div className="subscription-card active">
                                <div className="subscription-header">
                                    <h3>{subscription.plan} Plan</h3>
                                    <span className={`status ${subscription.status}`}>
                                        {subscription.status}
                                    </span>
                                </div>
                                <div className="subscription-details">
                                    <p>
                                        <strong>Next billing date:</strong>{' '}
                                        {new Date(subscription.nextBilling).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>Monthly credits:</strong> {subscription.monthlyCredits}
                                    </p>
                                    <p>
                                        <strong>Price:</strong> ${subscription.price}/month
                                    </p>
                                </div>
                                <button
                                    className="btn btn-outline btn-danger"
                                    onClick={handleCancelSubscription}
                                >
                                    Cancel Subscription
                                </button>
                            </div>
                        ) : (
                            <div className="subscription-card">
                                <div className="subscription-header">
                                    <h3>No Active Subscription</h3>
                                </div>
                                <div className="subscription-promo">
                                    <p>Get unlimited credits with a monthly subscription</p>
                                    <ul className="benefits-list">
                                        <li>✨ Unlimited photo enhancements</li>
                                        <li>🎨 Access to all premium styles</li>
                                        <li>⚡ Priority processing</li>
                                        <li>💾 Cloud storage for results</li>
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpgrade}
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Account Settings */}
                    <div className="account-section settings-section">
                        <h2>Settings</h2>
                        <div className="settings-card">
                            <div className="setting-group">
                                <h3>Profile</h3>
                                <div className="setting-item">
                                    <label>Email</label>
                                    <p>{user.email}</p>
                                </div>
                                <div className="setting-item">
                                    <label>Name</label>
                                    <p>{user.name || 'Not set'}</p>
                                </div>
                                <button className="btn btn-outline">
                                    Edit Profile
                                </button>
                            </div>

                            <div className="setting-group">
                                <h3>Preferences</h3>
                                <div className="setting-item">
                                    <label>Email Notifications</label>
                                    <div className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            id="notifications"
                                            checked={user.preferences?.notifications}
                                            onChange={() => {}} // TODO: Implement
                                        />
                                        <label htmlFor="notifications"></label>
                                    </div>
                                </div>
                            </div>

                            <div className="setting-group">
                                <h3>Security</h3>
                                <button className="btn btn-outline">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
