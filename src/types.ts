export type Theme = 'modern' | 'technical' | 'hardware' | 'brutalist' | 'minimal' | 'organic' | 'cyberpunk' | 'paper';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  relevance: number;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  duration: number; // minutes
  focusScore: number;
  attentionLevel: number;
  drowsinessLevel: number;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  type: 'focus' | 'break' | 'meeting';
}
