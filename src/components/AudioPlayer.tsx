'use client';

import { useEffect, useState } from 'react';
import { audioManager } from '@/utils/audio';

interface AudioPlayerProps {
  note?: string;
  notes?: string[];
  isChord?: boolean;
  autoPlay?: boolean;
  duration?: number;
  onPlay?: () => void;
}

export default function AudioPlayer({
  note,
  notes = [],
  isChord = false,
  autoPlay = false,
  duration = 1000,
  onPlay
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      handlePlay();
    }
  }, [autoPlay, note, notes]);

  const handlePlay = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    if (note) {
      audioManager.playNote(note, duration);
    } else if (notes.length > 0) {
      if (isChord) {
        audioManager.playChord(notes, duration);
      } else {
        // 依序播放音符
        notes.forEach((n, index) => {
          setTimeout(() => {
            audioManager.playNote(n, duration);
          }, index * duration);
        });
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, isChord ? duration : notes.length * duration);

    onPlay?.();
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'} w-full max-w-xs`}
    >
      {isPlaying ? '播放中...' : '播放音頻'}
    </button>
  );
}
