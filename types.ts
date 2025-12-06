export type SenderType = 'me' | 'them';

export interface Message {
  id: string;
  text: string;
  sender: SenderType;
  timestamp?: string;
  isLike?: boolean; // simulating the double-tap heart
}

export interface UserProfile {
  username: string;
  avatarUrl: string;
  isVerified?: boolean;
}

export interface ChatState {
  myProfile: UserProfile;
  theirProfile: UserProfile;
  messages: Message[];
  batteryLevel: number;
  time: string;
}

export interface GenerationRequest {
  topic: string;
  tone: string;
  messageCount: number;
}
