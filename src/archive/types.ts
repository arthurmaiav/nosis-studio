export type ArchiveSourceType = "mail" | "event" | "resident" | "journal";

export type ArchiveSnapshot = {
  id: string;
  builtAt: string;
  sourceUrl: string;
  rawDirectory: string;
  manifest: {
    mailLetters: number;
    residents: number;
    events: number;
    note: string;
  };
};

export type ArchiveRecord = {
  id: string;
  snapshotId: string;
  sourceType: ArchiveSourceType;
  iso: string | null;
  timestamp: number | null;
  actor: string;
  target: string;
  subject: string;
  body: string;
  locator: string;
  metadata: Record<string, unknown>;
  rank: number | null;
};

export type ArchiveSearchOptions = {
  sourceTypes?: ArchiveSourceType[];
  actors?: string[];
  limit?: number;
};

export type SyncArchiveOptions = {
  sourceUrl: string;
  rawDataDirectory: string;
  databasePath: string;
  snapshotDirectory?: string;
  forceDownload?: boolean;
  forceIndex?: boolean;
};

export type SyncArchiveResult = {
  snapshot: ArchiveSnapshot;
  databasePath: string;
  indexedRecords: number;
  reusedIndex: boolean;
};
