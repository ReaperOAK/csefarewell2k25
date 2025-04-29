export interface Invitee {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  photoUrl: string;
  attending: boolean | null;
  response?: string;
  additionalGuests?: number;
  notes?: string;
  timestamp?: number;
}

export interface AmpStoryData {
  inviteeId: string;
  name: string;
  customMessage?: string;
  attended?: boolean;
}

export interface RSVPFormData {
  attending: boolean;
  response: string;
}