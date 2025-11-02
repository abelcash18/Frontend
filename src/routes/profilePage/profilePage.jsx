import { Link, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/Loading/Loading";

function ProfilePage() {
    const {updateUser, currentUser} =  useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  console.log('cu:',currentUser)
  const handleLogout = async () =>{
    setIsLoading(true);
    // show global overlay
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));
    try {
       await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
      // hide global overlay
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  }
  return (    
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar || "/noavatarr.jpg"}
                alt="profile picture"
              />
            </span>
            <span>
              Username: <b>{currentUser.username || "Dewgates Consult"}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email || "DewgatesConsults@gmail.com"}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <button>Create New Post</button>
          </div>
          <List />
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat/>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
