import { NewsItem, FocusSession, ScheduleEvent } from './types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'The Future of Neural Interfaces in Productivity',
    summary: 'How direct brain-computer links are reshaping how we focus and execute complex tasks.',
    source: 'TechDaily',
    category: 'Technology',
    relevance: 0.95
  },
  {
    id: '2',
    // ... more news
    title: 'Biological Rhythms and Deep Work',
    summary: 'Understanding your circadian rhythm to optimize focus blocks throughout the day.',
    source: 'BioHacker',
    category: 'Science',
    relevance: 0.88
  },
  {
    id: '3',
    title: 'The Rise of Local LLMs for Privacy-First AI',
    summary: 'Why running models locally is becoming the standard for sensitive data handling.',
    source: 'AI Insider',
    category: 'AI',
    relevance: 0.92
  }
];

export const MOCK_SESSIONS: FocusSession[] = [
  { id: '1', startTime: new Date(Date.now() - 86400000 * 2), duration: 45, focusScore: 88, attentionLevel: 92, drowsinessLevel: 5 },
  { id: '2', startTime: new Date(Date.now() - 86400000 * 1.5), duration: 60, focusScore: 75, attentionLevel: 80, drowsinessLevel: 15 },
  { id: '3', startTime: new Date(Date.now() - 86400000), duration: 90, focusScore: 94, attentionLevel: 96, drowsinessLevel: 2 },
];

export const MOCK_SCHEDULE: ScheduleEvent[] = [
  { id: '1', title: 'Deep Work: Project Alpha', time: '09:00 AM', type: 'focus' },
  { id: '2', title: 'Quick Break', time: '10:30 AM', type: 'break' },
  { id: '3', title: 'Team Sync', time: '11:00 AM', type: 'meeting' },
  { id: '4', title: 'Deep Work: Research', time: '01:00 PM', type: 'focus' },
];
