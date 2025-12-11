import { Link, useNavigate } from "react-router-dom";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import PostModal from "../../components/PostModal/PostModal";
import UpdatePostModal from "../../components/UpdatePostModal/UpdatePostModal";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/AlertModal/AlertModal";

function ProfilePage() {
    const { updateUser, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingPosts, setIsFetchingPosts] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [fetchError, setFetchError] = useState("");

    const getUserId = () => {
        return (
            currentUser?.id ||
            currentUser?._id ||
            currentUser?.user?.id ||
            currentUser?.data?.id
        );
    };

    const fetchUserPosts = async () => {
        const userId = getUserId();
        if (!userId) {
            console.log("No user ID available");
            return;
        }

        try {
            setIsFetchingPosts(true);
            setFetchError("");

            const response = await apiRequest.get(`/posts/user/${userId}`);
            setUserPosts(response.data || []);
        } catch (err) {
            console.error("Failed to fetch user posts:", err);
            setFetchError(err.response?.data?.message || "Failed to load posts");
        } finally {
            setIsFetchingPosts(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchUserPosts();
    }, [currentUser]);

     useEffect(() => {
        if (showAlert) console.debug("ProfilePage: showAlert = true (logout modal visible)");
    }, [showAlert]);

    const handleLogout = async () => {
        setIsLoading(true);
        window.dispatchEvent(new CustomEvent("globalLoading", { detail: { loading: true } }));

        try {
            await apiRequest.post("/auth/logout");
            try { localStorage.setItem("logoutMessage", JSON.stringify({ message: "Logout successful! Redirecting to homepage..." })); } catch(e) {}
                       updateUser(null);
            navigate("/");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            window.dispatchEvent(new CustomEvent("globalLoading", { detail: { loading: false } }));
        }
    };

    const handlePostCreated = (newPost) => {
        setUserPosts((prev) => [newPost, ...prev]);
            alert("Post created successfully");
        setShowPostModal(false);
        setTimeout(() => fetchUserPosts(), 1000);
    };

    const handlePostUpdated = (updatedPost) => {
        setUserPosts((prev) => prev.map((post) => (post._id === updatedPost._id || post.id === updatedPost.id ? updatedPost : post)));
        setShowUpdateModal(false);
         alert("Post updated successfully");
        setSelectedPost(null);
        setTimeout(() => fetchUserPosts(), 500);
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
         alert("Post edited successfully");
        setShowUpdateModal(true);
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;
        try {
            setIsLoading(true);
            await apiRequest.delete(`/posts/${postId}`);
            setUserPosts((prev) => prev.filter((post) => post._id !== postId && post.id !== postId));
            alert("Post deleted successfully");
        } catch (err) {
            console.error("Failed to delete post:", err);
            alert("Failed to delete post. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetryFetch = () => fetchUserPosts();

    return (
        <div className="profilePage">
            <AlertModal message={"Logout successful! Redirecting to homepage..."} isOpen={showAlert} type="success" onClose={() => setShowAlert(false)} />

            <div className="details">
                <div className="wrapper">
                    <div className="profileSection">
                        <div className="sectionHeader">
                            <h1>User Information</h1>
                            <Link to="/profile/update">
                                <button className="primaryBtn">Update Profile</button>
                            </Link>
                        </div>
                        <div className="userInfo">
                            <div className="avatarSection">
                                <img src={currentUser?.avatar || "/noavatarr.jpg"} alt="profile" className="avatar" />
                                <div className="userDetails">
                                    <h2>{currentUser?.username || "Dewgates Consult"}</h2>
                                    <p>{currentUser?.email || "DewgatesConsults@gmail.com"}</p>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="logoutBtn" disabled={isLoading}>
                                {isLoading ? "Logging out..." : "Logout"}
                            </button>
                        </div>
                    </div>

                    <div className="profileSection">
                        <div className="sectionHeader">
                            <h1>My List</h1>
                            <button className="primaryBtn" onClick={() => setShowPostModal(true)} disabled={isLoading || isFetchingPosts}>
                                Create New Post
                            </button>
                        </div>

                        {isFetchingPosts && (
                            <div className="loadingState">
                                <div className="loaderContainer">
                                    <Loading />
                                    <p>Loading your posts...</p>
                                </div>
                            </div>
                        )}

                        {fetchError && !isFetchingPosts && (
                            <div className="errorState">
                                <div className="errorContent">
                                    <img src="/error.png" alt="Error" />
                                    <h3>Failed to load posts</h3>
                                    <p>{fetchError}</p>
                                    <button onClick={handleRetryFetch} className="retryBtn">
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isFetchingPosts && !fetchError && userPosts.length > 0 && (
                            <List posts={userPosts} onEdit={handleEditPost} onDelete={handleDeletePost} showActions={true} />
                        )}

                        {!isFetchingPosts && !fetchError && userPosts.length === 0 && (
                            <div className="emptyState">
                                <img src="/error.png" alt="No posts" />
                                <h3>No posts yet</h3>
                                <p>Create your first post to get started!</p>
                            </div>
                        )}
                    </div>

                    <div className="profileSection">
                        <div className="sectionHeader">
                            <h1>Saved List</h1>
                        </div>
                        {savedPosts.length > 0 ? <List posts={savedPosts} /> : (
                            <div className="emptyState">
                                <img src="/error.png" alt="No saved posts" />
                                <h3>No saved posts</h3>
                                <p>Posts you save will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="chatContainer">
                <div className="wrapper">
                    <Chat />
                </div>
            </div>

            {showPostModal && <PostModal onClose={() => setShowPostModal(false)} onPostCreated={handlePostCreated} />}
            {showUpdateModal && selectedPost && <UpdatePostModal post={selectedPost} onClose={() => { setShowUpdateModal(false); setSelectedPost(null); }} onPostUpdated={handlePostUpdated} />}
        </div>
    );
}

export default ProfilePage;