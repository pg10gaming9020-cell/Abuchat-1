import React, { useState } from 'react';
import { X, Search, Phone, UserCheck, MessageSquare, Plus } from 'lucide-react';
import { Contact, Language } from '../types';
import { translations } from '../utils/translations';

interface NewChatModalProps {
  contacts: Contact[];
  currentLang: Language;
  onSelectContact: (contact: Contact) => void;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  contacts,
  currentLang,
  onSelectContact,
  onClose,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.nameBn && c.nameBn.toLowerCase().includes(q)) ||
      (c.nameHi && c.nameHi.toLowerCase().includes(q)) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.newChat}</h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'bn' ? 'বার্তা পাঠাতে বন্ধু নির্বাচন করুন' : currentLang === 'hi' ? 'बातचीत के लिए मित्र चुनें' : 'Select a contact to message'}
              </p>
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

        {/* Search */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => onSelectContact(contact)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-800/80 transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-700"
                    />
                    {contact.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                      {contact.name}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {currentLang === 'bn' ? contact.aboutBn || contact.about : currentLang === 'hi' ? contact.aboutHi || contact.about : contact.about}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0 ml-2">
                  Chat
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
