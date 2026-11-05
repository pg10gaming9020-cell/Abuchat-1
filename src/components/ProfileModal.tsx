import React, { useState } from 'react';
import { X, Camera, Globe, Check, Phone, User, MessageCircle, LogOut } from 'lucide-react';
import { UserProfile, Language } from '../types';
import { translations } from '../utils/translations';

interface ProfileModalProps {
  user: UserProfile;
  currentLang: Language;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  currentLang,
  onUpdateUser,
  onLanguageChange,
  onLogout,
  onClose,
}) => {
  const t = translations[currentLang];
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState(user.about);
  const [phone, setPhone] = useState(user.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim(),
      about: about.trim(),
      phone: phone.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.profile}</h3>
              <p className="text-xs text-slate-400">{t.editProfile}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-xl"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full text-white shadow-lg border-2 border-slate-900">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              {t.online}
            </span>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {currentLang === 'bn' ? 'নাম' : currentLang === 'hi' ? 'नाम' : 'Name'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* About / Bio Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.about}
            </label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t.phone}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Language Selection */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.languageSelect}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('bn')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentLang === 'bn'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                বাংলা
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentLang === 'hi'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  currentLang === 'en'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Logout / Switch Account */}
          <div className="pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch User / Logout</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-700/30 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>{t.save}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
