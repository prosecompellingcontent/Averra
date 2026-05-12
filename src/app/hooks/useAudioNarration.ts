import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioNarrationProps {
  text: string;
  onComplete?: () => void;
  autoSave?: boolean;
  chapterId?: string;
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  currentPosition: number;
  totalDuration: number;
  rate: number;
  pitch: number;
  volume: number;
}

export function useAudioNarration({ text, onComplete, autoSave = true, chapterId }: UseAudioNarrationProps) {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    currentPosition: 0,
    totalDuration: 0,
    rate: 0.9, // Slightly slower for emotional delivery
    pitch: 0.95, // Slightly lower for warmth
    volume: 1.0,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textSegments = useRef<string[]>([]);
  const currentSegmentIndex = useRef(0);

  useEffect(() => {
    // Load saved audio position
    if (autoSave && chapterId) {
      const saved = localStorage.getItem(`audio-position-${chapterId}`);
      if (saved) {
        try {
          const { position, rate, pitch, volume } = JSON.parse(saved);
          setAudioState(prev => ({ ...prev, currentPosition: position, rate, pitch, volume }));
        } catch (e) {
          console.error('Failed to load audio position', e);
        }
      }
    }

    // Split text into natural segments for better control and pausing
    textSegments.current = splitIntoNaturalSegments(text);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, chapterId, autoSave]);

  const splitIntoNaturalSegments = (text: string): string[] => {
    // Split on paragraph breaks and punctuation for natural pauses
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    const segments: string[] = [];

    paragraphs.forEach(paragraph => {
      // Further split long paragraphs at sentence boundaries
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
      segments.push(...sentences.map(s => s.trim()));
    });

    return segments;
  };

  const selectOptimalVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();

    // Prioritize voices that sound warm, natural, and human
    // Prefer female voices with lower pitch for warmth
    const preferredVoices = [
      'Samantha', // macOS - warm, natural
      'Karen', // macOS - Australian, warm
      'Fiona', // macOS - Scottish, grounded
      'Google US English', // Cross-platform
      'Microsoft Zira', // Windows - natural
      'Google UK English Female',
    ];

    for (const preferred of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferred));
      if (voice) return voice;
    }

    // Fallback: find any en-US or en-GB female voice
    const femaleVoice = voices.find(v =>
      (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) &&
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
    );

    if (femaleVoice) return femaleVoice;

    // Last resort: any English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, []);

  const speak = useCallback((segmentIndex: number = 0) => {
    if (!window.speechSynthesis || segmentIndex >= textSegments.current.length) {
      if (onComplete) onComplete();
      return;
    }

    const segment = textSegments.current[segmentIndex];
    const utterance = new SpeechSynthesisUtterance(segment);

    // Apply voice characteristics for emotional, grounded delivery
    const voice = selectOptimalVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = audioState.rate; // Controlled, never rushed
    utterance.pitch = audioState.pitch; // Warm, lower register
    utterance.volume = audioState.volume;

    utterance.onstart = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      currentSegmentIndex.current = segmentIndex;
    };

    utterance.onend = () => {
      // Continue to next segment with natural pause
      setTimeout(() => {
        if (segmentIndex + 1 < textSegments.current.length) {
          speak(segmentIndex + 1);
        } else {
          setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentPosition: 0 }));
          if (onComplete) onComplete();
        }
      }, 300); // Brief pause between segments for breathing
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [audioState.rate, audioState.pitch, audioState.volume, selectOptimalVoice, onComplete]);

  const play = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      speak(currentSegmentIndex.current);
    }
  }, [speak]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setAudioState(prev => ({ ...prev, isPaused: true, isPlaying: false }));

      // Save position
      if (autoSave && chapterId) {
        const saveData = {
          position: currentSegmentIndex.current,
          rate: audioState.rate,
          pitch: audioState.pitch,
          volume: audioState.volume,
        };
        localStorage.setItem(`audio-position-${chapterId}`, JSON.stringify(saveData));
      }
    }
  }, [autoSave, chapterId, audioState.rate, audioState.pitch, audioState.volume]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    currentSegmentIndex.current = 0;
    setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentPosition: 0 }));
  }, []);

  const setRate = useCallback((rate: number) => {
    // Clamp rate to reasonable range (0.5 - 1.2) for emotional delivery
    const clampedRate = Math.max(0.5, Math.min(1.2, rate));
    setAudioState(prev => ({ ...prev, rate: clampedRate }));

    // Restart if currently playing to apply new rate
    if (audioState.isPlaying || audioState.isPaused) {
      const currentIndex = currentSegmentIndex.current;
      stop();
      setTimeout(() => speak(currentIndex), 100);
    }
  }, [audioState.isPlaying, audioState.isPaused, stop, speak]);

  const setPitch = useCallback((pitch: number) => {
    // Keep pitch in warm range (0.8 - 1.1)
    const clampedPitch = Math.max(0.8, Math.min(1.1, pitch));
    setAudioState(prev => ({ ...prev, pitch: clampedPitch }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setAudioState(prev => ({ ...prev, volume: clampedVolume }));
    if (utteranceRef.current) {
      utteranceRef.current.volume = clampedVolume;
    }
  }, []);

  const skipForward = useCallback(() => {
    if (currentSegmentIndex.current + 1 < textSegments.current.length) {
      stop();
      speak(currentSegmentIndex.current + 1);
    }
  }, [stop, speak]);

  const skipBackward = useCallback(() => {
    if (currentSegmentIndex.current > 0) {
      stop();
      speak(currentSegmentIndex.current - 1);
    }
  }, [stop, speak]);

  return {
    ...audioState,
    play,
    pause,
    stop,
    setRate,
    setPitch,
    setVolume,
    skipForward,
    skipBackward,
    progress: textSegments.current.length > 0
      ? (currentSegmentIndex.current / textSegments.current.length) * 100
      : 0,
  };
}
