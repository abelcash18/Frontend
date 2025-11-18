import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import Loading from "../../components/Loading/Loading";
import ChatModal from "../../components/chat/ChatModal";
import "./agentsPage.scss";

function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
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
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiRequest.get("/users");
        setAgents(response.data);
        setFilteredAgents(response.data);
      } catch (err) {
        console.error("Failed to fetch agents:", err);
        setError("Failed to load agents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent =>
        agent.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  }, [searchTerm, agents]);

  const handleContactAgent = (agent) => {
    setSelectedAgent(agent);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedAgent(null);
  };

  if (isLoading) {
    return (
      <div className="agentsPage">
        <div className="loadingContainer">
          <Loading size="large" text="Loading agents..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agentsPage">
        <div className="errorContainer">
          <div className="errorContent">
            <img src="/error-icon.svg" alt="Error" />
            <h2>Unable to Load Agents</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retryBtn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agentsPage">
      <div className="container">
        <div className="header">
          <h1>Meet Our Expert Agents</h1>
          <p>Connect with professional real estate agents to find your perfect property</p>
          
          <div className="searchSection">
            <div className="searchInput">
              <img src="/search.png" alt="Search" />
              <input
                type="text"
                placeholder="Search agents by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredAgents.length > 0 ? (
          <div className="agentsGrid">
            {filteredAgents.map(agent => (
              <AgentCard 
                key={agent._id || agent.id} 
                agent={agent} 
                onContact={() => handleContactAgent(agent)}
              />
            ))}
          </div>
        ) : (
          <div className="noResults">
            <img src="/no-agents.svg" alt="No agents found" />
            <h3>No agents found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Chat Modal for contacting agents */}
      {showChatModal && selectedAgent && (
        <ChatModal
          agent={selectedAgent}
          clientId={clientId}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}

// Agent Card Component
function AgentCard({ agent, onContact }) {
  return (
    <div className="agentCard">
      <div className="agentImage">
        <img 
          src={agent.avatar || "/noavatar.jpg"} 
          alt={agent.username} 
        />
        <div className="onlineIndicator"></div>
      </div>
      
      <div className="agentInfo">
        <h3>{agent.username || "Unknown User"}</h3>
        <p className="email">{agent.email}</p>
        <div className="stats">
          <div className="stat">
            <span className="number">12+</span>
            <span className="label">Properties</span>
          </div>
          <div className="stat">
            <span className="number">4.8</span>
            <span className="label">Rating</span>
          </div>
          <div className="stat">
            <span className="number">2</span>
            <span className="label">Years</span>
          </div>
        </div>
        
        <div className="specialties">
          <span className="specialty">Residential</span>
          <span className="specialty">Commercial</span>
        </div>
      </div>
      
      <div className="agentActions">
        <Link to={`/agents/${agent._id || agent.id}`} className="viewProfileBtn">
          View Profile
        </Link>
        <button className="contactBtn" onClick={onContact}>
          <img src="/chat.png" alt="Contact" />
          Contact
        </button>
      </div>
    </div>
  );
}

export default AgentsPage;