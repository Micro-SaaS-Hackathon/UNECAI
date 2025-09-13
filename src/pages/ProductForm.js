import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        productName: '',
        brandName: '',
        shortTagline: '',
        privacyConsent: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }

        if (!formData.brandName.trim()) {
            newErrors.brandName = 'Brand name is required';
        }

        if (!formData.privacyConsent) {
            newErrors.privacyConsent = 'Privacy consent is required to continue';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (validateForm()) {
            try {
                // Persist data to localStorage
                const productMeta = {
                    productName: formData.productName.trim(),
                    brandName: formData.brandName.trim(),
                    shortTagline: formData.shortTagline.trim(),
                    privacyConsent: formData.privacyConsent,
                    createdAt: new Date().toISOString()
                };

                localStorage.setItem('glamgen:productMeta', JSON.stringify(productMeta));
                
                console.log('Product metadata saved:', productMeta);
                
                // Navigate to upload page
                window.location.href = '/upload';
            } catch (error) {
                console.error('Error saving product metadata:', error);
                setErrors({ submit: 'Failed to save product information. Please try again.' });
            }
        }

        setIsSubmitting(false);
    };

    return (
        <div className="product-form-page">
            <div className="container">
                <div className="form-header">
                    <h1>Product Information</h1>
                    <p className="form-description">
                        Tell us about your product to enhance your photos with AI
                    </p>
                </div>

                <form className="product-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="productName" className="form-label">
                            Product Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder="e.g. Velvet Glow Serum"
                            className={`form-input ${errors.productName ? 'error' : ''}`}
                            required
                            aria-describedby={errors.productName ? 'productName-error' : undefined}
                        />
                        {errors.productName && (
                            <div id="productName-error" className="error-message" role="alert">
                                {errors.productName}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="brandName" className="form-label">
                            Brand Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="brandName"
                            name="brandName"
                            value={formData.brandName}
                            onChange={handleInputChange}
                            placeholder="e.g. Luxe Beauty Co."
                            className={`form-input ${errors.brandName ? 'error' : ''}`}
                            required
                            aria-describedby={errors.brandName ? 'brandName-error' : undefined}
                        />
                        {errors.brandName && (
                            <div id="brandName-error" className="error-message" role="alert">
                                {errors.brandName}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="shortTagline" className="form-label">
                            Short Tagline <span className="optional">(optional)</span>
                        </label>
                        <input
                            type="text"
                            id="shortTagline"
                            name="shortTagline"
                            value={formData.shortTagline}
                            onChange={handleInputChange}
                            placeholder="e.g. Illuminate Your Natural Beauty"
                            className="form-input"
                            maxLength="100"
                        />
                        <div className="field-help">
                            A catchy phrase that describes your product (max 100 characters)
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="privacyConsent"
                                name="privacyConsent"
                                checked={formData.privacyConsent}
                                onChange={handleInputChange}
                                className={`form-checkbox ${errors.privacyConsent ? 'error' : ''}`}
                                required
                                aria-describedby={errors.privacyConsent ? 'privacyConsent-error' : undefined}
                            />
                            <label htmlFor="privacyConsent" className="checkbox-label">
                                I consent to temporary image storage for processing <span className="required">*</span>
                            </label>
                        </div>
                        {errors.privacyConsent && (
                            <div id="privacyConsent-error" className="error-message" role="alert">
                                {errors.privacyConsent}
                            </div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="error-message submit-error" role="alert">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
