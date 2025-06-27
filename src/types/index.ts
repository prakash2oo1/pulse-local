export interface Submission {
  id: string;
  text: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  sentiment: {
    score: number; // -1 to 1
    magnitude: number; // 0 to 1
    label: 'positive' | 'negative' | 'neutral';
  };
  topics?: string[];
}

export interface TopicCluster {
  id: string;
  label: string;
  center: [number, number];
  radius: number;
  submissions: Submission[];
  strength: number; // 0 to 1
  emergent: boolean;
}

export interface SentimentHeatmapPoint {
  latitude: number;
  longitude: number;
  sentiment: number;
  intensity: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}