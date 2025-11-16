import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Send, Users, Search, Smile, Paperclip, Phone, Video, Info, LogOut, User, Copy, Check } from 'lucide-react';
import io from 'socket.io-client';

const BACKEND_URL = 'https://notebot-d51g.onrender.com';

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  const [tempName, setTempName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatId, setChatId] = useState(id || '');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [chatLink, setChatLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [connected, setConnected] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Set chatId from URL params
  useEffect(() => {
    if (id) {
      setChatId(id);
    }
  }, [id]);

  // Check for stored username
  useEffect(() => {
    const storedName = localStorage.getItem('notebot_username');
    if (storedName && chatId) {
      setUserName(storedName);
      setTempName(storedName);
      setIsNameSet(true);
    }
  }, [chatId]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (chatId && userName && isNameSet) {
      socketRef.current = io(BACKEND_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('✅ Connected to server');
        setConnected(true);
        
        // Join chat room
        socket.emit('join_chat', { chatId, name: userName });
      });

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        setConnected(false);
      });

      // Load existing messages
      socket.on('load_messages', (loadedMessages) => {
        console.log('📥 Loaded messages:', loadedMessages);
        const formattedMessages = loadedMessages.map(msg => ({
          ...msg,
          isOwn: msg.name === userName,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        }));
        setMessages(formattedMessages);
      });

      // Receive new message
      socket.on('receive_message', (message) => {
        console.log('📨 New message:', message);
        const formattedMessage = {
          ...message,
          isOwn: message.name === userName,
          timestamp: new Date(message.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };
        setMessages(prev => [...prev, formattedMessage]);
      });

      // User joined
      socket.on('user_joined', ({ user, userCount }) => {
        console.log('👋 User joined:', user.name);
        if (user.name !== userName) {
          const joinMessage = {
            name: 'System',
            message: `${user.name} joined the chat`,
            timestamp: new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isSystem: true
          };
          setMessages(prev => [...prev, joinMessage]);
        }
      });

      // User left
      socket.on('user_left', ({ user, userCount }) => {
        console.log('👋 User left:', user.name);
        const leaveMessage = {
          name: 'System',
          message: `${user.name} left the chat`,
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isSystem: true
        };
        setMessages(prev => [...prev, leaveMessage]);
      });

      // Update user list
      socket.on('update_users', (users) => {
        console.log('👥 Updated users:', users);
        const formattedUsers = users
          .filter(u => u.name !== userName)
          .map(u => ({
            ...u,
            status: 'online'
          }));
        setOnlineUsers(formattedUsers);
      });

      // Typing indicators
      socket.on('user_typing', ({ name }) => {
        setTypingUser(name);
        setIsTyping(true);
      });

      socket.on('user_stop_typing', () => {
        setIsTyping(false);
        setTypingUser('');
      });

      // Error handling
      socket.on('error', ({ message }) => {
        console.error('❌ Socket error:', message);
        alert(message);
        if (message.includes('expired') || message.includes('not found')) {
          navigate('/chat');
        }
      });

      socket.on('chat_closed', ({ message }) => {
        alert(message);
        handleLogout();
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [chatId, userName, isNameSet]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create new chat
  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setChatLink(data.chatLink);
        console.log('✅ Chat created:', data.chatId);
      } else {
        alert('Failed to create chat. Please try again.');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Failed to connect to server. Please try again.');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(chatLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem('notebot_username', tempName.trim());
      setUserName(tempName.trim());
      setIsNameSet(true);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current && connected) {
      socketRef.current.emit('send_message', {
        chatId,
        message: newMessage.trim()
      });
      setNewMessage('');
      
      // Stop typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socketRef.current.emit('stop_typing', { chatId });
    }
  };

  const handleTyping = () => {
    if (socketRef.current && connected) {
      socketRef.current.emit('typing', { chatId, name: userName });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('stop_typing', { chatId });
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('notebot_username');
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    setUserName('');
    setIsNameSet(false);
    setMessages([]);
    setOnlineUsers([]);
    navigate('/chat');
  };

  // Initial screen - Create or Join Chat
  if (!chatId) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans p-6" style={{ background: '#0A0A1F' }}>
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #00FFFF, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #A020F0, transparent)' }} />

        <div 
          className="relative z-10 w-full max-w-md rounded-2xl p-8"
          style={{
            background: '#181836',
            border: '1px solid rgba(0,255,255,0.2)',
            boxShadow: '0 0 40px rgba(0,255,255,0.1)'
          }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles size={40} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
              <h1 className="text-3xl font-bold" style={{color: "white"}}>NoteBot Chat</h1>
            </div>
            <p style={{ color: '#8C8CA8' }}>Create a temporary study group chat</p>
          </div>

          {!chatLink ? (
            <button
              onClick={handleCreateChat}
              disabled={isCreatingChat}
              className="w-full py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50"
              style={{
                background: '#00FFFF',
                color: '#0A0A1F',
                boxShadow: '0 0 20px rgba(0,255,255,0.4)'
              }}>
              {isCreatingChat ? 'Creating Chat...' : 'Create New Chat'}
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#8C8CA8' }}>
                  Share this link with your study group:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatLink}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-lg outline-none"
                    style={{
                      background: '#0A0A1F',
                      color: '#F5F5F5',
                      border: '2px solid rgba(0,255,255,0.3)'
                    }}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-3 rounded-lg transition-all hover:scale-105"
                    style={{
                      background: copied ? '#00FF88' : 'rgba(0,255,255,0.2)',
                      color: copied ? '#0A0A1F' : '#00FFFF',
                      border: '2px solid ' + (copied ? '#00FF88' : '#00FFFF')
                    }}>
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: '#8C8CA8' }}>
                💡 Chat expires in 48 hours
              </p>

              <button
                onClick={() => {
                  window.location.href = chatLink;
                }}
                className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: '#A020F0',
                  color: '#F5F5F5',
                  boxShadow: '0 0 20px rgba(160,32,240,0.4)'
                }}>
                Join Chat Now
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }
        `}</style>
      </div>
    );
  }

  // Name Entry Modal
  if (!isNameSet) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans p-6" style={{ background: '#0A0A1F' }}>
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }} />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #00FFFF, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
             style={{ background: 'radial-gradient(circle, #A020F0, transparent)' }} />

        <div 
          className="relative z-10 w-full max-w-md rounded-2xl p-8"
          style={{
            background: '#181836',
            border: '1px solid rgba(0,255,255,0.2)',
            boxShadow: '0 0 40px rgba(0,255,255,0.1)'
          }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles size={40} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_12px_rgba(0,255,255,0.6)]" />
              <h1 className="text-3xl font-bold" style={{color: "white"}}>NoteBot Chat</h1>
            </div>
            <p style={{ color: '#8C8CA8' }}>Enter your name to join the study group</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#8C8CA8' }}>
                Your Name
              </label>
              <div className="relative">
                <User 
                  size={20} 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  style={{ color: '#8C8CA8' }} />
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
                  style={{
                    background: '#0A0A1F',
                    color: '#F5F5F5',
                    border: '2px solid rgba(0,255,255,0.3)'
                  }}
                  autoFocus
                />
              </div>
            </div>

            <button
              onClick={handleNameSubmit}
              disabled={!tempName.trim()}
              className="w-full py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: '#00FFFF',
                color: '#0A0A1F',
                boxShadow: '0 0 20px rgba(0,255,255,0.4)'
              }}>
              Join Chat
            </button>
          </div>
        </div>

        <style>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }
        `}</style>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="h-screen flex font-sans" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      {/* Left Sidebar - Users List */}
      <div 
        className="w-80 flex flex-col border-r"
        style={{ background: '#181836', borderColor: 'rgba(0,255,255,0.2)' }}>
        
        <div className="p-6 border-b" style={{ borderColor: 'rgba(0,255,255,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles size={28} style={{ color: '#00FFFF' }} className="drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
              <h2 className="text-xl font-bold">Study Group</h2>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'rgba(255,100,100,0.1)', color: '#ff6464' }}
              title="Logout">
              <LogOut size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-3"
               style={{ background: connected ? 'rgba(0,255,136,0.1)' : 'rgba(255,100,100,0.1)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: connected ? '#00FF88' : '#ff6464' }} />
            <span className="text-xs" style={{ color: connected ? '#00FF88' : '#ff6464' }}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: '#0A0A1F' }}>
            <Search size={16} style={{ color: '#8C8CA8' }} />
            <input 
              placeholder="Search users..."
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: '#F5F5F5' }}
            />
          </div>
        </div>

        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,255,255,0.2)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{ background: 'linear-gradient(135deg, #00FFFF, #A020F0)' }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{userName}</p>
              <p className="text-xs flex items-center gap-1" style={{ color: '#00FFFF' }}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                Online (You)
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Users size={16} style={{ color: '#8C8CA8' }} />
            <span className="text-sm font-semibold" style={{ color: '#8C8CA8' }}>
              ONLINE — {onlineUsers.length}
            </span>
          </div>

          <div className="space-y-2">
            {onlineUsers.map((user, index) => (
              <div 
                key={user.socketId || index}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:translate-x-1"
                style={{ background: 'rgba(0,255,255,0.05)' }}>
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: user.avatarColor, color: '#0A0A1F' }}>
                    {user.avatar}
                  </div>
                  <div 
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{ 
                      background: '#00FF88',
                      borderColor: '#181836'
                    }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs" style={{ color: '#8C8CA8' }}>Online</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div 
          className="h-16 px-6 flex items-center justify-between border-b"
          style={{ background: '#181836', borderColor: 'rgba(0,255,255,0.2)' }}>
          <div>
            <h3 className="font-bold text-lg">General Discussion</h3>
            <p className="text-xs" style={{ color: '#8C8CA8' }}>
              {onlineUsers.length + 1} members online
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF' }}
              title="Voice Call">
              <Phone size={20} />
            </button>
            <button 
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'rgba(0,255,255,0.1)', color: '#00FFFF' }}
              title="Video Call">
              <Video size={20} />
            </button>
            <button 
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: 'rgba(140,140,168,0.1)', color: '#8C8CA8' }}
              title="Info">
              <Info size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            message.isSystem ? (
              <div key={index} className="flex justify-center">
                <span className="text-xs px-3 py-1 rounded-full" 
                      style={{ background: 'rgba(140,140,168,0.2)', color: '#8C8CA8' }}>
                  {message.message}
                </span>
              </div>
            ) : (
              <div 
                key={index}
                className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {!message.isOwn && (
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ 
                      background: message.avatarColor || '#8C8CA8',
                      color: '#0A0A1F'
                    }}>
                    {message.avatar || message.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-md`}>
                  {!message.isOwn && (
                    <span className="text-xs font-semibold mb-1 px-2" style={{ color: '#8C8CA8' }}>
                      {message.name}
                    </span>
                  )}
                  <div 
                    className="rounded-2xl px-4 py-3"
                    style={{
                      background: message.isOwn 
                        ? 'linear-gradient(135deg, #00FFFF, #A020F0)' 
                        : '#181836',
                      color: message.isOwn ? '#0A0A1F' : '#F5F5F5'
                    }}>
                    <p className="leading-relaxed">{message.message}</p>
                  </div>
                  <span className="text-xs mt-1 px-2" style={{ color: '#8C8CA8' }}>
                    {message.timestamp}
                  </span>
                </div>
              </div>
            )
          ))}
          
          {isTyping && typingUser && (
            <div className="flex gap-3">
              <div className="text-xs" style={{ color: '#8C8CA8' }}>
                {typingUser} is typing...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div 
          className="p-4 border-t"
          style={{ background: '#181836', borderColor: 'rgba(0,255,255,0.2)' }}>
          <div className="flex items-end gap-3">
            <button 
              className="p-3 rounded-lg transition-all hover:scale-110 flex-shrink-0"
              style={{ background: 'rgba(140,140,168,0.1)', color: '#8C8CA8' }}>
              <Paperclip size={20} />
            </button>

            <div 
              className="flex-1 rounded-lg p-3 flex items-end gap-2"
              style={{ background: '#0A0A1F' }}>
              <textarea
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows="1"
                className="flex-1 bg-transparent outline-none resize-none"
                style={{ color: '#F5F5F5', maxHeight: '120px' }}
              />
              <button 
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ color: '#8C8CA8' }}>
                <Smile size={20} />
              </button>
            </div>

            <button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !connected}
              className="p-3 rounded-lg transition-all hover:scale-110 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: (newMessage.trim() && connected) ? '#00FFFF' : 'rgba(0,255,255,0.2)',
                color: (newMessage.trim() && connected) ? '#0A0A1F' : '#00FFFF',
                boxShadow: (newMessage.trim() && connected) ? '0 0 20px rgba(0,255,255,0.4)' : 'none'
              }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #00FFFF #181836;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: #181836;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #00FFFF;
          border-radius: 4px;
        }

        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;