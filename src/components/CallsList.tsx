import React, { useState } from 'react';
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Plus, Sparkles, UserPlus } from 'lucide-react';
import { CallLogItem, Contact, Language } from '../types';
import { translations } from '../utils/translations';

interface CallsListProps {
  callLogs: CallLogItem[];
  contacts: Contact[];
  currentLang: Language;
  onStartCall: (type: 'audio' | 'video', contact: Contact) => void;
  onSimulateIncoming: (contact: Contact, type: 'audio' | 'video') => void;
}

export const CallsList: React.FC<CallsListProps> = ({
  callLogs,
  contacts,
  currentLang,
  onStartCall,
  onSimulateIncoming,
}) => {
  const t = translations[currentLang];
  const [showNewCallDrawer, setShowNewCallDrawer] = useState(false);

  const getDirectionIcon = (direction: CallLogItem['direction']) => {
    switch (direction) {
      case 'incoming':
        return <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-3.5 h-3.5 text-sky-400" />;
      case 'missed':
        return <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Top Banner: Incoming Call Simulation Button */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-800/40 rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {t.simulateIncoming}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {currentLang === 'bn' ? 'টেস্ট করতে বন্ধুদের থেকে রিং বাজান' : 'टेस्ट करने के लिए दोस्तों से कॉल रिसीव करें'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSimulateIncoming(contacts[0], 'audio')}
            className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Phone className="w-3 h-3" />
            <span>Audio</span>
          </button>
          <button
            type="button"
            onClick={() => onSimulateIncoming(contacts[1], 'video')}
            className="px-2.5 py-1.5 bg-teal-600/30 hover:bg-teal-600/40 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Call History List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          {currentLang === 'bn' ? 'সাম্প্রতিক কল' : currentLang === 'hi' ? 'हालिया कॉल्स' : 'Recent Calls'}
        </h4>

        {callLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/50 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={log.contact.avatar}
                alt={log.contact.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-700/80"
              />
              <div>
                <h5 className="text-sm font-semibold text-white leading-tight">
                  {log.contact.name}
                </h5>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  {getDirectionIcon(log.direction)}
                  <span>{log.timestamp}</span>
                  {log.durationSec > 0 && (
                    <span className="text-slate-500">
                      ({Math.floor(log.durationSec / 60)}m {log.durationSec % 60}s)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartCall(log.type, log.contact)}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-emerald-600/30 text-emerald-400 border border-slate-700 hover:border-emerald-500/40 transition-colors cursor-pointer"
              title={`Call ${log.contact.name}`}
            >
              {log.type === 'video' ? (
                <Video className="w-4 h-4" />
              ) : (
                <Phone className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Start New Call Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowNewCallDrawer(true)}
          className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-2xl text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>{currentLang === 'bn' ? 'নতুন কল শুরু করুন' : 'नई कॉल शुरू करें'}</span>
        </button>
      </div>

      {/* Contact selector modal for new call */}
      {showNewCallDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col justify-end p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md mx-auto w-full max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {currentLang === 'bn' ? 'কাকে কল করতে চান?' : 'किसे कॉल करना चाहते हैं?'}
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCallDrawer(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                {t.cancel}
              </button>
            </div>

            <div className="overflow-y-auto py-2 space-y-2 flex-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="text-sm font-semibold text-white">{contact.name}</h5>
                      <p className="text-xs text-slate-400">{contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCallDrawer(false);
                        onStartCall('audio', contact);
                      }}
                      className="p-2 bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full transition-colors cursor-pointer"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCallDrawer(false);
                        onStartCall('video', contact);
                      }}
                      className="p-2 bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-full transition-colors cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
