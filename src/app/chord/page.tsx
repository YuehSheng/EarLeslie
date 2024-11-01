'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AudioPlayer from '@/components/AudioPlayer';
import SettingsPanel from '@/components/SettingsPanel';
import { CHORD_TYPES } from '@/utils/audio';
import { ChordSettings } from '@/types';

const CHORD_LABELS: Record<string, string> = {
  major: '大三和弦',
  minor: '小三和弦',
  major7: '大七和弦',
  minor7: '小七和弦',
  dim7: '減七和弦',
  half_dim7: '半減七和弦',
  aug: '增和弦'
};

export default function ChordTraining() {
  const [settings, setSettings] = useState<ChordSettings>({
    autoNext: true,
    multipleAttempts: true,
    chordTypes: ['major', 'minor']
  });

  const [currentChord, setCurrentChord] = useState<{
    type: string;
    notes: string[];
  }>({
    type: 'major',
    notes: ['C4', 'E4', 'G4']
  });
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);

  const generateNewChord = () => {
    if (settings.chordTypes.length === 0) return;

    const randomType = settings.chordTypes[
      Math.floor(Math.random() * settings.chordTypes.length)
    ];
    
    // 使用 C4 (MIDI 音符號 60) 作為根音生成和弦
    const intervals = CHORD_TYPES[randomType as keyof typeof CHORD_TYPES];
    
    // 根據和弦類型的音程生成完整和弦
    const notes = intervals.map(interval => {
      const noteNumber = 60 + interval; // C4 的 MIDI 音符號是 60
      const octave = Math.floor(noteNumber / 12);
      const note = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][noteNumber % 12];
      return note + octave;
    });

    setCurrentChord({ type: randomType, notes });
    setShowAnswer(false);
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentChord.type;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect && settings.autoNext) {
      generateNewChord();
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <>
      <Navigation />
      <div className="pt-20 pb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">和弦訓練</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">基準音</h2>
              <AudioPlayer note="C4" />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">問題和弦</h2>
              <AudioPlayer notes={currentChord.notes} isChord />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">得分</h2>
              <p className="text-2xl text-center">
                {score.correct} / {score.total}
                {score.total > 0 && (
                  <span className="text-lg text-gray-500 ml-2">
                    ({Math.round((score.correct / score.total) * 100)}%)
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">選擇答案</h2>
            <div className="grid grid-cols-1 gap-2">
              {settings.chordTypes.map(type => (
                <button
                  key={type}
                  onClick={() => handleAnswer(type)}
                  className={`btn ${
                    showAnswer
                      ? type === currentChord.type
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                      : 'btn-secondary'
                  }`}
                  disabled={showAnswer && !settings.multipleAttempts}
                >
                  {CHORD_LABELS[type]}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => generateNewChord()}
                  className="btn btn-primary"
                >
                  下一題
                </button>
              </div>
            )}
          </div>
        </div>

        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          type="chord"
        />
      </div>
    </>
  );
}
