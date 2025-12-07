import { useState, useEffect, useRef } from "react";
import "./ChatModal.scss";
import apiRequest from "../../lib/apiRequest";
import { useSocket } from "../../hooks/useSocket";

function ChatModal({ property, owner, clientId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);
  const messagesEndRef = useRef(null);

   const { socket, isConnected } = useSocket();

   useEffect(() => {
    if (socket && clientId && isConnected) {
      socket.emit('joinClientRoom', clientId);
      
      socket.on('newMessage', (data) => {
        if (data.chatId === chatId) {
          setMessages(prev => [...prev, data.message]);
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, clientId, chatId, isConnected]);

  useEffect(() => {
    const storedChatId = localStorage.getItem(`chat_${property._id}_${clientId}`);
    if (storedChatId) {
      setChatId(storedChatId);
      loadChat(storedChatId);
      setHasInitialized(true);
      setIsNewChat(false);
    } else {
       setIsNewChat(true);
    }
  }, [property._id, clientId]);

  useEffect(() => {
    const startChat = async () => {
      if (hasInitialized || !property || !clientId || chatId || !isNewChat) return;

      try {
        setIsLoading(true);
        setHasInitialized(true);

        const response = await apiRequest.post("/api/chat/client/start", {
          propertyId: property._id,
          clientId: clientId,
          clientName: "Guest",
          initialMessage: `Hi, I'm interested in this ${property.type} property: ${property.title}`
        });

        const newChatId = response.data.chatId;
        setChatId(newChatId);
        
      localStorage.setItem(`chat_${property._id}_${clientId}`, newChatId);
        
        loadChat(newChatId);
        
      } catch (err) {
        console.error("Failed to start chat:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isNewChat) {
      startChat();
    }
  }, [property, clientId, hasInitialized, chatId, isNewChat]);

  const loadChat = async (id) => {
    try {
      const response = await apiRequest.get(`/api/chat/client/${id}`);
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat:", err);
      localStorage.removeItem(`chat_${property._id}_${clientId}`);
      setChatId(null);
      setHasInitialized(false);
      setIsNewChat(true); 
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      setIsLoading(true);
      const messageText = newMessage;

      const tempMessage = {
        _id: Date.now().toString(),
        text: messageText,
        senderType: 'client',
        clientId,
        createdAt: new Date()
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");

      await apiRequest.post(`/api/chat/client/${chatId}/message`, {
        text: messageText,
        clientId
      });

    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      setNewMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatModalOverlay">
      <div className="chatModal">
        <div className="chatHeader">
          <div className="propertyInfo">
            <img src={property.images?.[0] || "/error.png"} alt={property.title} />
            <div className="propertyDetails">
              <h3>{property.title}</h3>
              <p>${property.price.toLocaleString()} • {property.type}</p>
              <small>Chat with {owner?.username || "Property Owner"}</small>
              {!isConnected && (
                <div className="connection-warning">
                  <span className="offline-dot"></span>
                  Connecting to chat...
                </div>
              )}
            </div>
          </div>
          <button className="closeBtn" onClick={onClose}>×</button>
        </div>

        <div className="chatMessages">
          {isLoading && messages.length === 0 ? (
            <div className="loadingState">
              <p>{isNewChat ? "Starting conversation..." : "Loading conversation..."}</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="noMessages">
              <div className="empty-icon">💬</div>
              <h4>No messages yet</h4>
              <p>{isNewChat ? "Starting a new conversation..." : "Continue your conversation"}</p>
              {!isConnected && (
                <div className="connection-notice">
                  <span className="offline-dot"></span>
                  Waiting for connection...
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.senderType === 'client' ? 'client' : 'owner'}`}
              >
                <div className="messageBubble">
                  <p>{message.text}</p>
                  <span className="messageTime">
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatInput">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={!isConnected ? "Connecting to chat..." : "Type your message..."}
            rows={1}
            disabled={isLoading || !chatId || !isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading || !chatId || !isConnected}
            className="sendButton"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;