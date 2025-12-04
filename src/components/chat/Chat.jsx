import { useState, useRef, useEffect, useContext } from "react";
import "./chat.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";

function Chat() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  
  // Use the socket hook
  const { socket, isConnected } = useSocket();

  // Join owner room and set up socket listeners
  useEffect(() => {
    if (socket && currentUser && isConnected) {
      const ownerId = currentUser.id || currentUser._id;
      socket.emit('joinOwnerRoom', ownerId);
      
      // Listen for new messages
      socket.on('newMessage', (data) => {
        console.log('New message received:', data);
        
        // Update active conversation if it's the current one
        if (activeConversation && activeConversation.id === data.chatId) {
          setActiveConversation(prev => ({
            ...prev,
            messages: [...prev.messages, {
              id: data.message._id,
              text: data.message.text,
              timestamp: formatTime(data.message.createdAt),
              isOwn: data.message.senderType === 'owner'
            }]
          }));
        }
        
        // Refresh conversations list to update unread counts and last message
        fetchOwnerChats();
      });

      // Listen for new chats
      socket.on('newChat', () => {
        console.log('New chat received');
        fetchOwnerChats();
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
        socket.off('newChat');
      }
    };
  }, [socket, currentUser, activeConversation, isConnected]);

  // Fetch owner chats
  const fetchOwnerChats = async () => {
    try {
      setIsLoadingChats(true);
      const response = await apiRequest.get("/api/chat/owner/chats");
      
      const formattedConversations = response.data.map(chat => ({
        id: chat._id,
        user: {
          name: chat.clientName,
          avatar: "/noavatarr.jpg",
          isOnline: false,
        },
        property: chat.propertyId,
        lastMessage: chat.messages.length > 0 ? 
          chat.messages[chat.messages.length - 1].text : "Start a conversation",
        timestamp: formatTimestamp(chat.lastActivity),
        unreadCount: chat.unreadCount || 0,
        messages: chat.messages.map(msg => ({
          id: msg._id,
          text: msg.text,
          timestamp: formatTime(msg.createdAt),
          isOwn: msg.senderType === 'owner'
        }))
      }));
      
      setConversations(formattedConversations);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchOwnerChats();
    }
  }, [currentUser]);

  const loadChat = async (chatId) => {
    try {
      const response = await apiRequest.get(`/api/chat/owner/chat/${chatId}`);
      const chat = response.data;
      
      const formattedChat = {
        id: chat._id,
        user: {
          name: chat.clientName,
          avatar: "/noavatarr.jpg",
          isOnline: false,
        },
        property: chat.propertyId,
        lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "No messages yet",
        timestamp: formatTimestamp(chat.lastActivity),
        unreadCount: 0,
        messages: chat.messages.map(msg => ({
          id: msg._id,
          text: msg.text,
          timestamp: formatTime(msg.createdAt),
          isOwn: msg.senderType === 'owner'
        }))
      };

      setActiveConversation(formattedChat);
      
      // Mark messages as read
      await apiRequest.put(`/api/chat/owner/chat/${chatId}/read`);
      
      // Update conversations to remove unread count
      setConversations(prev => 
        prev.map(conv => 
          conv.id === chatId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error("Failed to load chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      setIsLoading(true);
      const messageText = newMessage;

      // Optimistically add message
      const tempMessage = {
        id: Date.now().toString(),
        text: messageText,
        timestamp: "Just now",
        isOwn: true,
      };

      setActiveConversation(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage],
        lastMessage: messageText,
      }));

      setNewMessage("");

      // Send to server
      await apiRequest.post(`/api/chat/owner/chat/${activeConversation.id}/message`, {
        text: messageText
      });

    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove optimistic message on error
      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.id !== tempMessage.id)
      }));
      setNewMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Helper functions for formatting
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes === 0 ? "Just now" : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="chat">
      {/* Conversations List */}
      <div className="conversations">
        <div className="conversations-header">
          <div className="header-content">
            <h2>Messages</h2>
            <div className="connection-status">
              {!isConnected ? (
                <span className="offline">Connecting...</span>
              ) : (
                <span className="online">Online</span>
              )}
            </div>
          </div>
          <div className="conversations-actions">
            <button 
              className="icon-btn" 
              title="Refresh conversations" 
              onClick={fetchOwnerChats}
              disabled={isLoadingChats}
            >
              {isLoadingChats ? <LoadingSpinner /> : <RefreshIcon />}
            </button>
          </div>
        </div>

        <div className="conversations-list">
          {isLoadingChats ? (
            <div className="loading-conversations">
              <div className="loading-spinner"></div>
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="no-conversations">
              <div className="empty-icon">💬</div>
              <h4>No messages yet</h4>
              <p>When clients contact you, conversations will appear here</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${
                  activeConversation?.id === conversation.id ? "active" : ""
                } ${conversation.unreadCount > 0 ? "unread" : ""}`}
                onClick={() => loadChat(conversation.id)}
              >
                <div className="conversation-avatar">
                  <img src={conversation.user.avatar} alt={conversation.user.name} />
                  {conversation.unreadCount > 0 && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h4>{conversation.user.name}</h4>
                    <span className="conversation-time">{conversation.timestamp}</span>
                  </div>
                  
                  <div className="conversation-preview">
                    <p className="property-title">
                      {conversation.property?.title || "Property"}
                    </p>
                    <div className="preview-bottom">
                      <span className="last-message">{conversation.lastMessage}</span>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">{conversation.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Chat */}
      {activeConversation ? (
        <div className="active-chat">
          <div className="chat-header">
            <div className="chat-user">
              <div className="user-avatar">
                <img src={activeConversation.user.avatar} alt={activeConversation.user.name} />
              </div>
              <div className="user-info">
                <h3>{activeConversation.user.name}</h3>
                <span className="user-status">
                  Interested in: {activeConversation.property?.title}
                </span>
              </div>
            </div>
            
            <div className="chat-actions">
              <button 
                className="icon-btn close-btn" 
                onClick={() => setActiveConversation(null)}
                title="Close chat"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {activeConversation.messages.length === 0 ? (
              <div className="empty-chat">
                <div className="empty-chat-icon">💭</div>
                <h3>No messages yet</h3>
                <p>Start a conversation with {activeConversation.user.name}</p>
              </div>
            ) : (
              activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.isOwn ? "own" : "theirs"}`}
                >
                  <div className="message-bubble">
                    <p>{message.text}</p>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              disabled={isLoading || !isConnected}
            />
            
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isLoading || !isConnected}
            >
              {isLoading ? <LoadingSpinner /> : <SendIcon />}
            </button>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected">
          <div className="no-chat-content">
            <div className="no-chat-icon">📱</div>
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
            {!isConnected && (
              <div className="connection-notice">
                <span className="offline-dot"></span>
                Connecting to chat service...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Icon components
const RefreshIcon = () => <span>🔄</span>;
const CloseIcon = () => <span>×</span>;
const SendIcon = () => <span>➤</span>;
const LoadingSpinner = () => <div className="loading-spinner-small"></div>;

export default Chat;