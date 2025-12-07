import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/uploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar || "/noavatarr.jpg");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    
    const userId = currentUser?.id || currentUser?._id || currentUser?.user?.id || currentUser?.data?.id;

    if (!userId) {
      const msg = "Cannot update profile: user id is missing";
      console.error(msg, { currentUser });
      setError(msg);
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
      return;
    }

    try {
      const updateData = {};
      if (username && username !== currentUser.username) updateData.username = username;
      if (email && email !== currentUser.email) updateData.email = email;
      if (password) updateData.password = password;
      if (avatar && avatar !== currentUser.avatar) updateData.avatar = avatar;

      if (Object.keys(updateData).length === 0) {
        setError("No changes detected");
        return;
      }

      console.log("Updating user with data:", updateData);

      const res = await apiRequest.put(`/users/${userId}`, updateData);
      
    const updatedUser = res.data?.user || res.data;
      updateUser(updatedUser);
    alert("Profile updated successfully");  
      navigate("/profile");
    } catch (err) {
      console.error("Error updating user:", err);
      const message = err?.response?.data?.message || err?.message || "Update failed";
      setError(message);
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          
          <div className="item">
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              name="username"
              type="text" 
              defaultValue={currentUser.username}
              placeholder="Enter your username"
            />
          </div>
          
          <div className="item">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email"
              type="email" 
              defaultValue={currentUser.email}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="item">
            <label htmlFor="password">New Password (leave blank to keep current)</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="Enter new password"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={isLoading ? 'loading' : ''}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
          
          {error && <span className="error">{error}</span>}
        </form>
      </div>
      
      <div className="sideContainer">
        <div className="avatarSection">
          <img 
            src={avatar} 
            alt="Profile avatar" 
            className="avatar" 
          />
          <p>Click below to upload new avatar</p>
        </div>
        
        <UploadWidget 
          uwConfig={{ 
            cloudName: "duzkfzv3p",
            uploadPreset: "Estate",
            multiple: false,
            maxImageFileSize: 1048576,
            folder: "avatars"
          }}
          setAvatar={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;