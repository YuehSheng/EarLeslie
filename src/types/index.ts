export interface NoteRange {
  start: string;
  end: string;
}

export interface BaseSettings {
  autoNext: boolean;
  multipleAttempts: boolean;
}

export interface SingleSettings extends BaseSettings {
  noteRange: NoteRange;
  selectedNotes: string[];
}

export interface MultipleSettings extends BaseSettings {
  noteRange: NoteRange;
  selectedNotes: string[];
  noteCount: number;
}

export interface ChordSettings extends BaseSettings {
  chordTypes: string[];
}

export type Settings = SingleSettings | MultipleSettings | ChordSettings;
