import React, { useState } from 'react';
import { X, Users, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Contact, Language } from '../types';
import { translations } from '../utils/translations';

interface NewGroupModalProps {
  contacts: Contact[];
  currentLang: Language;
  onCreateGroup: (name: string, participantIds: string[], description?: string) => void;
  onClose: () => void;
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  contacts,
  currentLang,
  onCreateGroup,
  onClose,
}) => {
  const t = translations[currentLang];
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;
    onCreateGroup(groupName.trim(), selectedIds, description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600/30 text-teal-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.newGroup}</h3>
              <p className="text-xs text-slate-400">
                {currentLang === 'bn' ? 'বন্ধু বা পরিবারের গ্রুপ তৈরি করুন' : currentLang === 'hi' ? 'मित्रों या परिवार का नया ग्रुप बनाएं' : 'Create a group for friends & family'}
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Inputs */}
          <div className="p-4 space-y-3 border-b border-slate-800/80 bg-slate-950/40">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.groupName} *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder={t.groupSubjectPlaceholder}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {currentLang === 'bn' ? 'গ্রুপের বর্ণনা (ঐচ্ছিক)' : currentLang === 'hi' ? 'ग्रुप विवरण (वैकल्पिक)' : 'Description (optional)'}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={currentLang === 'bn' ? 'যেমন: আড্ডা ও প্ল্যানিং...' : 'जैसे: मस्ती और बातचीत...'}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Members Selection Header */}
          <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>{t.selectMembers}</span>
            <span className="text-teal-400 font-bold">
              {selectedIds.length} {t.members}
            </span>
          </div>

          {/* Members List */}
          <div className="overflow-y-auto p-3 space-y-1.5 flex-1">
            {contacts.map((contact) => {
              const isSelected = selectedIds.includes(contact.id);
              return (
                <div
                  key={contact.id}
                  onClick={() => toggleSelect(contact.id)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/50 border border-teal-700/60'
                      : 'hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white">{contact.name}</h4>
                      <p className="text-[11px] text-slate-400">{contact.phone}</p>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950'
                        : 'border-2 border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Submit */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!groupName.trim() || selectedIds.length === 0}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-teal-700/30 transition-all cursor-pointer"
            >
              <span>{t.createGroup}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
