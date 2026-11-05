import React, { useEffect } from 'react';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react';
import { ActiveCall, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface IncomingCallModalProps {
  call: ActiveCall;
  currentLang: Language;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  call,
  currentLang,
  onAccept,
  onDecline,
}) => {
  const t = translations[currentLang];

  useEffect(() => {
    sounds.startIncomingRingtone();
    return () => {
      sounds.stopRinging();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between items-center p-6 text-white animate-in fade-in duration-200">
      <div className="pt-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/70 border border-emerald-800/50 rounded-full text-xs font-semibold text-emerald-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Abu Chat {call.callType === 'video' ? t.videoCall : t.audioCall}</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {call.contact.name}
        </h2>
        <p className="text-sm text-emerald-400 mt-1 font-medium">
          {call.callType === 'video' ? t.incomingVideoCall : t.incomingAudioCall}
        </p>
      </div>

      {/* Pulsing Contact Avatar */}
      <div className="relative my-auto">
        <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" />
        <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse" />
        <img
          src={call.contact.avatar}
          alt={call.contact.name}
          className="relative w-36 h-36 rounded-full object-cover border-4 border-emerald-500 shadow-2xl"
        />
      </div>

      {/* Action Buttons: Decline (Red) & Accept (Green) */}
      <div className="w-full max-w-sm flex items-center justify-around pb-10">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playCallEnd();
              onDecline();
            }}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          <span className="text-xs font-medium text-slate-300">{t.decline}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.stopRinging();
              onAccept();
            }}
            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 transition-transform cursor-pointer animate-bounce"
          >
            {call.callType === 'video' ? (
              <Video className="w-7 h-7" />
            ) : (
              <Phone className="w-7 h-7" />
            )}
          </button>
          <span className="text-xs font-medium text-emerald-400">{t.accept}</span>
        </div>
      </div>
    </div>
  );
};
