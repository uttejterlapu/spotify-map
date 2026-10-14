'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MapUser, Track } from '@/types';
import { MessageSquare, Send, X, ExternalLink } from 'lucide-react';

interface ChatDrawerProps {
  currentUser: MapUser;
  users: MapUser[];
  globalMessages: ChatMessage[];
  directMessages: Record<string, ChatMessage[]>;
  onSendGlobalMessage: (text: string, trackAttachment?: Track | null) => void;
  onSendDirectMessage: (recipientId: string, text: string, trackAttachment?: Track | null) => void;
  activeDmUser: MapUser | null;
  onSelectDmUser: (user: MapUser | null) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function ChatDrawer({
  currentUser,
  users,
  globalMessages,
  directMessages,
  onSendGlobalMessage,
  onSendDirectMessage,
  activeDmUser,
  onSelectDmUser,
  isOpen,
  onToggleOpen,
}: ChatDrawerProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'direct'>('global');
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDmUser) {
      setActiveTab('direct');
    }
  }, [activeDmUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [globalMessages, directMessages, activeTab, activeDmUser, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (activeTab === 'global') {
      onSendGlobalMessage(inputVal, currentUser.nowPlaying);
    } else if (activeDmUser && activeDmUser.id !== currentUser.id && !activeDmUser.isSelf) {
      onSendDirectMessage(activeDmUser.id, inputVal, currentUser.nowPlaying);
    }

    setInputVal('');
  };

  const currentDmMessages = activeDmUser ? directMessages[activeDmUser.id] || [] : [];
  const otherUsers = users.filter((u) => u.id !== currentUser.id && !u.isSelf);

  return (
    <>
      {/* Floating Button when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          className="spotify-card"
          style={{
            position: 'absolute',
            bottom: '86px',
            right: '16px',
            zIndex: 35,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          }}
        >
          <MessageSquare size={15} color="#1db954" />
          <span>Chat</span>
          {globalMessages.length > 0 && (
            <span
              style={{
                background: '#1db954',
                color: '#000',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '8px',
              }}
            >
              {globalMessages.length}
            </span>
          )}
        </button>
      )}

      {/* Clean Chat Card when open */}
      {isOpen && (
        <div
          className="spotify-card"
          style={{
            position: 'absolute',
            bottom: '86px',
            right: '16px',
            width: '320px',
            maxHeight: '440px',
            height: '420px',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid #27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#121214',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setActiveTab('global')}
                style={{
                  background: activeTab === 'global' ? '#27272a' : 'transparent',
                  color: activeTab === 'global' ? '#fff' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Global
              </button>
              <button
                onClick={() => setActiveTab('direct')}
                style={{
                  background: activeTab === 'direct' ? '#27272a' : 'transparent',
                  color: activeTab === 'direct' ? '#fff' : '#a1a1aa',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Direct
              </button>
            </div>

            <button
              onClick={onToggleOpen}
              style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Global Chat View */}
          {activeTab === 'global' && (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {globalMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
                  No messages yet. Say hello to everyone on the map!
                </div>
              ) : (
                globalMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: '#71717a' }}>
                        {isMe ? 'You' : msg.senderName} {msg.senderCity ? `• ${msg.senderCity}` : ''}
                      </span>
                      <div
                        style={{
                          background: isMe ? '#1db954' : '#27272a',
                          color: isMe ? '#000' : '#fff',
                          padding: '7px 11px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          maxWidth: '85%',
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.text}

                        {/* Shared Track Card */}
                        {msg.trackAttachment && (
                          <div
                            style={{
                              marginTop: '6px',
                              padding: '6px 8px',
                              background: isMe ? 'rgba(0,0,0,0.15)' : '#18181b',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            {msg.trackAttachment.albumArt && (
                              <img
                                src={msg.trackAttachment.albumArt}
                                alt=""
                                style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                              />
                            )}
                            <div style={{ flex: 1, minWidth: 0, fontSize: '11px' }}>
                              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {msg.trackAttachment.title}
                              </div>
                              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                {msg.trackAttachment.artist}
                              </div>
                            </div>
                            {msg.trackAttachment.spotifyUrl && (
                              <a
                                href={msg.trackAttachment.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'inherit' }}
                              >
                                <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Direct Chat View */}
          {activeTab === 'direct' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {!activeDmUser ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '4px' }}>
                    Select a listener to chat directly:
                  </div>
                  {otherUsers.length === 0 ? (
                    <div style={{ color: '#71717a', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
                      No other active listeners online right now. Share the link with friends to chat!
                    </div>
                  ) : (
                    otherUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => onSelectDmUser(user)}
                        className="secondary-btn"
                        style={{
                          justifyContent: 'flex-start',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1db954' }} />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: '10px', color: '#71717a' }}>{user.location.city}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Recipient Header */}
                  <div
                    style={{
                      padding: '8px 12px',
                      background: '#121214',
                      borderBottom: '1px solid #27272a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                    }}
                  >
                    <div>
                      <button
                        onClick={() => onSelectDmUser(null)}
                        style={{ background: 'none', border: 'none', color: '#1db954', cursor: 'pointer', marginRight: '6px' }}
                      >
                        ←
                      </button>
                      <span style={{ fontWeight: 600 }}>{activeDmUser.name}</span>
                    </div>
                    {activeDmUser.nowPlaying && (
                      <span style={{ color: '#71717a', fontSize: '10px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        ♫ {activeDmUser.nowPlaying.title}
                      </span>
                    )}
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentDmMessages.length === 0 ? (
                      <div style={{ margin: 'auto', textAlign: 'center', color: '#71717a', fontSize: '12px' }}>
                        Send a message to {activeDmUser.name}
                      </div>
                    ) : (
                      currentDmMessages.map((msg) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                          <div
                            key={msg.id}
                            style={{
                              alignSelf: isMe ? 'flex-end' : 'flex-start',
                              background: isMe ? '#1db954' : '#27272a',
                              color: isMe ? '#000' : '#fff',
                              padding: '7px 11px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              maxWidth: '85%',
                            }}
                          >
                            {msg.text}
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '8px 12px',
              borderTop: '1px solid #27272a',
              background: '#121214',
              display: 'flex',
              gap: '6px',
            }}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={activeTab === 'global' ? 'Send a message...' : `Message ${activeDmUser?.name || 'user'}...`}
              style={{
                flex: 1,
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              className="spotify-btn"
              style={{ padding: '6px 12px', borderRadius: '8px' }}
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
