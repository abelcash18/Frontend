import { useContext, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom"
import UploadWidget from "../../components/uploadWidget/uploadWidget";

function ProfileUpdatePage() {
  const {currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar );

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);
    updateUser(updatedData);
    const {username, email, password} = Object.fromEntries(formData);
    try {
     const res =  await apiRequest.put(`/users/${currentUser.id}`, {
       username, email, password,}); 
         updateUser(res.data);
         navigate("/profile")
    } catch (err) {
      console.log("Error updating user:", error);
      setError(err.response.data.message);
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
          {error && <span>console.error();
          </span>}
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
