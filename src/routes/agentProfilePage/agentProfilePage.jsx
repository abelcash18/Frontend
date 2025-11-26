import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import Loading from "../../components/Loading/Loading";
import Card from "../../components/card/Card";
import "./agentProfilePage.scss";


function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [agentPosts, setAgentPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        setIsLoading(true);
        setError("");
        
             const agentResponse = await apiRequest.get(`/users/${id}`);
        setAgent(agentResponse.data);
        
         const postsResponse = await apiRequest.get(`/posts/user/${id}`);
        setAgentPosts(postsResponse.data);
        
      } catch (err) {
        console.error("Failed to fetch agent data:", err);
        setError("Agent not found or unable to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAgentData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="agentProfilePage">
        <div className="loadingContainer">
          <Loading size="large" text="Loading agent profile..." />
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="agentProfilePage">
        <div className="errorContainer">
          <div className="errorContent">
            <img src="/error.png" alt="Error" />
            <h2>Agent Not Found</h2>
            <p>{error || "The agent you're looking for doesn't exist."}</p>
            <Link to="/agents" className="backBtn">
              Browse All Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agentProfilePage">
      <div className="container">
        {/* Agent Header Section */}
        <div className="agentHeader">
          <div className="agentProfile">
            <div className="profileImage">
              <img 
                src={agent.avatar || "/noavatarr.jpg"} 
                alt={agent.username} 
              />
              <div className="onlineStatus">
                <div className="onlineIndicator"></div>
                <span>Online Now</span>
              </div>
            </div>
            
            <div className="profileInfo">
              <h1>{agent.username}</h1>
              <p className="email">{agent.email}</p>
              <p className="bio">Professional real estate agent with years of experience helping clients find their perfect homes.</p>
              
              <div className="profileStats">
                <div className="stat">
                  <span className="number">{agentPosts.length}</span>
                  <span className="label">Properties</span>
                </div>
                <div className="stat">
                  <span className="number">4.8</span>
                  <span className="label">Rating</span>
                </div>
                <div className="stat">
                  <span className="number">2</span>
                  <span className="label">Years Exp</span>
                </div>
                <div className="stat">
                  <span className="number">98%</span>
                  <span className="label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contactActions">
            <button className="primaryBtn">
              <img src="/chat" alt="Chat" />
              Send Message
            </button>
            <button className="secondaryBtn">
              <img src="/phone.png" alt="Phone" />
              Call Agent
            </button>
            <button className="tertiaryBtn">
              <img src="/mail.png" alt="Email" />
              Email Agent
            </button>
          </div>
        </div>

        {/* Agent Details Section */}
        <div className="agentDetails">
          <div className="detailsSection">
            <h2>About Me</h2>
            <p>
              Dedicated real estate professional with a passion for helping clients navigate 
              the property market. Specializing in residential properties with a focus on 
              client satisfaction and building long-term relationships.
            </p>
          </div>

          <div className="detailsSection">
            <h2>Specialties</h2>
            <div className="specialties">
              <span className="specialty">Residential Sales</span>
              <span className="specialty">Property Management</span>
              <span className="specialty">Investment Properties</span>
              <span className="specialty">First-time Buyers</span>
              <span className="specialty">Luxury Homes</span>
            </div>
          </div>

          <div className="detailsSection">
            <h2>Areas Covered</h2>
            <div className="areas">
              <span className="area">Downtown</span>
              <span className="area">Suburban Areas</span>
              <span className="area">Waterfront</span>
              <span className="area">Historic Districts</span>
            </div>
          </div>
        </div>

        {/* Agent's Properties Section */}
        <div className="propertiesSection">
          <div className="sectionHeader">
            <h2>Properties Listed by {agent.username}</h2>
            <p>{agentPosts.length} properties available</p>
          </div>

          {agentPosts.length > 0 ? (
            <div className="propertiesGrid">
              {agentPosts.map(post => (
                <Card key={post._id || post.id} item={post} />
              ))}
            </div>
          ) : (
            <div className="noProperties">
              <img src="/error.png" alt="No properties" />
              <h3>No Properties Listed</h3>
              <p>This agent hasn't listed any properties yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentProfilePage;