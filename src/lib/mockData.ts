import type {
  UserProfile, Task, WellnessStats, AnalyticsData,
  MeditationSession, ShopItem, Achievement
} from '@/types'

export const MOCK_PROFILE: UserProfile = {
  id: 'user-1',
  telegramId: 123456789,
  username: 'eleonora',
  firstName: 'Элеонора',
  diamonds: 420,
  level: 8,
  xp: 2340,
  xpToNext: 3000,
  xpProgress: 78,
  streak: 12,
  bestStreak: 21,
  energy: 73,
  theme: 'midnight',
}

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Утренняя медитация',
    category: 'mandatory',
    completed: true,
    xpReward: 30,
    diamondReward: 3,
    durationMinutes: 10,
    emoji: '🧘',
    streakDays: 12,
  },
  {
    id: 't2',
    title: 'Утренняя пробежка',
    category: 'mandatory',
    completed: true,
    xpReward: 50,
    diamondReward: 5,
    durationMinutes: 30,
    emoji: '🏃',
    streakDays: 8,
  },
  {
    id: 't3',
    title: 'Чтение книги',
    category: 'personal',
    completed: false,
    xpReward: 40,
    diamondReward: 4,
    durationMinutes: 20,
    emoji: '📚',
    streakDays: 5,
  },
  {
    id: 't4',
    title: 'Работа над проектом',
    category: 'work',
    completed: false,
    xpReward: 80,
    diamondReward: 8,
    durationMinutes: 90,
    emoji: '💻',
    streakDays: 0,
  },
  {
    id: 't5',
    title: 'Дневник благодарности',
    category: 'wellness',
    completed: false,
    xpReward: 35,
    diamondReward: 3,
    durationMinutes: 5,
    emoji: '✍️',
    streakDays: 7,
  },
  {
    id: 't6',
    title: 'Скинкейр-ритуал',
    category: 'wellness',
    completed: false,
    xpReward: 25,
    diamondReward: 2,
    durationMinutes: 15,
    emoji: '✨',
    streakDays: 10,
  },
  {
    id: 't7',
    title: 'Email и сообщения',
    category: 'work',
    completed: false,
    xpReward: 30,
    diamondReward: 3,
    durationMinutes: 30,
    emoji: '📬',
    streakDays: 0,
  },
]

export const MOCK_WELLNESS: WellnessStats = {
  mood: 4,
  sleepHours: 7.5,
  meditationMinutes: 20,
  focusMinutes: 90,
  steps: 6240,
  waterLiters: 1.8,
}

export const MOCK_ANALYTICS: AnalyticsData = {
  period: 'week',
  activity: [
    { label: 'Пн', value: 85 },
    { label: 'Вт', value: 70 },
    { label: 'Ср', value: 60, isToday: true },
    { label: 'Чт', value: 0 },
    { label: 'Пт', value: 0 },
    { label: 'Сб', value: 0 },
    { label: 'Вс', value: 0 },
  ],
  mood: [
    { label: 'Пн', value: 80 },
    { label: 'Вт', value: 65 },
    { label: 'Ср', value: 75 },
    { label: 'Чт', value: 0 },
    { label: 'Пт', value: 0 },
    { label: 'Сб', value: 0 },
    { label: 'Вс', value: 0 },
  ],
  habitProgress: [
    { name: 'Медитация', emoji: '🧘', completed: 18, target: 21 },
    { name: 'Тренировки', emoji: '🏃', completed: 14, target: 21 },
    { name: 'Чтение', emoji: '📚', completed: 11, target: 21 },
    { name: 'Скинкейр', emoji: '✨', completed: 19, target: 21 },
  ],
  totalXP: 2340,
  totalTasks: 47,
  avgMood: 3.8,
  avgSleep: 7.2,
}

export const MOCK_MEDITATIONS: MeditationSession[] = [
  {
    id: 'm1',
    title: 'Утренняя ясность',
    subtitle: 'Начни день с намерением. Мягкая медитация для пробуждения разума и сердца.',
    durationMinutes: 12,
    timeOfDay: 'morning',
    accent: 'purple',
    xpReward: 40,
  },
  {
    id: 'm2',
    title: 'Отпускание дня',
    subtitle: 'Освободи напряжение. Глубокое расслабление перед сном.',
    durationMinutes: 20,
    timeOfDay: 'evening',
    accent: 'pink',
    xpReward: 50,
  },
  {
    id: 'm3',
    title: 'Поток настоящего',
    subtitle: 'Верни себя в момент здесь и сейчас. Мини-практика для любого времени.',
    durationMinutes: 5,
    timeOfDay: 'anytime',
    accent: 'teal',
    xpReward: 25,
  },
  {
    id: 'm4',
    title: 'Сканирование тела',
    subtitle: 'Глубокое расслабление каждой клетки тела. Снятие мышечного напряжения.',
    durationMinutes: 15,
    timeOfDay: 'evening',
    accent: 'purple',
    xpReward: 45,
  },
]

export const MOCK_SHOP_ITEMS: ShopItem[] = [
  // Themes
  { id: 's1', name: 'Midnight', description: 'Тёмная элегантность, мягкий фиолет', emoji: '🌙', type: 'theme', priceDiamonds: 0, theme: 'midnight', owned: true, equipped: true },
  { id: 's2', name: 'Soft Beige', description: 'Тёплые бежевые тона, уютно и нежно', emoji: '☕', type: 'theme', priceDiamonds: 200, theme: 'soft-beige', owned: false },
  { id: 's3', name: 'Lavender Dream', description: 'Пастельная лаванда, лёгкость и мечты', emoji: '💜', type: 'theme', priceDiamonds: 350, theme: 'lavender-dream', owned: false },
  { id: 's4', name: 'Sage Green', description: 'Натуральный зелёный, спокойствие природы', emoji: '🌿', type: 'theme', priceDiamonds: 350, theme: 'sage-green', owned: false },
  // Decorations
  { id: 's5', name: 'Свеча Ambiance', description: 'Мерцающая свеча на главном экране', emoji: '🕯️', type: 'decoration', priceDiamonds: 120, owned: false },
  { id: 's6', name: 'Растение Monstera', description: 'Зелёный питомец в углу экрана', emoji: '🌿', type: 'decoration', priceDiamonds: 80, owned: false },
  { id: 's7', name: 'Кристаллы', description: 'Аметистовые кристаллы как декор', emoji: '💎', type: 'decoration', priceDiamonds: 150, owned: false },
  { id: 's8', name: 'Звёздное небо', description: 'Анимированный фон со звёздами', emoji: '✨', type: 'decoration', priceDiamonds: 200, owned: false },
  // Boosts
  { id: 's9', name: 'Защита серии', description: 'Сохрани серию при пропуске одного дня', emoji: '🛡️', type: 'protection', priceDiamonds: 150, owned: false },
  { id: 's10', name: 'XP Буст ×2', description: 'Двойной опыт на следующие 24 часа', emoji: '⚡', type: 'boost', priceDiamonds: 100, owned: false },
  { id: 's11', name: 'Бонус привычки', description: '+50% XP за выполнение привычек неделю', emoji: '🌸', type: 'boost', priceDiamonds: 250, owned: false },
]

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '10 дней серии', description: 'Выполняй задачи 10 дней подряд', emoji: '🔥', earned: true, earnedAt: '2024-01-15' },
  { id: 'a2', title: '20 медитаций', description: 'Проведи 20 медитативных сессий', emoji: '🧘', earned: true, earnedAt: '2024-01-18' },
  { id: 'a3', title: 'Ранний подъём', description: 'Выполни утреннюю задачу до 8:00 три раза', emoji: '🌅', earned: true, earnedAt: '2024-01-20' },
  { id: 'a4', title: '30 дней серии', description: 'Выполняй задачи 30 дней подряд', emoji: '🏆', earned: false, progress: 12, target: 30 },
  { id: 'a5', title: '100 тренировок', description: 'Проведи 100 тренировочных сессий', emoji: '💪', earned: false, progress: 14, target: 100 },
  { id: 'a6', title: '100k шагов', description: 'Пройди суммарно 100,000 шагов', emoji: '👣', earned: false, progress: 72340, target: 100000 },
  { id: 'a7', title: '50 медитаций', description: 'Проведи 50 медитативных сессий', emoji: '🌸', earned: false, progress: 21, target: 50 },
  { id: 'a8', title: 'Мастер wellness', description: 'Заполни дневник wellness 14 дней подряд', emoji: '✨', earned: false, progress: 7, target: 14 },
]

export const AI_INSIGHTS = [
  'Ты лучше держишь режим после хорошего сна. В дни с 7+ часами ты выполняешь на 40% больше задач.',
  'После утренних пробежек твоя продуктивность в течение дня на 60% выше обычного.',
  'Твой лучший день для глубокой работы — понедельник. Используй это.',
  'Серия медитаций влияет на твоё настроение. Чем длиннее серия — тем стабильнее эмоции.',
  'Ты наиболее продуктивна в первой половине дня. Самые важные задачи — до обеда.',
]
