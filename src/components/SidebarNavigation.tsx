import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  CircleDashed,
  Phone,
  Settings,
  Plus,
  Globe,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  UserCheck,
  CheckCircle,
} from 'lucide-react';
import { NavTab, Language, UserProfile } from '../types';
import { translations } from '../utils/translations';

export interface SidebarNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentUser: UserProfile;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  unreadCounts: {
    chats: number;
    groups: number;
    stories: number;
    calls: number;
  };
  onOpenNewChat: () => void;
  onOpenNewGroup: () => void;
  onOpenProfile: () => void;
  className?: string;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  currentLang,
  onLanguageChange,
  unreadCounts,
  onOpenNewChat,
  onOpenNewGroup,
  onOpenProfile,
  className = '',
}) => {
  const t = translations[currentLang];
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const navItems: Array<{
    id: NavTab;
    label: string;
    labelSecondary: string;
    icon: React.ElementType;
    badgeCount: number;
    badgeDot?: boolean;
    color: string;
  }> = [
    {
      id: 'chats',
      label: t.chats,
      labelSecondary: currentLang === 'bn' ? 'ব্যক্তিগত বার্তা' : currentLang === 'hi' ? 'निजी संदेश' : 'Direct Messages',
      icon: MessageSquare,
      badgeCount: unreadCounts.chats,
      color: 'emerald',
    },
    {
      id: 'groups',
      label: t.groups,
      labelSecondary: currentLang === 'bn' ? 'বন্ধুদের আড্ডা' : currentLang === 'hi' ? 'ग्रुप बातचीत' : 'Community & Groups',
      icon: Users,
      badgeCount: unreadCounts.groups,
      color: 'teal',
    },
    {
      id: 'stories',
      label: t.status,
      labelSecondary: currentLang === 'bn' ? '২৪ ঘণ্টার গল্প' : currentLang === 'hi' ? 'स्टेटस अपडेट्स' : 'Status & Stories',
      icon: CircleDashed,
      badgeCount: unreadCounts.stories,
      badgeDot: unreadCounts.stories > 0,
      color: 'cyan',
    },
    {
      id: 'calls',
      label: t.calls,
      labelSecondary: currentLang === 'bn' ? 'অডিও ও ভিডিও' : currentLang === 'hi' ? 'ऑडियो व वीडियो' : 'Audio & Video Calls',
      icon: Phone,
      badgeCount: unreadCounts.calls,
      color: 'sky',
    },
  ];

  const handleTabClick = (tabId: NavTab) => {
    onTabChange(tabId);
    setShowMobileDrawer(false);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP & TABLET PRIMARY SIDEBAR (hidden on small mobile) */}
      {/* ======================================================== */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800/90 h-full select-none transition-all duration-300 relative z-30 shrink-0 ${
          isExpanded ? 'w-64' : 'w-20'
        } ${className}`}
        aria-label="Primary Messenger Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-slate-800/80 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-700/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            {isExpanded && (
              <div className="min-w-0 animate-in fade-in duration-200">
                <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 leading-none">
                  {t.appName}
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 truncate mt-1">
                  {currentLang === 'bn' ? 'বাংলা ও হিন্দি মেসেন্জার' : currentLang === 'hi' ? 'हिंदी व बंगाली मैसेंजर' : 'Bengali & Hindi Chat'}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Expand/Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button (+ New Chat / Group) */}
        <div className="p-3 border-b border-slate-800/60">
          {isExpanded ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onOpenNewChat}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/30 transition-all cursor-pointer"
                title={t.newChat}
              >
                <Plus className="w-4 h-4" />
                <span>{t.newChat}</span>
              </button>

              <button
                type="button"
                onClick={onOpenNewGroup}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
                title={t.newGroup}
                aria-label={t.newGroup}
              >
                <Users className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenNewChat}
              className="w-12 h-12 mx-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
              title={t.newChat}
              aria-label={t.newChat}
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main Navigation Item List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto" aria-label="Messenger sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center rounded-2xl transition-all cursor-pointer relative group ${
                  isExpanded ? 'px-3.5 py-3 gap-3.5' : 'justify-center p-3.5'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30 font-medium'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={!isExpanded ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active Indicator Bar on left for compact view */}
                {isActive && !isExpanded && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-sm" />
                )}

                {/* Nav Icon */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`} />

                  {/* Red/Green Unread dot or counter on icon when collapsed */}
                  {!isExpanded && item.badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 min-w-4 h-4 bg-emerald-400 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {item.badgeCount}
                    </span>
                  )}
                </div>

                {/* Nav Label and Subtitle when expanded */}
                {isExpanded && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate leading-tight">
                        {item.label}
                      </span>
                      {item.badgeCount > 0 && (
                        <span
                          className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            isActive
                              ? 'bg-white text-emerald-900 shadow-sm'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] block truncate mt-0.5 ${
                        isActive ? 'text-emerald-100/90' : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    >
                      {item.labelSecondary}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Language Switcher Section */}
        <div className="px-3 py-2 border-t border-slate-800/70">
          {isExpanded ? (
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 px-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang === 'bn' ? 'ভাষা' : currentLang === 'hi' ? 'भाषा' : 'Lang'}</span>
              </span>
              <div className="flex items-center gap-1">
                {(['bn', 'hi', 'en'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => onLanguageChange(lng)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                      currentLang === lng
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {lng === 'bn' ? 'বাং' : lng === 'hi' ? 'हिं' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-10 h-10 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Change Language"
                aria-label="Change Language"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute bottom-12 left-14 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-1 w-28 animate-in fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange('bn');
                      setShowLanguageDropdown(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left ${
                      currentLang === 'bn' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange('hi');
                      setShowLanguageDropdown(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left ${
                      currentLang === 'hi' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLanguageChange('en');
                      setShowLanguageDropdown(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left ${
                      currentLang === 'en' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onOpenProfile}
            className={`w-full flex items-center rounded-2xl p-2 hover:bg-slate-800 transition-colors cursor-pointer group text-left ${
              activeTab === 'profile' ? 'bg-slate-800 ring-1 ring-emerald-500/50' : ''
            }`}
            title="Profile & Settings"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/60"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            {isExpanded && (
              <div className="ml-3 min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-emerald-400 transition-colors">
                  {currentUser.name}
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium truncate flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>{t.online}</span>
                </p>
              </div>
            )}

            {isExpanded && (
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1 shrink-0" />
            )}
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE RESPONSIVE BOTTOM NAVIGATION BAR (< md breakpoint) */}
      {/* ======================================================== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around safe-area-bottom"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Chats Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('chats')}
          className={`flex-1 py-1 px-1 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'chats' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t.chats}
        >
          <div className="relative p-1">
            <MessageSquare className="w-5 h-5" />
            {unreadCounts.chats > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 min-w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {unreadCounts.chats}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">{t.chats}</span>
          {activeTab === 'chats' && (
            <span className="w-8 h-1 bg-emerald-400 rounded-full mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Groups Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('groups')}
          className={`flex-1 py-1 px-1 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'groups' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t.groups}
        >
          <div className="relative p-1">
            <Users className="w-5 h-5" />
            {unreadCounts.groups > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 min-w-4 h-4 bg-teal-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center">
                {unreadCounts.groups}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">{t.groups}</span>
          {activeTab === 'groups' && (
            <span className="w-8 h-1 bg-teal-400 rounded-full mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Stories / Status Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('stories')}
          className={`flex-1 py-1 px-1 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'stories' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t.status}
        >
          <div className="relative p-1">
            <CircleDashed className="w-5 h-5" />
            {unreadCounts.stories > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-900" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">{t.status}</span>
          {activeTab === 'stories' && (
            <span className="w-8 h-1 bg-emerald-400 rounded-full mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Calls Tab */}
        <button
          type="button"
          onClick={() => handleTabClick('calls')}
          className={`flex-1 py-1 px-1 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'calls' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label={t.calls}
        >
          <div className="relative p-1">
            <Phone className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">{t.calls}</span>
          {activeTab === 'calls' && (
            <span className="w-8 h-1 bg-emerald-400 rounded-full mt-0.5 shadow-sm" />
          )}
        </button>

        {/* Quick Menu / Profile Drawer Toggle */}
        <button
          type="button"
          onClick={() => setShowMobileDrawer(true)}
          className={`flex-1 py-1 px-1 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Menu & Profile"
        >
          <div className="relative p-1">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover border border-emerald-500"
            />
          </div>
          <span className="text-[11px] tracking-tight">{t.profile}</span>
          {activeTab === 'profile' && (
            <span className="w-8 h-1 bg-emerald-400 rounded-full mt-0.5 shadow-sm" />
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* MOBILE SLIDE-OVER DRAWER (Extra options, language & profile) */}
      {/* ======================================================== */}
      {showMobileDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
          <div className="w-72 bg-slate-900 border-r border-slate-800 h-full flex flex-col p-5 shadow-2xl relative animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{t.appName}</h3>
                  <p className="text-[10px] text-emerald-400">Android Bengali/Hindi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info in Drawer */}
            <div className="py-4 border-b border-slate-800 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-xs text-slate-400 truncate">{currentUser.phone}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {t.online}
                </span>
              </div>
            </div>

            {/* Navigation links inside drawer */}
            <div className="py-4 space-y-1 flex-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-900/60 text-white">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  onOpenProfile();
                  setShowMobileDrawer(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t.profile} & Settings</span>
              </button>
            </div>

            {/* Language Switcher inside Drawer */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.languageSelect}</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['bn', 'hi', 'en'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => {
                      onLanguageChange(lng);
                      setShowMobileDrawer(false);
                    }}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      currentLang === lng
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lng === 'bn' ? 'বাংলা' : lng === 'hi' ? 'हिन्दी' : 'English'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
