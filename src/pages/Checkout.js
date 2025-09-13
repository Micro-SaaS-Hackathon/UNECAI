import React, { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = () => {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const plans = {
        credits: {
            name: 'Pay As You Go',
            prices: [
                { credits: 5, price: 4.99, popular: false },
                { credits: 10, price: 8.99, popular: true },
                { credits: 20, price: 15.99, popular: false }
            ]
        },
        subscription: {
            name: 'Monthly Subscription',
            prices: [
                { name: 'Basic', credits: 20, price: 9.99, popular: false },
                { name: 'Pro', credits: 50, price: 19.99, popular: true },
                { name: 'Business', credits: 'Unlimited', price: 49.99, popular: false }
            ]
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const response = await fetch('/api/user');
            if (!response.ok) throw new Error('Failed to load user data');
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('User data error:', error);
            setError(error.message);
        }
    };

    const handleCheckout = async (plan, price) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plan,
                    priceId: price.id,
                    returnUrl: window.location.origin + '/account'
                })
            });

            if (!response.ok) {
                throw new Error('Checkout failed');
            }

            const { sessionUrl } = await response.json();
            window.location.href = sessionUrl;

        } catch (error) {
            console.error('Checkout error:', error);
            setError('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-header">
                    <h1>Choose Your Plan</h1>
                    <p>Select the plan that works best for you</p>
                </div>

                <div className="plan-toggle">
                    <button
                        className={`toggle-btn ${selectedPlan === 'credits' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('credits')}
                    >
                        Pay As You Go
                    </button>
                    <button
                        className={`toggle-btn ${selectedPlan === 'monthly' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                    >
                        Monthly Subscription
                    </button>
                </div>

                <div className="pricing-grid">
                    {(selectedPlan === 'credits' ? plans.credits.prices : plans.subscription.prices).map((price, index) => (
                        <div
                            key={index}
                            className={`pricing-card ${price.popular ? 'popular' : ''}`}
                        >
                            {price.popular && (
                                <div className="popular-badge">Most Popular</div>
                            )}
                            <div className="pricing-header">
                                {selectedPlan === 'monthly' && (
                                    <h2 className="plan-name">{price.name}</h2>
                                )}
                                <div className="price">
                                    <span className="currency">$</span>
                                    <span className="amount">{price.price}</span>
                                    {selectedPlan === 'monthly' && (
                                        <span className="period">/mo</span>
                                    )}
                                </div>
                                <div className="credits">
                                    {typeof price.credits === 'number' ? (
                                        <>{price.credits} credits</>
                                    ) : (
                                        <>{price.credits} credits</>
                                    )}
                                </div>
                            </div>

                            <div className="pricing-features">
                                <ul>
                                    <li>✓ High-resolution downloads</li>
                                    <li>✓ All enhancement styles</li>
                                    {selectedPlan === 'monthly' && (
                                        <>
                                            <li>✓ Priority processing</li>
                                            <li>✓ Cloud storage</li>
                                            {price.credits === 'Unlimited' && (
                                                <li>✓ API access</li>
                                            )}
                                        </>
                                    )}
                                </ul>
                            </div>

                            <button
                                className={`btn ${price.popular ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => handleCheckout(selectedPlan, price)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <div className="checkout-footer">
                    <div className="guarantee">
                        <span className="guarantee-icon">🛡️</span>
                        <div className="guarantee-text">
                            <h3>100% Satisfaction Guarantee</h3>
                            <p>Not satisfied? Get a full refund within 30 days</p>
                        </div>
                    </div>

                    <div className="secure-checkout">
                        <span className="secure-icon">🔒</span>
                        <p>Secure checkout powered by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
