import React from 'react';
import { X, Download, Share2, ZoomIn } from 'lucide-react';

interface MediaViewerProps {
  mediaUrl: string;
  type: 'image' | 'video';
  caption?: string;
  senderName?: string;
  timestamp?: string;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaUrl,
  type,
  caption,
  senderName,
  timestamp,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex items-center justify-between text-white p-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h4 className="text-sm font-semibold text-white">{senderName || 'Media'}</h4>
            {timestamp && <span className="text-[11px] text-slate-400">{timestamp}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={mediaUrl}
            download="abu-chat-media"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Media Content */}
      <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        {type === 'video' ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            playsInline
            className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={caption || 'Chat photo'}
            className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl select-none"
          />
        )}
      </div>

      {/* Caption footer if present */}
      {caption && (
        <div className="w-full max-w-lg mx-auto bg-black/60 backdrop-blur-md text-white text-center py-2.5 px-4 rounded-xl text-sm mb-4 border border-white/10">
          <p>{caption}</p>
        </div>
      )}
    </div>
  );
};
