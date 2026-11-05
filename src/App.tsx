/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CircleDashed,
  Phone,
  Search,
  Plus,
  Pin,
  Check,
  CheckCheck,
  Mic,
  Image as ImageIcon,
  Film,
  Sparkles,
  PhoneCall,
  Video,
  Filter,
  Globe,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import {
  ChatThread,
  ChatMessage,
  Contact,
  Language,
  NavTab,
  UserProfile,
  StatusStory,
  CallLogItem,
  ActiveCall,
} from './types';
import {
  CURRENT_USER,
  INITIAL_CONTACTS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STORIES,
  INITIAL_CALL_LOGS,
} from './data/initialData';
import { translations, MOCK_BOT_REPLIES } from './utils/translations';
import { sounds } from './utils/soundEffects';
import { SidebarNavigation } from './components/SidebarNavigation';
import { ChatView } from './components/ChatView';
import { StatusStories } from './components/StatusStories';
import { CallsList } from './components/CallsList';
import { CallModal } from './components/CallModal';
import { IncomingCallModal } from './components/IncomingCallModal';
import { MediaViewer } from './components/MediaViewer';
import { AuthScreen } from './components/AuthScreen';
import { NewChatModal } from './components/NewChatModal';
import { NewGroupModal } from './components/NewGroupModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // App Navigation & Language State
  const [currentLang, setCurrentLang] = useState<Language>(currentUser.language || 'bn');
  const [activeTab, setActiveTab] = useState<NavTab>('chats');
  const [selectedChatId, setSelectedChatId] = useState<string | null>('chat_rahul');

  // Messenger Data States
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [stories, setStories] = useState<StatusStory[]>(INITIAL_STORIES);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(INITIAL_CALL_LOGS);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'pinned'>('all');

  // Modals & Overlays State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Media Viewer State
  const [activeMedia, setActiveMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    caption?: string;
  } | null>(null);

  // Active Calling State
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<ActiveCall | null>(null);

  const t = translations[currentLang];

  // Sync user profile language if changed
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    setCurrentUser((prev) => ({ ...prev, language: lang }));
  };

  // Compute unread counts for badges
  const unreadCounts = useMemo(() => {
    let chatsUnread = 0;
    let groupsUnread = 0;

    chats.forEach((c) => {
      if (c.isGroup) {
        groupsUnread += c.unreadCount || 0;
      } else {
        chatsUnread += c.unreadCount || 0;
      }
    });

    const unseenStories = stories.filter((s) => !s.seen).length;
    const missedCalls = callLogs.filter((l) => l.direction === 'missed').length;

    return {
      chats: chatsUnread,
      groups: groupsUnread,
      stories: unseenStories,
      calls: missedCalls,
    };
  }, [chats, stories, callLogs]);

  // Filtered threads depending on active navigation tab (Chats vs Groups)
  const displayedThreads = useMemo(() => {
    return chats.filter((c) => {
      // Tab separation: chats tab shows direct messages, groups tab shows group chats
      if (activeTab === 'chats' && c.isGroup) return false;
      if (activeTab === 'groups' && !c.isGroup) return false;

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = c.name.toLowerCase().includes(q);
        const lastMsgMatch = c.lastMessage?.text.toLowerCase().includes(q);
        if (!nameMatch && !lastMsgMatch) return false;
      }

      // Filter pills
      if (filterType === 'unread' && (!c.unreadCount || c.unreadCount === 0)) return false;
      if (filterType === 'pinned' && !c.isPinned) return false;

      return true;
    });
  }, [chats, activeTab, searchQuery, filterType]);

  // Selected chat entity and recipient contact
  const selectedChat = useMemo(() => {
    return chats.find((c) => c.id === selectedChatId) || null;
  }, [chats, selectedChatId]);

  const selectedContact = useMemo(() => {
    if (!selectedChat || selectedChat.isGroup) return undefined;
    const recipientId = selectedChat.participants.find((p) => p !== currentUser.id);
    return contacts.find((c) => c.id === recipientId);
  }, [selectedChat, contacts, currentUser.id]);

  // Handle Send Message with automatic friendly reply simulation
  const handleSendMessage = (newMsgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newId = `m_${Date.now()}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      ...newMsgData,
      id: newId,
      timestamp: timeString,
      status: 'sent',
    };

    // Append to messages
    setMessages((prev) => ({
      ...prev,
      [newMsgData.chatId]: [...(prev[newMsgData.chatId] || []), newMsg],
    }));

    // Update last message on thread
    setChats((prev) =>
      prev.map((thread) => {
        if (thread.id === newMsgData.chatId) {
          return {
            ...thread,
            lastMessage: newMsg,
          };
        }
        return thread;
      })
    );

    // Friend Auto-Reply Simulation after 1.5 seconds
    if (!selectedChat?.isGroup && selectedContact) {
      setTimeout(() => {
        sounds.playReceived();
        const replyPool = MOCK_BOT_REPLIES[currentLang] || MOCK_BOT_REPLIES['en'];
        const randomReply = replyPool[Math.floor(Math.random() * replyPool.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const botMsg: ChatMessage = {
          id: `reply_${Date.now()}`,
          chatId: newMsgData.chatId,
          senderId: selectedContact.id,
          senderName: selectedContact.name,
          text: randomReply,
          textBn: currentLang === 'bn' ? randomReply : undefined,
          textHi: currentLang === 'hi' ? randomReply : undefined,
          timestamp: replyTime,
          status: 'read',
          type: 'text',
        };

        setMessages((prev) => ({
          ...prev,
          [newMsgData.chatId]: [...(prev[newMsgData.chatId] || []), botMsg],
        }));

        setChats((prev) =>
          prev.map((thread) => {
            if (thread.id === newMsgData.chatId) {
              return {
                ...thread,
                lastMessage: botMsg,
              };
            }
            return thread;
          })
        );
      }, 1600);
    }
  };

  // Toggle emoji reactions
  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!selectedChatId) return;

    setMessages((prev) => {
      const chatMsgs = prev[selectedChatId] || [];
      const updated = chatMsgs.map((m) => {
        if (m.id !== messageId) return m;

        const currentReactions = { ...(m.reactions || {}) };
        const users = currentReactions[emoji] || [];
        const userName = currentUser.name;

        if (users.includes(userName)) {
          // Remove reaction
          const remainingUsers = users.filter((u) => u !== userName);
          if (remainingUsers.length === 0) {
            delete currentReactions[emoji];
          } else {
            currentReactions[emoji] = remainingUsers;
          }
        } else {
          // Add reaction
          currentReactions[emoji] = [...users, userName];
        }

        return {
          ...m,
          reactions: currentReactions,
        };
      });

      return {
        ...prev,
        [selectedChatId]: updated,
      };
    });
  };

  // Start Call Handler
  const handleStartCall = (type: 'audio' | 'video', contact: Contact) => {
    setActiveCall({
      active: true,
      isIncoming: false,
      contact,
      callType: type,
      status: 'ringing',
      durationSec: 0,
      isMuted: false,
      isCameraOff: false,
      isSpeakerOn: true,
    });
  };

  // Simulate Incoming Call Handler
  const handleSimulateIncoming = (contact: Contact, type: 'audio' | 'video') => {
    setIncomingCall({
      active: true,
      isIncoming: true,
      contact,
      callType: type,
      status: 'ringing',
      durationSec: 0,
      isMuted: false,
      isCameraOff: false,
      isSpeakerOn: true,
    });
  };

  // Accept Incoming Call
  const handleAcceptIncomingCall = () => {
    if (!incomingCall) return;
    const callToConnect: ActiveCall = {
      ...incomingCall,
      isIncoming: false,
      status: 'connected',
    };
    setIncomingCall(null);
    setActiveCall(callToConnect);
  };

  // Decline Incoming Call
  const handleDeclineIncomingCall = () => {
    if (incomingCall) {
      // Add missed call log
      const newLog: CallLogItem = {
        id: `call_${Date.now()}`,
        contact: incomingCall.contact,
        type: incomingCall.callType,
        direction: 'missed',
        timestamp: 'Just now',
        durationSec: 0,
      };
      setCallLogs((prev) => [newLog, ...prev]);
    }
    setIncomingCall(null);
  };

  // End Active Call
  const handleEndCall = () => {
    if (activeCall) {
      const newLog: CallLogItem = {
        id: `call_${Date.now()}`,
        contact: activeCall.contact,
        type: activeCall.callType,
        direction: 'outgoing',
        timestamp: 'Just now',
        durationSec: activeCall.durationSec,
      };
      setCallLogs((prev) => [newLog, ...prev]);
    }
    setActiveCall(null);
  };

  // Create New Group
  const handleCreateGroup = (name: string, participantIds: string[], description?: string) => {
    const newGroupId = `chat_group_${Date.now()}`;
    const newGroup: ChatThread = {
      id: newGroupId,
      isGroup: true,
      name,
      avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80',
      participants: [currentUser.id, ...participantIds],
      adminIds: [currentUser.id],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      description,
      lastMessage: {
        id: `m_${Date.now()}`,
        chatId: newGroupId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: currentLang === 'bn' ? `গ্রুপ "${name}" তৈরি করা হয়েছে` : currentLang === 'hi' ? `ग्रुप "${name}" बनाया गया` : `Group "${name}" created`,
        timestamp: 'Just now',
        status: 'read',
        type: 'text',
      },
    };

    setChats((prev) => [newGroup, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newGroupId]: [newGroup.lastMessage!],
    }));
    setActiveTab('groups');
    setSelectedChatId(newGroupId);
  };

  // Select Contact from New Chat Modal
  const handleSelectContactForChat = (contact: Contact) => {
    setShowNewChatModal(false);
    // Find existing chat with contact or create new
    const existing = chats.find(
      (c) => !c.isGroup && c.participants.includes(contact.id)
    );

    if (existing) {
      setSelectedChatId(existing.id);
      setActiveTab('chats');
    } else {
      const newChatId = `chat_${contact.id}`;
      const newChat: ChatThread = {
        id: newChatId,
        isGroup: false,
        name: contact.name,
        avatar: contact.avatar,
        participants: [currentUser.id, contact.id],
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      };
      setChats((prev) => [newChat, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newChatId]: [],
      }));
      setSelectedChatId(newChatId);
      setActiveTab('chats');
    }
  };

  // Add Status Story
  const handleAddStory = (storyData: Omit<StatusStory, 'id' | 'timestamp' | 'seen'>) => {
    const newStory: StatusStory = {
      ...storyData,
      id: `story_${Date.now()}`,
      timestamp: 'Just now',
      seen: false,
    };
    setStories((prev) => [newStory, ...prev]);
  };

  // Reset unread count when chat is opened
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // If user logs out, render AuthScreen
  if (!isLoggedIn) {
    return (
      <AuthScreen
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentLang(user.language || 'bn');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased select-none font-sans">
      {/* 1. PRIMARY SIDEBAR NAVIGATION (Desktop/Tablet vertical sidebar + Mobile responsive bottom nav) */}
      <SidebarNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // If switching to stories, calls, or profile on mobile, clear selected chat
          if (tab === 'stories' || tab === 'calls' || tab === 'profile') {
            setSelectedChatId(null);
          }
        }}
        currentUser={currentUser}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        unreadCounts={unreadCounts}
        onOpenNewChat={() => setShowNewChatModal(true)}
        onOpenNewGroup={() => setShowNewGroupModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* 2. SECOND COLUMN: THREAD LIST / ACTIVE TAB CONTENT */}
      {/* On mobile: visible when NO chat is open, or when not viewing chat view */}
      <div
        className={`flex flex-col bg-slate-950 border-r border-slate-800/90 h-full overflow-hidden transition-all duration-200 z-10 ${
          selectedChatId ? 'hidden md:flex md:w-80 lg:w-96' : 'flex flex-1 md:w-80 lg:w-96'
        }`}
      >
        {/* Dynamic Header depending on Tab */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              {activeTab === 'chats' && t.chats}
              {activeTab === 'groups' && t.groups}
              {activeTab === 'stories' && t.status}
              {activeTab === 'calls' && t.calls}
              {activeTab === 'profile' && t.profile}
            </h2>

            {/* Total items badge */}
            {activeTab === 'chats' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {displayedThreads.length}
              </span>
            )}
            {activeTab === 'groups' && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
                {displayedThreads.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick action button depending on tab */}
            {activeTab === 'chats' && (
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title={t.newChat}
              >
                <Plus className="w-5 h-5 text-emerald-400" />
              </button>
            )}

            {activeTab === 'groups' && (
              <button
                type="button"
                onClick={() => setShowNewGroupModal(true)}
                className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-md shadow-teal-700/30 transition-all cursor-pointer"
                title={t.newGroup}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.createGroup}</span>
              </button>
            )}

            {/* Quick Test Incoming Call button on header */}
            <button
              type="button"
              onClick={() => handleSimulateIncoming(contacts[0], 'video')}
              className="p-2 text-slate-300 hover:text-emerald-400 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Test Incoming Video Call"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Tab Specific Content */}
        {activeTab === 'chats' || activeTab === 'groups' ? (
          <div className="flex flex-col flex-1 overflow-hidden pb-14 md:pb-0">
            {/* Search Input Bar */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/30">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeTab === 'chats'
                      ? t.searchPlaceholder
                      : currentLang === 'bn'
                      ? 'গ্রুপ খুঁজুন...'
                      : currentLang === 'hi'
                      ? 'ग्रुप खोजें...'
                      : 'Search groups...'
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Quick Filter Pills (All, Unread, Pinned) */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                {(['all', 'unread', 'pinned'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setFilterType(filter)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                      filterType === filter
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {filter === 'all' && (currentLang === 'bn' ? 'সব' : currentLang === 'hi' ? 'सभी' : 'All')}
                    {filter === 'unread' && (currentLang === 'bn' ? 'অপঠিত' : currentLang === 'hi' ? 'अपठित' : 'Unread')}
                    {filter === 'pinned' && (currentLang === 'bn' ? 'পিন করা' : currentLang === 'hi' ? 'पिन किए गए' : 'Pinned')}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Threads Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-1">
              {displayedThreads.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
                  <MessageSquare className="w-10 h-10 stroke-1 text-slate-600" />
                  <p className="text-xs">
                    {searchQuery
                      ? 'No conversations found matching search'
                      : activeTab === 'groups'
                      ? 'No group chats yet. Create one!'
                      : 'No messages in this folder'}
                  </p>
                  {activeTab === 'groups' && (
                    <button
                      type="button"
                      onClick={() => setShowNewGroupModal(true)}
                      className="mt-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl"
                    >
                      {t.newGroup}
                    </button>
                  )}
                </div>
              ) : (
                displayedThreads.map((thread) => {
                  const isSelected = selectedChatId === thread.id;
                  const otherContact = !thread.isGroup
                    ? contacts.find((c) => thread.participants.includes(c.id))
                    : undefined;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => handleSelectChat(thread.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer text-left relative group ${
                        isSelected
                          ? 'bg-slate-900/95 ring-1 ring-emerald-500/50 shadow-md'
                          : 'hover:bg-slate-900/50'
                      }`}
                    >
                      {/* Avatar with Online/Group badge */}
                      <div className="relative shrink-0">
                        <img
                          src={thread.avatar}
                          alt={thread.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-700/80"
                        />
                        {thread.isGroup ? (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-600 border-2 border-slate-900 rounded-full flex items-center justify-center text-white text-[9px]">
                            <Users className="w-3 h-3" />
                          </span>
                        ) : otherContact?.isOnline ? (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                        ) : null}
                      </div>

                      {/* Content: Title & Last Message preview */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className="text-sm font-semibold text-white truncate leading-tight flex items-center gap-1.5">
                            {thread.name}
                            {thread.isPinned && (
                              <Pin className="w-3 h-3 text-emerald-400 rotate-45 shrink-0" />
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                            {thread.lastMessage?.timestamp || '10:00 AM'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1">
                          {/* Last message snippet with icon */}
                          <div className="flex items-center gap-1 text-xs text-slate-400 truncate">
                            {thread.lastMessage?.type === 'voice' && (
                              <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            {thread.lastMessage?.type === 'image' && (
                              <ImageIcon className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            )}
                            {thread.lastMessage?.type === 'video' && (
                              <Film className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span className="truncate">
                              {thread.lastMessage?.text || 'Tap to chat...'}
                            </span>
                          </div>

                          {/* Unread Counter Badge */}
                          {thread.unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 min-w-5 h-5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : activeTab === 'stories' ? (
          /* Stories Tab Content */
          <div className="flex-1 overflow-hidden pb-14 md:pb-0 flex flex-col">
            <StatusStories
              stories={stories}
              currentUser={currentUser}
              currentLang={currentLang}
              onAddStory={handleAddStory}
            />
          </div>
        ) : activeTab === 'calls' ? (
          /* Calls Tab Content */
          <div className="flex-1 overflow-hidden pb-14 md:pb-0 flex flex-col">
            <CallsList
              callLogs={callLogs}
              contacts={contacts}
              currentLang={currentLang}
              onStartCall={handleStartCall}
              onSimulateIncoming={handleSimulateIncoming}
            />
          </div>
        ) : (
          /* Profile Tab Content */
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-14 md:pb-0">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-3xl text-center">
              <div className="relative mb-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">{t.online}</p>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">{currentUser.about}</p>
              <p className="text-xs text-slate-500 mt-1">{currentUser.phone}</p>

              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer"
              >
                {t.editProfile}
              </button>
            </div>

            {/* Language Switch Card */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.languageSelect}</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {(['bn', 'hi', 'en'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => handleLanguageChange(lng)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      currentLang === lng
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lng === 'bn' ? 'বাংলা' : lng === 'hi' ? 'हिन्दी' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. THIRD COLUMN: ACTIVE CHAT VIEW / EMPTY STATE */}
      {/* On mobile: takes full screen when a chat is selected */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 h-full overflow-hidden relative ${
          selectedChatId ? 'flex' : 'hidden md:flex'
        }`}
      >
        {selectedChat ? (
          <ChatView
            chat={selectedChat}
            contact={selectedContact}
            currentUser={currentUser}
            messages={messages[selectedChat.id] || []}
            currentLang={currentLang}
            onBack={() => setSelectedChatId(null)}
            onSendMessage={handleSendMessage}
            onStartCall={handleStartCall}
            onOpenMedia={(url, type, caption) => setActiveMedia({ url, type, caption })}
            onToggleReaction={handleToggleReaction}
          />
        ) : (
          /* Empty Chat Placeholder (Desktop) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950 relative overflow-hidden select-none">
            {/* Ambient background glow */}
            <div className="w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl absolute pointer-events-none" />

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 shadow-2xl">
              <MessageSquare className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              {t.appName}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-6 leading-relaxed">
              {currentLang === 'bn'
                ? 'বাংলা ও হিন্দিতে নিরাপদে বার্তা আদান-প্রদান করুন। কোনো চ্যাট নির্বাচন করে কথা বলা শুরু করুন।'
                : currentLang === 'hi'
                ? 'हिंदी और बंगाली में सुरक्षित संदेश भेजें। बातचीत शुरू करने के लिए कोई चैट चुनें।'
                : 'Send voice notes, photos, and messages in Bengali and Hindi. Select a conversation to start chatting.'}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.newChat}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNewGroupModal(true)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-teal-400" />
                <span>{t.newGroup}</span>
              </button>
            </div>

            <div className="mt-12 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>End-to-end encrypted Abu Chat</span>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          contacts={contacts}
          currentLang={currentLang}
          onSelectContact={handleSelectContactForChat}
          onClose={() => setShowNewChatModal(false)}
        />
      )}

      {/* New Group Modal */}
      {showNewGroupModal && (
        <NewGroupModal
          contacts={contacts}
          currentLang={currentLang}
          onCreateGroup={handleCreateGroup}
          onClose={() => setShowNewGroupModal(false)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={currentUser}
          currentLang={currentLang}
          onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
          onLanguageChange={handleLanguageChange}
          onLogout={() => setIsLoggedIn(false)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Media Viewer Modal */}
      {activeMedia && (
        <MediaViewer
          mediaUrl={activeMedia.url}
          type={activeMedia.type}
          caption={activeMedia.caption}
          onClose={() => setActiveMedia(null)}
        />
      )}

      {/* Active Call Modal */}
      {activeCall && (
        <CallModal
          call={activeCall}
          currentLang={currentLang}
          onEndCall={handleEndCall}
          onToggleMute={() =>
            setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
          }
          onToggleCamera={() =>
            setActiveCall((prev) => (prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null))
          }
          onToggleSpeaker={() =>
            setActiveCall((prev) => (prev ? { ...prev, isSpeakerOn: !prev.isSpeakerOn } : null))
          }
        />
      )}

      {/* Incoming Call Modal */}
      {incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          currentLang={currentLang}
          onAccept={handleAcceptIncomingCall}
          onDecline={handleDeclineIncomingCall}
        />
      )}
    </div>
  );
}
