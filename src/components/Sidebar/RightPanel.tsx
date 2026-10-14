'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MapUser, Track } from '@/types';
import {
  MessageSquare,
  Send,
  X,
  ExternalLink,
  Users,
  Compass,
  Radio,
  Music,
  MapPin,
  ChevronLeft,
  Share2,
  Ghost,
} from 'lucide-react';

interface RightPanelProps {
  currentUser: MapUser;
  users: MapUser[];
  globalMessages: ChatMessage[];
  directMessages: Record<string, ChatMessage[]>;
  onSendGlobalMessage: (text: string, trackAttachment?: Track | null) => void;
  onSendDirectMessage: (recipientId: string, text: string, trackAttachment?: Track | null) => void;
  activeDmUser: MapUser | null;
  onSelectDmUser: (user: MapUser | null) => void;
  onFlyToUser: (user: MapUser) => void;
  isOpen: boolean;
  onClose: () => void;
  isAnonymous?: boolean;
  onToggleAnonymous?: () => void;
}

export default function RightPanel({
  currentUser,
  users,
  globalMessages,
  directMessages,
  onSendGlobalMessage,
  onSendDirectMessage,
  activeDmUser,
  onSelectDmUser,
  onFlyToUser,
  isOpen,
  onClose,
  isAnonymous = false,
  onToggleAnonymous,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'direct' | 'listeners'>('global');
  const [inputVal, setInputVal] = useState('');
  const [attachCurrentTrack, setAttachCurrentTrack] = useState(false);
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

    const trackToAttach = attachCurrentTrack ? currentUser.nowPlaying : null;

    if (activeTab === 'global') {
      onSendGlobalMessage(inputVal, trackToAttach);
    } else if (activeDmUser && activeDmUser.id !== currentUser.id && !activeDmUser.isSelf) {
      onSendDirectMessage(activeDmUser.id, inputVal, trackToAttach);
    }

    setInputVal('');
    setAttachCurrentTrack(false);
  };

  const otherUsers = users.filter((u) => u.id !== currentUser.id && !u.isSelf);
  const currentDmMessages = activeDmUser ? directMessages[activeDmUser.id] || [] : [];
  const totalListeners = users.length + 1;

  if (!isOpen) return null;

  return (
    <aside
      className="apple-glass right-panel-container"
    >
      {/* Top Header */}
      <div
        style={{
          padding: '16px 18px 12px 18px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--spotify-green)',
                boxShadow: '0 0 10px var(--spotify-green)',
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Live Space
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                background: 'var(--tag-bg)',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid var(--border-glass)',
              }}
            >
              {totalListeners} {totalListeners === 1 ? 'person' : 'people'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="apple-icon-btn"
            style={{ width: '30px', height: '30px' }}
            title="Close sidebar"
          >
            <X size={15} />
          </button>
        </div>

        {/* Apple Segmented Controls */}
        <div className="apple-segmented-container">
          <button
            onClick={() => setActiveTab('global')}
            className={`apple-segmented-item ${activeTab === 'global' ? 'active' : ''}`}
          >
            <MessageSquare size={13} />
            <span>Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('direct')}
            className={`apple-segmented-item ${activeTab === 'direct' ? 'active' : ''}`}
          >
            <Radio size={13} />
            <span>Direct</span>
          </button>

          <button
            onClick={() => setActiveTab('listeners')}
            className={`apple-segmented-item ${activeTab === 'listeners' ? 'active' : ''}`}
          >
            <Users size={13} />
            <span>Listeners</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* TAB 1: Global Feed */}
        {activeTab === 'global' && (
          <div
            style={{
              flex: 1,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {globalMessages.length === 0 ? (
              <div
                style={{
                  margin: 'auto',
                  textAlign: 'center',
                  padding: '30px 20px',
                  color: 'var(--text-muted)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--btn-subtle-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <Music size={18} color="var(--spotify-green)" />
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  No messages yet
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                  Say hello or share what you are listening to with everyone on the map.
                </div>
              </div>
            ) : (
              globalMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isMsgAnon = msg.isAnonymous || msg.senderName === 'Anonymous Listener';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        padding: '0 4px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: isMe
                            ? (isMsgAnon ? '#c084fc' : 'var(--spotify-green)')
                            : (isMsgAnon ? '#d8b4fe' : 'var(--text-secondary)'),
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isMe ? (isMsgAnon ? 'You (Ghost)' : 'You') : msg.senderName}
                        {isMsgAnon && <Ghost size={11} color="#c084fc" />}
                      </span>
                      {msg.senderCity && <span>• {msg.senderCity}</span>}
                    </div>

                    {/* Apple Style Message Bubble */}
                    <div
                      style={{
                        background: isMe
                          ? (isMsgAnon
                            ? 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)'
                            : 'linear-gradient(135deg, #1db954 0%, #179e46 100%)')
                          : 'var(--card-bg)',
                        color: isMe ? (isMsgAnon ? '#ffffff' : '#000000') : 'var(--text-primary)',
                        padding: '10px 14px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        fontSize: '13px',
                        lineHeight: '1.45',
                        maxWidth: '85%',
                        wordBreak: 'break-word',
                        border: isMe ? 'none' : '1px solid var(--border-glass)',
                        boxShadow: isMe
                          ? (isMsgAnon
                            ? '0 4px 14px rgba(168, 85, 247, 0.3)'
                            : '0 4px 14px rgba(29, 185, 84, 0.25)')
                          : 'none',
                      }}
                    >
                      <div style={{ fontWeight: isMe ? 500 : 400 }}>{msg.text}</div>

                      {/* Attached Track Card (Apple Music Style) */}
                      {msg.trackAttachment && (
                        <div
                          style={{
                            marginTop: '8px',
                            padding: '8px 10px',
                            background: isMe ? 'rgba(0, 0, 0, 0.16)' : 'var(--btn-subtle-bg)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: `1px solid ${isMe ? 'rgba(0, 0, 0, 0.1)' : 'var(--border-glass)'}`,
                          }}
                        >
                          {msg.trackAttachment.albumArt ? (
                            <img
                              src={msg.trackAttachment.albumArt}
                              alt=""
                              style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'var(--btn-subtle-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Music size={16} />
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0, fontSize: '12px' }}>
                            <div
                              style={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {msg.trackAttachment.title}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {msg.trackAttachment.artist}
                            </div>
                          </div>

                          {msg.trackAttachment.spotifyUrl && (
                            <a
                              href={msg.trackAttachment.spotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: 'inherit', padding: '4px' }}
                              title="Play on Spotify"
                            >
                              <ExternalLink size={14} />
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

        {/* TAB 2: Direct Messages */}
        {activeTab === 'direct' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!activeDmUser ? (
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Choose someone to chat with
                </div>

                {otherUsers.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                    }}
                  >
                    <Users size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                    <div>No other active listeners online right now.</div>
                    <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.7 }}>
                      Share your link with a friend to test real-time 1:1 chat!
                    </div>
                  </div>
                ) : (
                  otherUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => onSelectDmUser(user)}
                      className="airbnb-card"
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt=""
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: 'var(--btn-subtle-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: '13px',
                                color: 'var(--spotify-green)',
                              }}
                            >
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '0',
                              right: '0',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'var(--spotify-green)',
                              border: '2px solid var(--panel-solid)',
                            }}
                          />
                        </div>

                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {user.location.city || 'Worldwide'}
                          </div>
                        </div>
                      </div>

                      {user.nowPlaying && (
                        <div
                          style={{
                            maxWidth: '120px',
                            textAlign: 'right',
                            fontSize: '11px',
                            color: 'var(--spotify-green)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ♫ {user.nowPlaying.title}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* DM Recipient Top Header */}
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--card-bg)',
                  }}
                >
                  <button
                    onClick={() => onSelectDmUser(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{activeDmUser.name}</span>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: 'var(--spotify-green)',
                      }}
                    />
                  </div>

                  <button
                    onClick={() => onFlyToUser(activeDmUser)}
                    className="apple-pill-btn"
                    style={{ padding: '4px 10px', fontSize: '11px' }}
                    title="Find on Map"
                  >
                    <Compass size={12} />
                    <span>Locate</span>
                  </button>
                </div>

                {/* Direct Messages List */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {currentDmMessages.length === 0 ? (
                    <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      Start a private chat with {activeDmUser.name}.
                    </div>
                  ) : (
                    currentDmMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                            background: isMe
                              ? 'linear-gradient(135deg, #1db954 0%, #179e46 100%)'
                              : 'var(--card-bg)',
                            color: isMe ? '#000000' : 'var(--text-primary)',
                            padding: '9px 13px',
                            borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            fontSize: '13px',
                            maxWidth: '85%',
                            wordBreak: 'break-word',
                            border: isMe ? 'none' : '1px solid var(--border-glass)',
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

        {/* TAB 3: Active Listeners (Airbnb Style Directory) */}
        {activeTab === 'listeners' && (
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Active on Map ({totalListeners})
            </div>

            {/* Self Card */}
            <div
              className="airbnb-card"
              style={{
                padding: '12px 14px',
                border: '1px solid rgba(29, 185, 84, 0.3)',
                background: 'rgba(29, 185, 84, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt=""
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(29, 185, 84, 0.2)',
                        color: 'var(--spotify-green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '12px',
                      }}
                    >
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {currentUser.name} <span style={{ fontSize: '10px', color: 'var(--spotify-green)' }}>(You)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      <MapPin size={10} color="var(--spotify-green)" />
                      <span>{currentUser.location.city}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onFlyToUser(currentUser)}
                  className="apple-pill-btn"
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  <Compass size={12} />
                  <span>Center</span>
                </button>
              </div>

              {currentUser.nowPlaying && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    background: 'var(--btn-subtle-bg)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                >
                  <Music size={12} color="var(--spotify-green)" />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.nowPlaying.title}</span>
                  <span style={{ color: 'var(--text-muted)' }}>• {currentUser.nowPlaying.artist}</span>
                </div>
              )}
            </div>

            {/* Other Listeners */}
            {otherUsers.map((user) => {
              const isUserAnon = user.isAnonymous || user.name === 'Anonymous Listener';
              return (
                <div key={user.id} className="airbnb-card" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isUserAnon ? (
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ghost size={16} color="#c084fc" />
                        </div>
                      ) : user.avatar ? (
                        <img
                          src={user.avatar}
                          alt=""
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--btn-subtle-bg)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-glass)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                            {isUserAnon ? 'Anonymous Listener' : user.name}
                          </span>
                          {isUserAnon && (
                            <span
                              style={{
                                fontSize: '9px',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                background: 'rgba(168, 85, 247, 0.2)',
                                color: '#d8b4fe',
                                fontWeight: 600,
                              }}
                            >
                              Ghost
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <MapPin size={10} color="var(--spotify-green)" />
                          <span>{user.location.city}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => onFlyToUser(user)}
                        className="apple-icon-btn"
                        style={{ width: '28px', height: '28px' }}
                        title="Fly to user on map"
                      >
                        <Compass size={13} />
                      </button>
                      <button
                        onClick={() => {
                          onSelectDmUser(user);
                          setActiveTab('direct');
                        }}
                        className="apple-icon-btn"
                        style={{ width: '28px', height: '28px', color: 'var(--spotify-green)' }}
                        title="Direct message"
                      >
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>

                  {user.nowPlaying ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        background: 'var(--btn-subtle-bg)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    >
                      <Music size={12} color="var(--spotify-green)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.nowPlaying.title}
                      </span>
                      <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        • {user.nowPlaying.artist}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Idle / not currently streaming
                    </div>
                  )}
                </div>
              )
            })}

            {/* Legal Links & Spotify Disclaimer Footer */}
            <div
              style={{
                marginTop: '16px',
                padding: '16px 12px 10px 12px',
                borderTop: '1px solid var(--border-glass)',
                textAlign: 'center',
                fontSize: '11px',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  Privacy Policy
                </a>
                <span>•</span>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
                >
                  Terms of Service
                </a>
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                Spotify Map is an independent application and is not affiliated with or endorsed by Spotify AB.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form (for Global and Direct tabs) */}
      {(activeTab === 'global' || (activeTab === 'direct' && activeDmUser)) && (
        <form
          onSubmit={handleSend}
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-glass)',
            background: 'var(--chat-bar-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Quick attach current track pill & Anonymity toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            {currentUser.nowPlaying ? (
              <button
                type="button"
                onClick={() => setAttachCurrentTrack(!attachCurrentTrack)}
                style={{
                  background: attachCurrentTrack ? 'rgba(29, 185, 84, 0.15)' : 'var(--btn-subtle-bg)',
                  border: `1px solid ${attachCurrentTrack ? 'var(--spotify-green)' : 'var(--border-glass)'}`,
                  color: attachCurrentTrack ? 'var(--spotify-green)' : 'var(--text-secondary)',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  maxWidth: '210px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                <Share2 size={11} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {attachCurrentTrack ? 'Attached: ' : 'Attach: '}♫ {currentUser.nowPlaying.title}
                </span>
              </button>
            ) : <div />}

            {/* Quick Anonymous Mode toggle */}
            <button
              type="button"
              onClick={onToggleAnonymous}
              style={{
                background: isAnonymous ? 'rgba(168, 85, 247, 0.15)' : 'var(--btn-subtle-bg)',
                border: `1px solid ${isAnonymous ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-glass)'}`,
                color: isAnonymous ? '#c084fc' : 'var(--text-secondary)',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              title={
                isAnonymous
                  ? 'Posting as Anonymous Listener (Ghost Mode). Click to post with your real name.'
                  : 'Posting with your public profile. Click to post anonymously.'
              }
            >
              <Ghost size={11} color={isAnonymous ? '#c084fc' : 'var(--text-muted)'} />
              <span>{isAnonymous ? 'Ghost Mode' : 'Public'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                activeTab === 'global'
                  ? (isAnonymous ? 'Message everyone as Anonymous...' : 'Message everyone on map...')
                  : `Message ${activeDmUser?.name}...`
              }
              style={{
                flex: 1,
                background: 'var(--input-bg)',
                border: '1px solid var(--border-glass)',
                borderRadius: '9999px',
                padding: '10px 16px',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--border-glass-strong)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-glass)')}
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputVal.trim() ? 'var(--spotify-green)' : 'var(--btn-subtle-bg)',
                color: inputVal.trim() ? '#000000' : 'var(--text-muted)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'all 0.2s var(--apple-ease)',
                boxShadow: inputVal.trim() ? '0 4px 12px var(--spotify-green-glow)' : 'none',
              }}
            >
              <Send size={15} style={{ marginLeft: inputVal.trim() ? '2px' : '0' }} />
            </button>
          </div>
        </form>
      )}
    </aside>
  );
}
