
export enum ModStatus {
  PROPOSED = 'proposed',
  ACTIVE = 'active',
  REJECTED = 'rejected'
}

export enum SuggestionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export type NameEffect = 'none' | 'gold' | 'rainbow';

export interface UserProfile {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: number;
  isAdmin?: boolean;
  nameColor?: string;
  nameEffect?: NameEffect;
}

export interface Mod {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  category: string;
  status: ModStatus;
  createdAt: number;
  createdBy: string;
  voteCount: number;
}

export interface Vote {
  id: string; // modId_uid
  modId: string;
  uid: string;
  createdAt: number;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  status: SuggestionStatus;
  createdAt: number;
  createdBy: string;
  creatorName: string;
  creatorColor?: string;
  creatorEffect?: NameEffect;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down'; // Track current user's vote locally
  reviewedAt?: number;
  reviewNote?: string;
}

export interface ServerSnapshot {
  timestamp: number;
  playersOnline: number;
  tpsAvg60: number;
  jvmUsedMem: number;
  jvmMaxMem: number;
  chunksActive: number;
  entitiesActive: number;
  sourceOk: boolean;
  createdAt: number;
}
