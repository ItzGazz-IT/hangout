// Web version of categories – same data, but icon typed as string instead of
// keyof typeof Ionicons.glyphMap (which is a React Native dependency)

export interface Category {
  id: string;
  label: string;
  icon: string;
  emoji: string;
  color: string;
  gradient: [string, string];
}

export const EVENT_CATEGORIES: Category[] = [
  { id: 'nightlife', label: 'Nightlife', icon: 'moon', emoji: '🌃', color: '#8B5CF6', gradient: ['#8B5CF6', '#6D28D9'] },
  { id: 'music', label: 'Music', icon: 'musical-notes', emoji: '🎵', color: '#11C5C9', gradient: ['#11C5C9', '#0891B2'] },
  { id: 'food', label: 'Food & Drink', icon: 'restaurant', emoji: '🍔', color: '#FF8A00', gradient: ['#FF8A00', '#F97316'] },
  { id: 'festivals', label: 'Festivals', icon: 'sparkles', emoji: '🎪', color: '#EC4899', gradient: ['#EC4899', '#DB2777'] },
  { id: 'corporate', label: 'Corporate', icon: 'briefcase', emoji: '💼', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
  { id: 'social', label: 'Social', icon: 'people', emoji: '👥', color: '#22C55E', gradient: ['#22C55E', '#16A34A'] },
  { id: 'sports', label: 'Sports', icon: 'football', emoji: '⚽', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
  { id: 'arts', label: 'Arts', icon: 'color-palette', emoji: '🎨', color: '#F43F5E', gradient: ['#F43F5E', '#E11D48'] },
];

export const getCategoryById = (id: string): Category | undefined =>
  EVENT_CATEGORIES.find((c) => c.id === id);
