'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AudioPlayer from '@/components/AudioPlayer';
import SettingsPanel from '@/components/SettingsPanel';
import { generateNotesInRange, NOTES } from '@/utils/audio';
import { SingleSettings } from '@/types';

export default function SingleTraining() {
  const [settings, setSettings] = useState<SingleSettings>({
    autoNext: true,
    multipleAttempts: true,
    noteRange: {
      start: 'C4',
      end: 'C5'
    },
    selectedNotes: NOTES
  });

  const [currentNote, setCurrentNote] = useState<string>('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [availableNotes, setAvailableNotes] = useState<string[]>([]);

  useEffect(() => {
    const notes = generateNotesInRange(settings.noteRange.start, settings.noteRange.end);
    setAvailableNotes(notes);
    generateNewNote(notes);
  }, [settings.noteRange]);

  const generateNewNote = (notes: string[] = availableNotes) => {
    if (notes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * notes.length);
    setCurrentNote(notes[randomIndex]);
    setShowAnswer(false);
  };

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentNote;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect && settings.autoNext) {
      generateNewNote();
    } else {
      setShowAnswer(true);
    }
  };

  const handleSettingsChange = (newSettings: SingleSettings) => {
    setSettings(newSettings);
  };

  return (
    <>
      <Navigation />
      <div className="pt-20 pb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">單音訓練</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">基準音</h2>
              <AudioPlayer note="C4" />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">問題音</h2>
              <AudioPlayer note={currentNote} />
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
            <div className="grid grid-cols-3 gap-2">
              {NOTES.map(note => (
                <button
                  key={note}
                  onClick={() => handleAnswer(note + '4')}
                  className={`btn ${
                    showAnswer
                      ? note + '4' === currentNote
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                      : 'btn-secondary'
                  }`}
                  disabled={showAnswer && !settings.multipleAttempts}
                >
                  {note}
                </button>
              ))}
            </div>
            {showAnswer && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => generateNewNote()}
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
          onSettingsChange={handleSettingsChange}
          type="single"
        />
      </div>
    </>
  );
}
