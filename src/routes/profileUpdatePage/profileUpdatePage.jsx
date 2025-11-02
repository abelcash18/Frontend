import { useContext, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom"
import UploadWidget from "../../components/uploadWidget/uploadWidget";
import Loading from "../../components/Loading/Loading";

function ProfileUpdatePage() {
  const {currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar );
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // show global overlay
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);
        if (avatar) updatedData.avatar = avatar;

    const { username, email, password  } = updatedData;

    // determine a reliable user id from possible response shapes
    const userId =
      currentUser?.id || currentUser?._id || currentUser?.user?.id || currentUser?.data?.id;

    if (!userId) {
      const msg = "Cannot update profile: user id is missing";
      console.error(msg, { currentUser });
      setError(msg);
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
      return;
    }

    try {
      const payload = { username, email, password, avatar: updatedData.avatar };
      console.debug("Sending profile update for userId", userId, payload);
      const res = await apiRequest.put(`/users/${userId}`, payload);

      console.debug("Profile update response:", res.data);

      // backend may return the updated user directly or under `user`
      const newUser = res.data?.user || res.data;
      updateUser(newUser);
      navigate("/profile");
    } catch (err) {
      console.error("Error updating user:", err);
      const message = err?.response?.data?.message || err?.message || "Update failed";
      setError(message);
    } finally {
      setIsLoading(false);
      // hide global overlay
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
            <input  id="username" name="username"
             type="text" defaultValue={currentUser.username}/>
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input id="email" name="email"
              type="email" defaultValue={currentUser.email}/>
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
            {error && <span className="error">{error}</span>}
        </form>
      </div>
      <div className="sideContainer">
        <img src={avatar || "/noavatarr.jpg"} alt=""
         className="avatar" />
        <UploadWidget uwConfig={{ 
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
