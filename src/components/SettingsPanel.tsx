'use client';

import { useState } from 'react';
import { SingleSettings, MultipleSettings, ChordSettings } from '@/types';

type SettingsByType = {
  single: SingleSettings;
  multiple: MultipleSettings;
  chord: ChordSettings;
};

interface SettingsPanelProps<T extends keyof SettingsByType> {
  settings: SettingsByType[T];
  onSettingsChange: (settings: SettingsByType[T]) => void;
  type: T;
}

export default function SettingsPanel<T extends keyof SettingsByType>({
  settings,
  onSettingsChange,
  type
}: SettingsPanelProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = <K extends keyof SettingsByType[T]>(
    key: K,
    value: SettingsByType[T][K]
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const updateNoteRange = (update: Partial<{ start: string; end: string }>) => {
    if (type === 'chord') return;
    const currentSettings = settings as SingleSettings | MultipleSettings;
    handleChange('noteRange' as keyof SettingsByType[T], {
      ...currentSettings.noteRange,
      ...update
    } as SettingsByType[T][keyof SettingsByType[T]]);
  };

  return (
    <div className="fixed right-4 top-20 z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary mb-2 w-full"
      >
        {isOpen ? '關閉設定' : '開啟設定'}
      </button>

      {isOpen && (
        <div className="card w-64">
          <h3 className="text-lg font-bold mb-4">練習設定</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm">答對後自動下一題</label>
              <input
                type="checkbox"
                checked={settings.autoNext}
                onChange={(e) => handleChange('autoNext' as keyof SettingsByType[T], e.target.checked as SettingsByType[T][keyof SettingsByType[T]])}
                className="form-checkbox h-4 w-4"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">允許多次嘗試</label>
              <input
                type="checkbox"
                checked={settings.multipleAttempts}
                onChange={(e) => handleChange('multipleAttempts' as keyof SettingsByType[T], e.target.checked as SettingsByType[T][keyof SettingsByType[T]])}
                className="form-checkbox h-4 w-4"
              />
            </div>

            {(type === 'single' || type === 'multiple') && (
              <div className="space-y-2">
                <label className="text-sm block">音域範圍</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={(settings as SingleSettings | MultipleSettings).noteRange.start}
                    onChange={(e) => updateNoteRange({ start: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="C3">C3</option>
                    <option value="C4">C4</option>
                    <option value="C5">C5</option>
                  </select>
                  <select
                    value={(settings as SingleSettings | MultipleSettings).noteRange.end}
                    onChange={(e) => updateNoteRange({ end: e.target.value })}
                    className="input text-sm"
                  >
                    <option value="C4">C4</option>
                    <option value="C5">C5</option>
                    <option value="C6">C6</option>
                  </select>
                </div>
              </div>
            )}

            {type === 'multiple' && (
              <div className="space-y-2">
                <label className="text-sm block">音符數量</label>
                <select
                  value={(settings as MultipleSettings).noteCount}
                  onChange={(e) => handleChange('noteCount' as keyof SettingsByType[T], parseInt(e.target.value) as SettingsByType[T][keyof SettingsByType[T]])}
                  className="input w-full text-sm"
                >
                  <option value="2">2個音符</option>
                  <option value="3">3個音符</option>
                  <option value="4">4個音符</option>
                </select>
              </div>
            )}

            {type === 'chord' && (
              <div className="space-y-2">
                <label className="text-sm block">和弦類型</label>
                <div className="space-y-1">
                  {[
                    ['major', '大三和弦'],
                    ['minor', '小三和弦'],
                    ['major7', '大七和弦'],
                    ['minor7', '小七和弦'],
                    ['dim7', '減七和弦'],
                    ['half_dim7', '半減七和弦'],
                    ['aug', '增和弦']
                  ].map(([value, label]) => (
                    <div key={value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(settings as ChordSettings).chordTypes.includes(value)}
                        onChange={(e) => {
                          const currentSettings = settings as ChordSettings;
                          const newChordTypes = e.target.checked
                            ? [...currentSettings.chordTypes, value]
                            : currentSettings.chordTypes.filter(t => t !== value);
                          handleChange('chordTypes' as keyof SettingsByType[T], newChordTypes as SettingsByType[T][keyof SettingsByType[T]]);
                        }}
                        className="form-checkbox h-4 w-4 mr-2"
                      />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
