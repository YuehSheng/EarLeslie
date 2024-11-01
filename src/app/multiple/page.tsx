'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AudioPlayer from '@/components/AudioPlayer';
import SettingsPanel from '@/components/SettingsPanel';
import { generateNotesInRange, NOTES } from '@/utils/audio';
import { MultipleSettings } from '@/types';

export default function MultipleTraining() {
  const [settings, setSettings] = useState<MultipleSettings>({
    autoNext: true,
    multipleAttempts: true,
    noteRange: {
      start: 'C4',
      end: 'C5'
    },
    selectedNotes: NOTES,
    noteCount: 2
  });

  const [currentNotes, setCurrentNotes] = useState<string[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [availableNotes, setAvailableNotes] = useState<string[]>([]);

  useEffect(() => {
    const notes = generateNotesInRange(settings.noteRange.start, settings.noteRange.end);
    setAvailableNotes(notes);
    generateNewNotes(notes);
  }, [settings.noteRange, settings.noteCount]);

  const generateNewNotes = (notes: string[] = availableNotes) => {
    if (notes.length === 0) return;
    const newNotes: string[] = [];
    const notesCopy = [...notes];
    
    for (let i = 0; i < settings.noteCount; i++) {
      const randomIndex = Math.floor(Math.random() * notesCopy.length);
      newNotes.push(notesCopy[randomIndex]);
      notesCopy.splice(randomIndex, 1);
    }
    
    setCurrentNotes(newNotes);
    setSelectedNotes([]);
    setShowAnswer(false);
  };

  const handleNoteSelect = (note: string) => {
    if (showAnswer && !settings.multipleAttempts) return;
    
    if (selectedNotes.includes(note)) {
      setSelectedNotes(prev => prev.filter(n => n !== note));
    } else if (selectedNotes.length < settings.noteCount) {
      setSelectedNotes(prev => [...prev, note]);
    }
  };

  const checkAnswer = () => {
    if (selectedNotes.length !== settings.noteCount) return;

    const sortedCurrent = [...currentNotes].sort();
    const sortedSelected = [...selectedNotes].sort();
    const isCorrect = sortedCurrent.every((note, index) => note === sortedSelected[index]);

    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    if (isCorrect && settings.autoNext) {
      generateNewNotes();
    } else {
      setShowAnswer(true);
    }
  };

  return (
    <>
      <Navigation />
      <div className="pt-20 pb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">複音訓練</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">基準音</h2>
              <AudioPlayer note="C4" />
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4">問題音</h2>
              <AudioPlayer notes={currentNotes} />
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
                  onClick={() => handleNoteSelect(note + '4')}
                  className={`btn ${
                    showAnswer
                      ? currentNotes.includes(note + '4')
                        ? 'bg-green-500 hover:bg-green-600'
                        : selectedNotes.includes(note + '4')
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'btn-secondary'
                      : selectedNotes.includes(note + '4')
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'btn-secondary'
                  }`}
                  disabled={showAnswer && !settings.multipleAttempts}
                >
                  {note}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center space-x-4">
              {!showAnswer && selectedNotes.length === settings.noteCount && (
                <button
                  onClick={checkAnswer}
                  className="btn btn-primary"
                >
                  確認答案
                </button>
              )}
              {showAnswer && (
                <button
                  onClick={() => generateNewNotes()}
                  className="btn btn-primary"
                >
                  下一題
                </button>
              )}
            </div>
          </div>
        </div>

        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          type="multiple"
        />
      </div>
    </>
  );
}
