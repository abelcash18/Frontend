import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import ImageUpload from "../ImageUpload/ImageUpload";
import "./updatePostModal.scss";

function UpdatePostModal({ post, onClose, onPostUpdated }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        address: "",
        city: "",
        bedroom: "",
        bathroom: "",
        type: "rent",
        propertyType: "apartment",
        images: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Initialize form with post data
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || "",
                description: post.description || "",
                price: post.price || "",
                address: post.address || "",
                city: post.city || "",
                bedroom: post.bedroom || "",
                bathroom: post.bathroom || "",
                type: post.type || "rent",
                propertyType: post.propertyType || "apartment",
                images: post.images || []
            });
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImagesChange = (newImages) => {
        setFormData(prev => ({
            ...prev,
            images: newImages
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate required fields including images
        if (formData.images.length === 0) {
            setError("Please upload at least one property image");
            setIsLoading(false);
            return;
        }

        try {
            const response = await apiRequest.put(`/posts/${post._id || post.id}`, {
                ...formData,
                price: Number(formData.price),
                bedroom: Number(formData.bedroom),
                bathroom: Number(formData.bathroom)
            });
            
            onPostUpdated(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update post");
        } finally {
            setIsLoading(false);
        }
    };

    if (!post) return null;

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <div className="modalHeader">
                    <h2>Update Post</h2>
                    <button className="closeBtn" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="postForm">
                    {error && <div className="errorMessage">{error}</div>}
                    
                    <div className="formGrid">
                        <div className="formGroup">
                            <label>Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter property title"
                            />
                        </div>

                        <div className="formGroup">
                            <label>Price *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                placeholder="Enter price"
                            />
                        </div>

                        <div className="formGroup">
                            <label>Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Enter full address"
                            />
                        </div>

                        <div className="formGroup">
                            <label>City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="formGroup">
                            <label>Bedrooms *</label>
                            <input
                                type="number"
                                name="bedroom"
                                value={formData.bedroom}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="Number of bedrooms"
                            />
                        </div>

                        <div className="formGroup">
                            <label>Bathrooms *</label>
                            <input
                                type="number"
                                name="bathroom"
                                value={formData.bathroom}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="Number of bathrooms"
                            />
                        </div>

                        <div className="formGroup">
                            <label>Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} required>
                                <option value="rent">Rent</option>
                                <option value="buy">Buy</option>
                            </select>
                        </div>

                        <div className="formGroup">
                            <label>Property Type *</label>
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                                <option value="apartment">Apartment</option>
                                <option value="house">House</option>
                                <option value="condo">Condo</option>
                                <option value="land">Land</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="formGroup fullWidth">
                        <ImageUpload 
                            images={formData.images}
                            setImages={handleImagesChange}
                            maxImages={6}
                        />
                    </div>

                    <div className="formGroup fullWidth">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your property..."
                        />
                    </div>

                    <div className="formActions">
                        <button type="button" onClick={onClose} className="cancelBtn">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading || formData.images.length === 0}
                            className="submitBtn"
                        >
                            {isLoading ? "Updating..." : "Update Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdatePostModal;