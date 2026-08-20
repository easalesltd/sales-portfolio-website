'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CLASSIFIED_SPEECH,
  formatRoastForClassifiedSpeech,
  pickClassifiedVoice,
} from '@/app/lib/english-pyramid-classified-voice';

type Props = {
  roast: string;
};

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

export default function ClassifiedRoastButton({ roast }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (resumeTimerRef.current) {
      clearInterval(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setSpeaking(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setUnsupported(true);
      return;
    }

    const refreshVoice = () => {
      const voice = pickClassifiedVoice(loadVoices());
      setVoiceName(voice?.name ?? null);
    };

    refreshVoice();
    window.speechSynthesis.addEventListener('voiceschanged', refreshVoice);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', refreshVoice);
      stop();
    };
  }, [stop]);

  const play = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setUnsupported(true);
      return;
    }

    stop();
    const voice = pickClassifiedVoice(loadVoices());
    const lines = formatRoastForClassifiedSpeech(roast);
    setVoiceName(voice?.name ?? null);
    setSpeaking(true);

    lines.forEach((line, index) => {
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.rate = CLASSIFIED_SPEECH.rate;
      utterance.pitch = CLASSIFIED_SPEECH.pitch;
      utterance.volume = CLASSIFIED_SPEECH.volume;
      utterance.lang = voice?.lang || 'en-GB';
      if (voice) utterance.voice = voice;
      if (index === lines.length - 1) {
        utterance.onend = () => {
          if (resumeTimerRef.current) {
            clearInterval(resumeTimerRef.current);
            resumeTimerRef.current = null;
          }
          setSpeaking(false);
        };
        utterance.onerror = () => setSpeaking(false);
      }
      window.speechSynthesis.speak(utterance);
    });

    // Chrome silently kills long speechSynthesis jobs unless kept alive.
    resumeTimerRef.current = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        if (resumeTimerRef.current) {
          clearInterval(resumeTimerRef.current);
          resumeTimerRef.current = null;
        }
        setSpeaking(false);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 8000);
  };

  if (unsupported) return null;

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : play())}
      className="inline-flex items-center rounded-md border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#f2d36b] transition hover:bg-[#d4af37]/20"
      aria-pressed={speaking}
      aria-label={
        speaking
          ? 'Stop classified roast'
          : 'Play the roast in classified football results style'
      }
      title={
        voiceName
          ? `Classified-results homage using ${voiceName}`
          : 'Classified-results homage using your phone’s British voice'
      }
    >
      {speaking ? 'Stop classified roast' : 'Play classified roast'}
    </button>
  );
}
