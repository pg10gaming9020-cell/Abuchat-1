import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Mic,
  Send,
  Smile,
  Check,
  CheckCheck,
  Play,
  Pause,
  Image as ImageIcon,
  Languages,
  Sparkles,
  Trash2,
  Camera,
  Film,
  X,
  Volume2,
} from 'lucide-react';
import { ChatThread, ChatMessage, Contact, Language, UserProfile } from '../types';
import { translations, QUICK_PHRASES, MOCK_BOT_REPLIES } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface ChatViewProps {
  chat: ChatThread;
  contact?: Contact;
  currentUser: UserProfile;
  messages: ChatMessage[];
  currentLang: Language;
  onBack: () => void;
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  onStartCall: (type: 'audio' | 'video', contact: Contact) => void;
  onOpenMedia: (url: string, type: 'image' | 'video', caption?: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  contact,
  currentUser,
  messages,
  currentLang,
  onBack,
  onSendMessage,
  onStartCall,
  onOpenMedia,
  onToggleReaction,
}) => {
  const t = translations[currentLang];
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording]);

  // Handle Voice Recording
  const startRecording = async () => {
    sounds.playRecordStart();
    setIsRecording(true);
    setRecordDuration(0);
    audioChunksRef.current = [];

    recordTimerRef.current = window.setInterval(() => {
      setRecordDuration((prev) => prev + 1);
    }, 1000);

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.start();
      }
    } catch (e) {
      console.warn('Microphone permission blocked or not available in sandbox, simulating voice note', e);
    }
  };

  const stopAndSendRecording = () => {
    sounds.playRecordStop();
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    const duration = Math.max(recordDuration, 2);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        let blobUrl: string | undefined = undefined;
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          blobUrl = URL.createObjectURL(audioBlob);
        }

        onSendMessage({
          chatId: chat.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          text: currentLang === 'bn' ? `ভয়েস মেসেজ (${duration}s)` : currentLang === 'hi' ? `वॉयस संदेश (${duration}s)` : `Voice message (${duration}s)`,
          status: 'sent',
          type: 'voice',
          voiceDuration: duration,
          voiceBlobUrl: blobUrl,
        });
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    } else {
      // Send simulated voice note if recorder wasn't started
      onSendMessage({
        chatId: chat.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: currentLang === 'bn' ? `ভয়েস মেসেজ (${duration}s)` : currentLang === 'hi' ? `वॉयस संदेश (${duration}s)` : `Voice message (${duration}s)`,
        status: 'sent',
        type: 'voice',
        voiceDuration: duration,
      });
    }

    setIsRecording(false);
  };

  const cancelRecording = () => {
    sounds.playRecordStop();
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;

    sounds.playSent();
    onSendMessage({
      chatId: chat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: inputText.trim(),
      status: 'sent',
      type: 'text',
    });

    setInputText('');
    setShowQuickPhrases(false);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const isVid = file.type.startsWith('video');

    onSendMessage({
      chatId: chat.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: isVid ? 'Video' : 'Photo',
      status: 'sent',
      type: isVid ? 'video' : 'image',
      mediaUrl: fileUrl,
      mediaCaption: file.name,
    });

    setShowAttachMenu(false);
  };

  // Play voice message with synthetic realistic audio tone fallback
  const togglePlayVoice = (msg: ChatMessage) => {
    if (activeAudioId === msg.id) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      setActiveAudioId(null);
      return;
    }

    if (msg.voiceBlobUrl) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      const audio = new Audio(msg.voiceBlobUrl);
      audio.playbackRate = audioPlaybackSpeed;
      audio.onended = () => setActiveAudioId(null);
      activeAudioRef.current = audio;
      audio.play();
      setActiveAudioId(msg.id);
    } else {
      // Synthesize realistic friendly voice chirp
      setActiveAudioId(msg.id);
      const playMockVoice = () => {
        try {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.3);
          osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.7);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (msg.voiceDuration || 3) / audioPlaybackSpeed);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + (msg.voiceDuration || 3) / audioPlaybackSpeed);
        } catch (e) {
          console.warn(e);
        }
      };
      playMockVoice();
      setTimeout(() => {
        setActiveAudioId(null);
      }, ((msg.voiceDuration || 3) * 1000) / audioPlaybackSpeed);
    }
  };

  // Toggle translation
  const toggleTranslate = (msgId: string) => {
    setTranslatedMessages((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const getTranslatedText = (msg: ChatMessage) => {
    if (!translatedMessages[msg.id]) return msg.text;
    if (currentLang === 'bn') {
      return msg.textBn || msg.textHi || msg.text;
    } else if (currentLang === 'hi') {
      return msg.textHi || msg.textBn || msg.text;
    } else {
      return msg.text;
    }
  };

  const commonEmojis = ['❤️', '😂', '👍', '🙏', '🔥', '😍', '☕', '🎉', '😊', '🤝'];

  return (
    <div className="flex flex-col h-full bg-slate-950 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="h-16 bg-slate-900/95 border-b border-slate-800/80 px-3 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-1 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar with status indicator */}
          <div className="relative shrink-0">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700/80"
            />
            {contact?.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate leading-tight">
              {chat.name}
            </h3>
            <p className="text-[11px] text-emerald-400 font-medium truncate">
              {contact?.typing
                ? t.typing
                : contact?.isOnline
                ? t.online
                : contact?.lastSeen || t.offline}
            </p>
          </div>
        </div>

        {/* Action icons: Audio Call, Video Call, Quick Phrases */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => contact && onStartCall('video', contact)}
            className="p-2 text-slate-300 hover:text-emerald-400 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.videoCall}
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => contact && onStartCall('audio', contact)}
            className="p-2 text-slate-300 hover:text-emerald-400 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            title={t.audioCall}
          >
            <Phone className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setShowQuickPhrases(!showQuickPhrases)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              showQuickPhrases
                ? 'bg-emerald-600/30 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={t.quickPhrases}
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Phrase Suggestion Drawer */}
      {showQuickPhrases && (
        <div className="bg-slate-900/95 border-b border-slate-800 p-3 z-20 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {currentLang === 'bn' ? 'বাংলা ও হিন্দি কুইক বার্তা' : currentLang === 'hi' ? 'हिंदी व बंगाली त्वरित संदेश' : 'Quick Multilingual Phrases'}
            </span>
            <button
              type="button"
              onClick={() => setShowQuickPhrases(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
            {QUICK_PHRASES.map((item, idx) => {
              const phrase = currentLang === 'bn' ? item.bn : currentLang === 'hi' ? item.hi : item.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputText(phrase);
                    setShowQuickPhrases(false);
                  }}
                  className="text-xs px-2.5 py-1.5 bg-slate-800/80 hover:bg-emerald-900/40 hover:text-emerald-300 text-slate-200 rounded-lg border border-slate-700/60 transition-colors text-left cursor-pointer"
                >
                  {phrase}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Messages Feed Area with WhatsApp-style background */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 relative"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.03) 0%, transparent 80%)`,
        }}
      >
        {/* Date Pill */}
        <div className="flex justify-center my-2">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full shadow-sm">
            {t.today}
          </span>
        </div>

        {/* Message Items */}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const displayContent = getTranslatedText(msg);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              {/* Group sender name if group chat */}
              {chat.isGroup && !isMe && (
                <span className="text-[10px] font-semibold text-emerald-400 px-1 mb-0.5">
                  {msg.senderName}
                </span>
              )}

              <div
                className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 shadow-md relative transition-all ${
                  isMe
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800/80'
                }`}
              >
                {/* Voice Message View */}
                {msg.type === 'voice' && (
                  <div className="flex items-center gap-3 py-1">
                    <button
                      type="button"
                      onClick={() => togglePlayVoice(msg)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                        activeAudioId === msg.id
                          ? 'bg-white text-emerald-800'
                          : 'bg-emerald-600/80 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {activeAudioId === msg.id ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1">
                      {/* Animated audio wave bars */}
                      <div className="flex items-center gap-1 h-6">
                        {[1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 2].map((n, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              activeAudioId === msg.id
                                ? `bg-emerald-300 animate-soundwave-${(i % 5) + 1}`
                                : 'bg-slate-400/50'
                            }`}
                            style={{ height: `${n * 4}px` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-300 mt-1">
                        <span>0:{msg.voiceDuration?.toString().padStart(2, '0') || '05'}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
                          }}
                          className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 text-[10px] font-bold text-emerald-200"
                        >
                          {audioPlaybackSpeed}x
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Message View */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="space-y-2">
                    <div
                      onClick={() => onOpenMedia(msg.mediaUrl!, 'image', msg.mediaCaption)}
                      className="rounded-xl overflow-hidden cursor-pointer relative group/img max-h-64"
                    >
                      <img
                        src={msg.mediaUrl}
                        alt="Shared media"
                        className="w-full h-auto object-cover group-hover/img:scale-102 transition-transform"
                      />
                    </div>
                    {msg.mediaCaption && (
                      <p className="text-xs text-slate-100">{msg.mediaCaption}</p>
                    )}
                  </div>
                )}

                {/* Video Message View */}
                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="space-y-2">
                    <video
                      src={msg.mediaUrl}
                      controls
                      className="rounded-xl w-full max-h-64 object-cover"
                    />
                    {msg.mediaCaption && (
                      <p className="text-xs text-slate-100">{msg.mediaCaption}</p>
                    )}
                  </div>
                )}

                {/* Text Message */}
                {msg.type === 'text' && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {displayContent}
                  </p>
                )}

                {/* Message Footer: Timestamp, translation button, double blue tick */}
                <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-slate-300/80">
                  {/* Translate switch */}
                  {(msg.textBn || msg.textHi) && (
                    <button
                      type="button"
                      onClick={() => toggleTranslate(msg.id)}
                      className="text-[10px] text-emerald-300 hover:text-white flex items-center gap-0.5 mr-1"
                      title="Translate Bengali/Hindi"
                    >
                      <Languages className="w-2.5 h-2.5" />
                      <span>{translatedMessages[msg.id] ? t.showOriginal : t.translateMsg}</span>
                    </button>
                  )}

                  <span>{msg.timestamp}</span>

                  {isMe && (
                    <span className="ml-0.5">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Reaction badge container */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="absolute -bottom-2.5 right-2 flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 text-xs shadow-md">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <span key={emoji} title={users.join(', ')}>
                        {emoji} {users.length > 1 && <span className="text-[10px]">{users.length}</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Reactions Bar on Hover / Focus */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-1 py-1 mt-0.5">
                {commonEmojis.slice(0, 5).map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onToggleReaction(msg.id, emoji)}
                    className="p-1 text-xs hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Menu Popup */}
      {showAttachMenu && (
        <div className="absolute bottom-20 left-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-30 flex items-center gap-4 animate-in slide-in-from-bottom duration-150">
          <label className="flex flex-col items-center gap-1.5 cursor-pointer text-slate-300 hover:text-emerald-400">
            <div className="w-11 h-11 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">{t.photo}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            type="button"
            onClick={() => {
              // Send demo photo
              onSendMessage({
                chatId: chat.id,
                senderId: currentUser.id,
                senderName: currentUser.name,
                text: 'Photo',
                status: 'sent',
                type: 'image',
                mediaUrl: '/src/assets/images/status_sunset_view_1793902604156.jpg',
                mediaCaption: currentLang === 'bn' ? 'দারুণ দৃশ্য! 🌅' : 'खूबसूरत नज़ारा! 🌅',
              });
              setShowAttachMenu(false);
            }}
            className="flex flex-col items-center gap-1.5 cursor-pointer text-slate-300 hover:text-emerald-400"
          >
            <div className="w-11 h-11 rounded-full bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium">Quick Photo</span>
          </button>
        </div>
      )}

      {/* Emoji Picker Bar */}
      {showEmojiPicker && (
        <div className="bg-slate-900 border-t border-slate-800 p-2 z-20 flex flex-wrap gap-2">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setInputText((prev) => prev + emoji)}
              className="text-xl p-1.5 hover:bg-slate-800 rounded-lg transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800/80 p-2.5 z-20 backdrop-blur-md">
        {isRecording ? (
          /* Live Voice Recording UI */
          <div className="flex items-center justify-between bg-slate-950/80 border border-emerald-600/50 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-sm font-semibold text-rose-400">
                {t.recording} 0:{recordDuration.toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelRecording}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={stopAndSendRecording}
                className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer"
                title={t.send}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Normal Message Input UI */
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950/80 border border-slate-800 focus-within:border-emerald-500 rounded-2xl flex items-center px-3 py-1.5 transition-colors">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Smile className="w-5 h-5" />
              </button>

              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
                placeholder={t.typeMessage}
                className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none resize-none px-2 max-h-24 py-1"
              />

              <button
                type="button"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="text-slate-400 hover:text-white p-1"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            {inputText.trim() ? (
              <button
                type="button"
                onClick={handleSendText}
                className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
                title={t.send}
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
                title={t.recordVoice}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
