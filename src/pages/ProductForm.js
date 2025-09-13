import React, { useState } from 'react';
import './ProductForm.css';

const ProductForm = () => {
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        description: '',
        price: '',
        style: '',
        targetAudience: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Product form submitted:', formData);
        // TODO: Implement product creation logic
        alert('Product form submitted! (This is a placeholder)');
    };

    return (
        <div className="product-form-page">
            <div className="container">
                <h1>Create Product</h1>
                <p className="page-description">
                    Define your product details for AI-enhanced photo generation
                </p>

                <form className="product-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="productName">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select category</option>
                            <option value="fashion">Fashion</option>
                            <option value="beauty">Beauty</option>
                            <option value="lifestyle">Lifestyle</option>
                            <option value="jewelry">Jewelry</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your product"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="price">Price Range</label>
                            <select
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select price range</option>
                                <option value="budget">Budget ($0-50)</option>
                                <option value="mid">Mid-range ($50-200)</option>
                                <option value="premium">Premium ($200-500)</option>
                                <option value="luxury">Luxury ($500+)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="style">Preferred Style</label>
                            <select
                                id="style"
                                name="style"
                                value={formData.style}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select style</option>
                                <option value="elegant">Elegant</option>
                                <option value="casual">Casual</option>
                                <option value="glamorous">Glamorous</option>
                                <option value="minimalist">Minimalist</option>
                                <option value="vintage">Vintage</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="targetAudience">Target Audience</label>
                        <select
                            id="targetAudience"
                            name="targetAudience"
                            value={formData.targetAudience}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select target audience</option>
                            <option value="women">Women</option>
                            <option value="men">Men</option>
                            <option value="unisex">Unisex</option>
                            <option value="children">Children</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
