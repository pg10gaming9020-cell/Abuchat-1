import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, CheckCircle2, MessageSquare, Globe, Sparkles } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../utils/translations';
import { CURRENT_USER } from '../data/initialData';

interface AuthScreenProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserProfile) => void;
}

const COUNTRY_CODES = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵' },
  { name: 'UAE', code: '+971', flag: '🇦🇪' },
  { name: 'USA', code: '+1', flag: '🇺🇸' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentLang,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const t = translations[currentLang];
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('742918');
  const [userName, setUserName] = useState('Abu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) {
      setErrorMessage(currentLang === 'bn' ? 'সঠিক মোবাইল নম্বর লিখুন' : currentLang === 'hi' ? 'कृपया मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid mobile number');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpCode(code); // Pre-fill for ultra smooth testing
      setIsSubmitting(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== generatedOtp && otpCode.length < 4) {
      setErrorMessage(currentLang === 'bn' ? 'ভুল ওটিপি কোড!' : currentLang === 'hi' ? 'गलत ओटीपी कोड!' : 'Invalid OTP code!');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      const user: UserProfile = {
        ...CURRENT_USER,
        name: userName.trim() || 'Abu',
        phone: `${selectedCountry.code} ${phoneNumber}`,
        language: currentLang,
      };
      setIsSubmitting(false);
      onLoginSuccess(user);
    }, 500);
  };

  const handleQuickDemo = (role: 'abu' | 'rahul' | 'priya') => {
    if (role === 'abu') {
      onLoginSuccess(CURRENT_USER);
    } else if (role === 'rahul') {
      onLoginSuccess({
        id: 'contact_rahul',
        name: 'Rahul Sen (রাহুল)',
        phone: '+91 98301 22334',
        avatar: '/src/assets/images/rahul_friend_avatar_1793902604235.jpg',
        about: 'Always ready for tea and cricket! ☕🏏',
        language: currentLang === 'en' ? 'en' : 'bn',
        isOnline: true,
      });
    } else {
      onLoginSuccess({
        id: 'contact_priya',
        name: 'Priya Sharma (প্রিয়া)',
        phone: '+880 1712 345678',
        avatar: '/src/assets/images/priya_friend_avatar_1793902603101.jpg',
        about: 'Design & photography ✨ শুভ চিন্তা',
        language: currentLang === 'en' ? 'en' : 'hi',
        isOnline: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center p-4">
      {/* Language Switcher Bar at top */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          <span>Abu Chat</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 backdrop-blur-sm">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {(['bn', 'hi', 'en'] as Language[]).map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => onLanguageChange(lng)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                currentLang === lng
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lng === 'bn' ? 'বাংলা' : lng === 'hi' ? 'हिन्दी' : 'EN'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-3">
            <MessageSquare className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {t.appName}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {t.tagline}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {currentLang === 'bn' ? 'আপনার নাম' : currentLang === 'hi' ? 'आपका नाम' : 'Your Name'}
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Abu (আবু / अबू)"
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.enterMobile}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedCountry.code}
                  onChange={(e) => {
                    const found = COUNTRY_CODES.find((c) => c.code === e.target.value);
                    if (found) setSelectedCountry(found);
                  }}
                  className="bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white px-2.5 py-2.5 focus:outline-none focus:border-emerald-500"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t.getOtp}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {currentLang === 'bn' ? `OTP কোড: ${generatedOtp}` : currentLang === 'hi' ? `OTP कोड: ${generatedOtp}` : `Demo OTP: ${generatedOtp}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(generatedOtp)}
                className="text-[11px] underline text-emerald-200 hover:text-white"
              >
                Auto-fill
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.enterOtp} ({selectedCountry.code} {phoneNumber})
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full tracking-widest text-center text-xl font-bold py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 h-11 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/30 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.verifyLogin}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Login Option */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.quickLogin}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('abu')}
              className="py-2 px-2 bg-slate-800/70 hover:bg-emerald-900/40 hover:border-emerald-600/60 border border-slate-700/70 rounded-xl text-xs font-medium text-slate-200 transition-colors text-center cursor-pointer"
            >
              {t.demoAbu}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rahul')}
              className="py-2 px-2 bg-slate-800/70 hover:bg-emerald-900/40 hover:border-emerald-600/60 border border-slate-700/70 rounded-xl text-xs font-medium text-slate-200 transition-colors text-center cursor-pointer"
            >
              {t.demoRahul}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('priya')}
              className="py-2 px-2 bg-slate-800/70 hover:bg-emerald-900/40 hover:border-emerald-600/60 border border-slate-700/70 rounded-xl text-xs font-medium text-slate-200 transition-colors text-center cursor-pointer"
            >
              {t.demoPriya}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
