export type Language = 'bn' | 'hi' | 'en';
export type NavTab = 'chats' | 'groups' | 'stories' | 'calls' | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  about: string;
  language: Language;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Contact {
  id: string;
  name: string;
  nameBn?: string;
  nameHi?: string;
  phone: string;
  avatar: string;
  about: string;
  aboutBn?: string;
  aboutHi?: string;
  isOnline: boolean;
  lastSeen: string;
  typing?: boolean;
}

export interface MessageReaction {
  emoji: string;
  users: string[]; // user IDs
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  textBn?: string;
  textHi?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'voice' | 'image' | 'video' | 'call_log';
  voiceDuration?: number; // in seconds
  voiceBlobUrl?: string;
  mediaUrl?: string;
  mediaCaption?: string;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: Record<string, string[]>; // emoji -> array of user names
  callDetails?: {
    type: 'audio' | 'video';
    durationSec: number;
    status: 'missed' | 'completed' | 'declined';
  };
}

export interface ChatThread {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  isPinned?: boolean;
  description?: string;
  createdAt: string;
  adminIds?: string[];
}

export interface StatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'image' | 'text';
  mediaUrl?: string;
  text?: string;
  bgColor?: string;
  timestamp: string;
  seen: boolean;
}

export interface ActiveCall {
  active: boolean;
  isIncoming: boolean;
  contact: Contact;
  callType: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startTime?: number;
  durationSec: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeakerOn: boolean;
}

export interface CallLogItem {
  id: string;
  contact: Contact;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  durationSec: number;
}
