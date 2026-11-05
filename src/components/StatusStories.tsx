import React, { useState, useEffect } from 'react';
import { Plus, X, Camera, Type, Clock, Sparkles } from 'lucide-react';
import { StatusStory, Language, UserProfile } from '../types';
import { translations } from '../utils/translations';

interface StatusStoriesProps {
  stories: StatusStory[];
  currentUser: UserProfile;
  currentLang: Language;
  onAddStory: (story: Omit<StatusStory, 'id' | 'timestamp' | 'seen'>) => void;
}

export const StatusStories: React.FC<StatusStoriesProps> = ({
  stories,
  currentUser,
  currentLang,
  onAddStory,
}) => {
  const t = translations[currentLang];
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [selectedBg, setSelectedBg] = useState('from-emerald-700 to-teal-900');

  const bgOptions = [
    'from-emerald-700 to-teal-900',
    'from-amber-600 to-rose-700',
    'from-indigo-800 to-purple-900',
    'from-rose-600 to-pink-800',
    'from-sky-700 to-blue-900',
  ];

  // Auto advance story
  useEffect(() => {
    if (activeStoryIndex === null) return;

    setProgress(0);
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const handleCreateTextStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) return;

    onAddStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: 'text',
      text: storyText.trim(),
      bgColor: selectedBg,
    });

    setStoryText('');
    setShowAddModal(false);
  };

  const handleAddSamplePhotoStory = () => {
    onAddStory({
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: 'image',
      mediaUrl: '/src/assets/images/status_sunset_view_1793902604156.jpg',
      text: currentLang === 'bn' ? 'দারুণ সন্ধ্যা! জীবন সুন্দর ❤️' : 'खूबसूरत शाम! जिंदगी हसीन है ❤️',
    });
    setShowAddModal(false);
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* My Status Card */}
      <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white border-2 border-slate-900 shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{t.myStatus}</h4>
            <p className="text-xs text-slate-400">{t.tapToAddStatus}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          {t.addStatus}
        </button>
      </div>

      {/* Recent Updates Header */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          {t.recentUpdates}
        </h4>

        <div className="space-y-2">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-900 border border-slate-800/50 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400">
                <img
                  src={story.userAvatar}
                  alt={story.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-900"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-sm font-semibold text-white truncate">
                  {story.userName}
                </h5>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{story.timestamp}</span>
                </p>
              </div>

              <span className="text-xs text-emerald-400 font-medium">View</span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-center items-center p-4 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {t.addStatus}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTextStory} className="space-y-4">
              {/* Preview Box */}
              <div
                className={`w-full h-44 rounded-2xl bg-gradient-to-tr ${selectedBg} p-4 flex items-center justify-center text-center shadow-inner`}
              >
                <p className="text-lg font-bold text-white max-w-xs drop-shadow">
                  {storyText || (currentLang === 'bn' ? 'এখানে আপনার কথা লিখুন...' : 'यहाँ अपनी बात लिखें...')}
                </p>
              </div>

              {/* Background Color Palette */}
              <div className="flex items-center justify-center gap-2">
                {bgOptions.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBg(bg)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${bg} transition-transform ${
                      selectedBg === bg ? 'ring-2 ring-white scale-110' : 'opacity-80'
                    }`}
                  />
                ))}
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder={currentLang === 'bn' ? 'স্ট্যাটাস লিখুন...' : 'स्टेटस लिखें...'}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddSamplePhotoStory}
                  className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>Photo Story</span>
                </button>

                <button
                  type="submit"
                  disabled={!storyText.trim()}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
                >
                  <Type className="w-4 h-4" />
                  <span>Post Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Active Story Player */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 backdrop-blur-md animate-in fade-in duration-200">
          {/* Progress Bars */}
          <div className="w-full max-w-md mx-auto pt-2">
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Header with avatar, user name, and close */}
            <div className="flex items-center justify-between mt-3 text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.userAvatar}
                  alt={activeStory.userName}
                  className="w-9 h-9 rounded-full object-cover border border-white/40"
                />
                <div>
                  <h4 className="text-xs font-bold leading-tight">{activeStory.userName}</h4>
                  <span className="text-[10px] text-white/70">{activeStory.timestamp}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStoryIndex(null)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Story Body */}
          <div
            className="flex-1 flex items-center justify-center max-w-md mx-auto w-full my-4 cursor-pointer select-none"
            onClick={() => {
              if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
                setActiveStoryIndex(activeStoryIndex + 1);
              } else {
                setActiveStoryIndex(null);
              }
            }}
          >
            {activeStory.type === 'image' && activeStory.mediaUrl ? (
              <div className="relative w-full h-full max-h-[75vh] rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-slate-950">
                <img
                  src={activeStory.mediaUrl}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
                {activeStory.text && (
                  <div className="absolute bottom-6 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl text-white text-center text-sm border border-white/10">
                    <p>{activeStory.text}</p>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-full h-full max-h-[75vh] rounded-3xl bg-gradient-to-tr ${
                  activeStory.bgColor || 'from-emerald-700 to-teal-900'
                } p-6 flex items-center justify-center text-center shadow-2xl`}
              >
                <p className="text-2xl font-bold text-white leading-relaxed max-w-sm drop-shadow-md">
                  {activeStory.text}
                </p>
              </div>
            )}
          </div>

          {/* Quick reply bar */}
          <div className="w-full max-w-md mx-auto pb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={currentLang === 'bn' ? 'স্ট্যাটাসে উত্তর দিন...' : 'स्टेटस का उत्तर दें...'}
                className="flex-1 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-white/60 focus:outline-none focus:bg-white/20"
              />
              <button
                type="button"
                onClick={() => setActiveStoryIndex(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-xs font-semibold text-white shadow-md cursor-pointer"
              >
                {t.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
