import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import Loading from "../../components/Loading/Loading";
import apiRequest from "../../lib/apiRequest";
import ChatModal from "../../components/chat/ChatModal"; 

function SinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false); 
  const [clientId, setClientId] = useState(""); 

 
  useEffect(() => {
    let existingClientId = localStorage.getItem('clientId');
    if (!existingClientId) {
      existingClientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('clientId', existingClientId);
    }
    setClientId(existingClientId);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiRequest.get(`/posts/${id}`);
        setPost(response.data);
        
        if (response.data.userId && typeof response.data.userId === 'object') {
          setUser(response.data.userId);
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Property not found or unable to load details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleSavePost = async () => {
    try {
      setIsSaving(true);
      console.log("Save functionality to be implemented");
    } catch (err) {
      console.error("Failed to save post:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContact = () => {
    setShowChatModal(true);
  };

  if (isLoading) {
    return (
      <div className="singlePage">
        <div className="loadingContainer">
          <Loading size="large" text="Loading property details..." />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="singlePage">
        <div className="errorContainer">
          <div className="errorContent">
            <img src="/error.png" alt="Error" />
            <h2>Property Not Found</h2>
            <p>{error || "The property you're looking for doesn't exist."}</p>
            <button onClick={() => navigate("/list")} className="backBtn">
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images || []} />
          <div className="info">
            <div className="top">
              <div className="post">
                <div className="badges">
                  <span className="typeBadge">{post.type}</span>
                  <span className="propertyBadge">{post.propertyType}</span>
                </div>
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="Location" />
                  <span>{post.address}, {post.city}</span>
                </div>
                <div className="price">${post.price.toLocaleString()}</div>
              </div>
              <div className="user">
                <img 
                  src={user?.avatar || "/noavatarr.jpg"} 
                  alt={user?.username || "User"} 
                />
                <div className="userInfo">
                  <span className="userName">{user?.username || "Unknown User"}</span>
                  <span className="userRole">Property Owner</span>
                </div>
              </div>
            </div>
            <div className="bottom">
              <h3>Description</h3>
              <p>{post.description || "No description provided."}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="features">
        <div className="wrapper">
          <div className="propertyDetails">
            <p className="title">Property Details</p>
            <div className="detailGrid">
              <div className="detailItem">
                <img src="/bed.png" alt="Bedrooms" />
                <div className="detailText">
                  <span>Bedrooms</span>
                  <p>{post.bedroom} {post.bedroom === 1 ? 'bedroom' : 'bedrooms'}</p>
                </div>
              </div>
              <div className="detailItem">
                <img src="/bath.png" alt="Bathrooms" />
                <div className="detailText">
                  <span>Bathrooms</span>
                  <p>{post.bathroom} {post.bathroom === 1 ? 'bathroom' : 'bathrooms'}</p>
                </div>
              </div>
              <div className="detailItem">
                <img src="/size.png" alt="Type" />
                <div className="detailText">
                  <span>Type</span>
                  <p className="capitalize">{post.type}</p>
                </div>
              </div>
              <div className="detailItem">
                <img src="/building.png" alt="Property Type" />
                <div className="detailText">
                  <span>Property Type</span>
                  <p className="capitalize">{post.propertyType}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="amenities">
            <p className="title">Amenities & Features</p>
            <div className="amenitiesGrid">
              <div className="amenityItem">
                <img src="/utility.png" alt="Utilities" />
                <span>Utilities Included</span>
              </div>
              <div className="amenityItem">
                <img src="/pet.png" alt="Pets" />
                <span>Pets Allowed</span>
              </div>
              <div className="amenityItem">
                <img src="/wifi.png" alt="WiFi" />
                <span>High-Speed WiFi</span>
              </div>
              <div className="amenityItem">
                <img src="/parking.png" alt="Parking" />
                <span>Parking Available</span>
              </div>
              <div className="amenityItem">
                <img src="/laundry.png" alt="Laundry" />
                <span>Laundry Facilities</span>
              </div>
              <div className="amenityItem">
                <img src="/security.png" alt="Security" />
                <span>24/7 Security</span>
              </div>
            </div>
          </div>

          <div className="locationSection">
            <p className="title">Location</p>
            <div className="mapContainer">
              <Map items={[post]} />
            </div>
            <div className="locationDetails">
              <div className="locationItem">
                <img src="/school.png" alt="Schools" />
                <div className="locationText">
                  <span>Schools</span>
                  <p>Multiple schools within 1km radius</p>
                </div>
              </div>
              <div className="locationItem">
                <img src="/bus.png" alt="Transport" />
                <div className="locationText">
                  <span>Public Transport</span>
                  <p>Bus stop 250m away</p>
                </div>
              </div>
              <div className="locationItem">
                <img src="/shopping.png" alt="Shopping" />
                <div className="locationText">
                  <span>Shopping</span>
                  <p>Supermarket 500m away</p>
                </div>
              </div>
            </div>
          </div>

          <div className="actionButtons">
            <button className="contactBtn" onClick={handleContact}>
              <img src="/chat.png" alt="Contact" />
              Contact Owner
            </button>
            <button 
              className={`saveBtn ${isSaving ? 'saving' : ''}`} 
              onClick={handleSavePost}
              disabled={isSaving}
            >
              <img src="/save.png" alt="Save" />
              {isSaving ? "Saving..." : "Save Property"}
            </button>
          </div>
        </div>
      </div>

      {showChatModal && (
        <ChatModal
          property={post}
          owner={user}
          clientId={clientId}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}

export default SinglePage;