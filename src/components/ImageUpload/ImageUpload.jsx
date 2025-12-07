import { useState } from "react";
import "./imageUpload.scss";

function ImageUpload({ images, setImages, maxImages = 6 }) {
    const [uploading, setUploading] = useState(false);

  const normalizedImages = Array.isArray(images) ? images : images ? [images] : [];

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Estate");
        formData.append("folder", "properties");

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/duzkfzv3p/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                return data.secure_url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + normalizedImages.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = files.map(file => uploadImage(file));
            const newImageUrls = await Promise.all(uploadPromises);
            
            setImages([...normalizedImages, ...newImageUrls]);
        } catch (error) {
            alert("Failed to upload some images. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove) => {
        const newImages = normalizedImages.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        if (files.length > 0) {
            const inputEvent = {
                target: { files }
            };
            handleImageChange(inputEvent);
        }
    };

    return (
        <div className="imageUpload">
            <label className="uploadLabel">Property Images *</label>
            <p className="uploadHint">Upload up to {maxImages} images. First image will be the main thumbnail.</p>
            
            <div className="imagePreviewGrid">
                {normalizedImages.map((image, index) => (
                    <div key={index} className="imagePreviewItem">
                        <img src={image} alt={`Preview ${index + 1}`} />
                        <button
                            type="button"
                            className="removeImageBtn"
                            onClick={() => removeImage(index)}
                        >
                            ×
                        </button>
                        {index === 0 && <span className="mainImageBadge">Main</span>}
                    </div>
                ))}
                
             {normalizedImages.length < maxImages && (
                    <div 
                        className={`uploadArea ${uploading ? 'uploading' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={uploading}
                            className="fileInput"
                            id="property-images"
                        />
                        <label htmlFor="property-images" className="uploadContent">
                            {uploading ? (
                                <>
                                    <div className="spinner"></div>
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>
                                    <div className="uploadIcon">+</div>
                                    <span>Click or drag images</span>
                                    <small>JPEG, PNG, WebP (Max 5MB each)</small>
                                </>
                            )}
                        </label>
                    </div>
                )}
            </div>

            <div className="imageCount">
                {normalizedImages.length} / {maxImages} images
            </div>
        </div>
    );
}

export default ImageUpload;