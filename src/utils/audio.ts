export class AudioManager {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // AudioContext 需要在用戶交互後創建
    this.initAudioContext = this.initAudioContext.bind(this);
    this.playNote = this.playNote.bind(this);
    this.stopNote = this.stopNote.bind(this);
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
  }

  // 將音名轉換為頻率
  private noteToFrequency(note: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = parseInt(note.slice(-1));
    const noteIndex = notes.indexOf(note.slice(0, -1));
    
    if (noteIndex === -1) return 440; // 默認 A4
    
    // A4 = 440Hz
    const a4 = 440;
    const n = noteIndex - notes.indexOf('A') + (octave - 4) * 12;
    return a4 * Math.pow(2, n / 12);
  }

  public async playNote(note: string, duration: number = 1000) {
    this.initAudioContext();
    if (!this.audioContext) return;

    // 停止當前播放的音符
    this.stopNote();

    // 創建新的音頻節點
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    // 設置音頻參數
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(
      this.noteToFrequency(note),
      this.audioContext.currentTime
    );

    // 設置音量淡入淡出
    this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.01);
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);

    // 連接節點
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // 開始播放
    this.oscillator.start();
    this.oscillator.stop(this.audioContext.currentTime + duration / 1000);
  }

  public playChord(notes: string[], duration: number = 1000) {
    notes.forEach(note => this.playNote(note, duration));
  }

  public stopNote() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }
}

// 單例模式
export const audioManager = new AudioManager();

// 音符範圍
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 和弦類型
export const CHORD_TYPES = {
  major: [0, 4, 7], // 大三和弦
  minor: [0, 3, 7], // 小三和弦
  major7: [0, 4, 7, 11], // 大七和弦
  minor7: [0, 3, 7, 10], // 小七和弦
  dim7: [0, 3, 6, 9], // 減七和弦
  half_dim7: [0, 3, 6, 10], // 半減七和弦
  aug: [0, 4, 8], // 增和弦
};

// 生成指定音域範圍內的音符
export function generateNotesInRange(startNote: string, endNote: string): string[] {
  const notes = [];
  const startOctave = parseInt(startNote.slice(-1));
  const endOctave = parseInt(endNote.slice(-1));
  const startNoteIndex = NOTES.indexOf(startNote.slice(0, -1));
  const endNoteIndex = NOTES.indexOf(endNote.slice(0, -1));

  for (let octave = startOctave; octave <= endOctave; octave++) {
    for (let i = 0; i < NOTES.length; i++) {
      if (
        (octave === startOctave && i < startNoteIndex) ||
        (octave === endOctave && i > endNoteIndex)
      ) {
        continue;
      }
      notes.push(NOTES[i] + octave);
    }
  }

  return notes;
}
