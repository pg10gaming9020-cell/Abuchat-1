import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, PhoneOff, RefreshCw, Sparkles, MessageCircle } from 'lucide-react';
import { ActiveCall, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/soundEffects';

interface CallModalProps {
  call: ActiveCall;
  currentLang: Language;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  call,
  currentLang,
  onEndCall,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
}) => {
  const t = translations[currentLang];
  const [duration, setDuration] = useState(0);
  const [status, setStatus] = useState<'ringing' | 'connected'>('ringing');
  const [webcamActive, setWebcamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sound and connection simulation
  useEffect(() => {
    sounds.startOutgoingRinging();

    // Simulate friend picking up after 3 seconds
    const connectTimer = setTimeout(() => {
      sounds.stopRinging();
      setStatus('connected');
    }, 3200);

    return () => {
      clearTimeout(connectTimer);
      sounds.stopRinging();
    };
  }, []);

  // Duration counter when connected
  useEffect(() => {
    let interval: number;
    if (status === 'connected') {
      interval = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Handle local webcam when in video call
  useEffect(() => {
    if (call.callType === 'video' && !call.isCameraOff) {
      navigator.mediaDevices?.getUserMedia({
        video: { facingMode },
        audio: true,
      })
      .then((stream) => {
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setWebcamActive(true);
      })
      .catch((err) => {
        console.warn('Webcam permission not granted or available in iframe:', err);
        setWebcamActive(false);
      });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      setWebcamActive(false);
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [call.callType, call.isCameraOff, facingMode]);

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col justify-between items-center p-6 text-white overflow-hidden backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-radial from-emerald-950/40 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Top Header: Security and Encryption notice */}
      <div className="relative z-10 w-full flex flex-col items-center pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-medium tracking-wide bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>End-to-end encrypted Abu Call</span>
        </div>
      </div>

      {/* Center Zone */}
      {call.callType === 'video' ? (
        <div className="relative z-10 w-full max-w-md flex-1 my-4 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-2xl">
          {/* Main Simulated Remote Video (The contact's video feed) */}
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900">
            <img
              src={call.contact.avatar}
              alt={call.contact.name}
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60" />

            {/* Remote contact info banner */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white drop-shadow">
                  {call.contact.name}
                </h3>
                <p className="text-xs text-emerald-300 font-medium">
                  {status === 'ringing' ? t.ringing : formatTimer(duration)}
                </p>
              </div>
            </div>

            {/* Local Video Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-28 h-40 rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-2xl bg-slate-950">
              {call.isCameraOff ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 text-[10px] text-center p-2">
                  <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                  <span>Camera off</span>
                </div>
              ) : webcamActive ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-300 p-2 text-center text-[10px]">
                  <Video className="w-5 h-5 mb-1 text-emerald-400 animate-pulse" />
                  <span>Your Camera</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Audio Call View */
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {/* Pulsating avatar rings */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
            <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse" />
            <img
              src={call.contact.avatar}
              alt={call.contact.name}
              className="relative w-32 h-32 rounded-full object-cover border-4 border-emerald-500/80 shadow-2xl"
            />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
            {call.contact.name}
          </h2>
          <p className="text-sm font-semibold text-emerald-400 tracking-wide mb-2">
            {status === 'ringing' ? t.ringing : formatTimer(duration)}
          </p>
          <p className="text-xs text-slate-400 max-w-xs text-center">
            {call.contact.phone}
          </p>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl mb-4">
        <div className="flex items-center justify-around gap-2">
          {/* Mute Mic */}
          <button
            type="button"
            onClick={onToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              call.isMuted
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={call.isMuted ? t.unmute : t.mute}
          >
            {call.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Camera (in video call) or Toggle Speaker (in audio call) */}
          {call.callType === 'video' ? (
            <>
              <button
                type="button"
                onClick={onToggleCamera}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  call.isCameraOff
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={t.camera}
              >
                {call.isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={toggleCameraFacing}
                className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all cursor-pointer"
                title={t.flipCamera}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onToggleSpeaker}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                call.isSpeakerOn
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title={t.speaker}
            >
              {call.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          )}

          {/* End Call Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playCallEnd();
              onEndCall();
            }}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
            title={t.endCall}
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
