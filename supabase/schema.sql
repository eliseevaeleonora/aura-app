-- ============================================================
-- AURA APP — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USERS ───────────────────────────────────────────────────────────────

create table public.users (
  id              uuid default uuid_generate_v4() primary key,
  telegram_id     bigint unique not null,
  username        text,
  first_name      text not null,
  last_name       text,
  avatar_url      text,
  diamonds        integer default 0 not null,
  level           integer default 1 not null,
  xp              integer default 0 not null,
  xp_to_next      integer default 1000 not null,
  streak          integer default 0 not null,
  best_streak     integer default 0 not null,
  energy          integer default 100 not null,
  theme           text default 'midnight' not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- Indexes
create index users_telegram_id_idx on public.users(telegram_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- ─── TASKS ───────────────────────────────────────────────────────────────

create table public.tasks (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.users(id) on delete cascade not null,
  title           text not null,
  category        text not null check (category in ('mandatory', 'work', 'personal', 'wellness')),
  completed       boolean default false not null,
  completed_at    timestamptz,
  xp_reward       integer default 20 not null,
  diamond_reward  integer default 2 not null,
  duration_minutes integer default 30 not null,
  emoji           text default '✨' not null,
  streak_days     integer default 0 not null,
  date            date default current_date not null,
  created_at      timestamptz default now() not null
);

create index tasks_user_date_idx on public.tasks(user_id, date);

-- ─── HABITS ──────────────────────────────────────────────────────────────

create table public.habits (
  id                   uuid default uuid_generate_v4() primary key,
  user_id              uuid references public.users(id) on delete cascade not null,
  title                text not null,
  emoji                text default '✨' not null,
  category             text not null check (category in ('mandatory', 'work', 'personal', 'wellness')),
  streak               integer default 0 not null,
  best_streak          integer default 0 not null,
  xp_reward            integer default 30 not null,
  target_days_per_week integer default 7 not null,
  created_at           timestamptz default now() not null
);

create index habits_user_idx on public.habits(user_id);

-- ─── HABIT COMPLETIONS ────────────────────────────────────────────────────

create table public.habit_completions (
  id         uuid default uuid_generate_v4() primary key,
  habit_id   uuid references public.habits(id) on delete cascade not null,
  user_id    uuid references public.users(id) on delete cascade not null,
  date       date not null,
  created_at timestamptz default now() not null,
  unique(habit_id, date)
);

-- ─── WELLNESS LOGS ────────────────────────────────────────────────────────

create table public.wellness_logs (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references public.users(id) on delete cascade not null,
  date                date default current_date not null,
  mood                integer check (mood between 1 and 5),
  sleep_hours         numeric(4,1),
  meditation_minutes  integer default 0,
  focus_minutes       integer default 0,
  steps               integer default 0,
  water_liters        numeric(3,1) default 0,
  notes               text,
  created_at          timestamptz default now() not null,
  unique(user_id, date)
);

create index wellness_user_date_idx on public.wellness_logs(user_id, date);

-- ─── SHOP ITEMS ──────────────────────────────────────────────────────────

create table public.shop_items (
  id               uuid default uuid_generate_v4() primary key,
  name             text not null,
  description      text not null,
  emoji            text not null,
  type             text not null check (type in ('theme', 'decoration', 'boost', 'protection')),
  price_diamonds   integer not null,
  theme_key        text,
  is_available     boolean default true,
  sort_order       integer default 0,
  created_at       timestamptz default now() not null
);

-- ─── USER ITEMS ──────────────────────────────────────────────────────────

create table public.user_items (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.users(id) on delete cascade not null,
  item_id      uuid references public.shop_items(id) not null,
  equipped     boolean default false,
  purchased_at timestamptz default now() not null,
  unique(user_id, item_id)
);

create index user_items_user_idx on public.user_items(user_id);

-- ─── ACHIEVEMENTS ────────────────────────────────────────────────────────

create table public.achievements (
  id          uuid default uuid_generate_v4() primary key,
  key         text unique not null,
  title       text not null,
  description text not null,
  emoji       text not null,
  target      integer,
  xp_reward   integer default 100,
  created_at  timestamptz default now() not null
);

create table public.user_achievements (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.users(id) on delete cascade not null,
  achievement_key text references public.achievements(key) not null,
  progress     integer default 0,
  earned       boolean default false,
  earned_at    timestamptz,
  unique(user_id, achievement_key)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────

-- Users can read and update their own data
alter table public.users enable row level security;
create policy "Users can view own profile" on public.users
  for select using (telegram_id::text = current_setting('app.telegram_id', true));
create policy "Users can update own profile" on public.users
  for update using (telegram_id::text = current_setting('app.telegram_id', true));

-- Tasks RLS
alter table public.tasks enable row level security;
create policy "Users manage own tasks" on public.tasks
  for all using (user_id in (
    select id from public.users
    where telegram_id::text = current_setting('app.telegram_id', true)
  ));

-- Wellness logs RLS
alter table public.wellness_logs enable row level security;
create policy "Users manage own wellness logs" on public.wellness_logs
  for all using (user_id in (
    select id from public.users
    where telegram_id::text = current_setting('app.telegram_id', true)
  ));

-- Shop items are public
alter table public.shop_items enable row level security;
create policy "Shop items are viewable by all" on public.shop_items
  for select using (is_available = true);

-- User items RLS
alter table public.user_items enable row level security;
create policy "Users manage own items" on public.user_items
  for all using (user_id in (
    select id from public.users
    where telegram_id::text = current_setting('app.telegram_id', true)
  ));

-- ─── SEED DEFAULT SHOP ITEMS ─────────────────────────────────────────────

insert into public.shop_items (name, description, emoji, type, price_diamonds, theme_key, sort_order) values
  ('Midnight', 'Тёмная элегантность, мягкий фиолет', '🌙', 'theme', 0, 'midnight', 1),
  ('Soft Beige', 'Тёплые бежевые тона, уютно и нежно', '☕', 'theme', 200, 'soft-beige', 2),
  ('Lavender Dream', 'Пастельная лаванда, лёгкость и мечты', '💜', 'theme', 350, 'lavender-dream', 3),
  ('Sage Green', 'Натуральный зелёный, спокойствие природы', '🌿', 'theme', 350, 'sage-green', 4),
  ('Свеча Ambiance', 'Мерцающая свеча на главном экране', '🕯️', 'decoration', 120, null, 10),
  ('Растение Monstera', 'Зелёный питомец в углу экрана', '🌿', 'decoration', 80, null, 11),
  ('Кристаллы', 'Аметистовые кристаллы как декор', '💎', 'decoration', 150, null, 12),
  ('Звёздное небо', 'Анимированный фон со звёздами', '✨', 'decoration', 200, null, 13),
  ('Защита серии', 'Сохрани серию при пропуске одного дня', '🛡️', 'protection', 150, null, 20),
  ('XP Буст ×2', 'Двойной опыт на следующие 24 часа', '⚡', 'boost', 100, null, 21),
  ('Бонус привычки', '+50% XP за выполнение привычек неделю', '🌸', 'boost', 250, null, 22);

-- ─── SEED DEFAULT ACHIEVEMENTS ───────────────────────────────────────────

insert into public.achievements (key, title, description, emoji, target, xp_reward) values
  ('streak_10', '10 дней серии', 'Выполняй задачи 10 дней подряд', '🔥', 10, 200),
  ('streak_30', '30 дней серии', 'Выполняй задачи 30 дней подряд', '🏆', 30, 500),
  ('streak_100', '100 дней серии', 'Легенда — 100 дней без остановки', '👑', 100, 1000),
  ('meditations_20', '20 медитаций', 'Проведи 20 медитативных сессий', '🧘', 20, 200),
  ('meditations_50', '50 медитаций', 'Ты мастер внутреннего покоя', '🌸', 50, 400),
  ('workouts_100', '100 тренировок', 'Твоё тело — твой храм', '💪', 100, 500),
  ('steps_100k', '100k шагов', 'Пройди суммарно 100,000 шагов', '👣', 100000, 300),
  ('early_riser', 'Ранний подъём', 'Выполни утреннюю задачу до 8:00 три раза', '🌅', 3, 150),
  ('wellness_master', 'Мастер wellness', 'Заполни дневник wellness 14 дней подряд', '✨', 14, 300),
  ('tasks_50', '50 задач', 'Выполни 50 задач суммарно', '✅', 50, 200);
