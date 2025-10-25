import { useContext, useState } from "react";
import {AuthContext} from "../../context/AuthContext";
import "./profileUpdatePage.scss";
import apiRequest from "../../lib/apiRequest";

function ProfileUpdatePage() {
  const [error, setError] = useState(null);
  const {currentUser, updateUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData);
    updateUser(updatedData);
    const {username, email, password} = Object.fromEntries(formData);
    try {
     const res = apiRequest.put(`/users/${currentUser.id}`, {
       username, email, password,}); 
         updateUser(res.data);
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
        <img src={currentUser.avatar || "/noavatarr.jpg"} alt=""
         className="avatar" />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
