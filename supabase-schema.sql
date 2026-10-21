-- ============================================
-- PROTOCOLO 6160 — Schema do Supabase
-- Cole este SQL no SQL Editor do Supabase
-- ============================================

-- PERFIS DE USUÁRIO
create table if not exists public.perfis (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  nome text,
  motivo text,
  dia_atual integer default 1,
  sequencia integer default 0,
  ultimo_checkin_dia integer,
  data_inicio timestamptz default now(),
  focus_areas text[] default '{}',
  habitos_escolhidos jsonb default '{}',
  habitos_custom jsonb default '{}',
  onboarding_completo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- DIAGNÓSTICOS
create table if not exists public.diagnosticos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  scores jsonb not null,
  focus_areas text[] default '{}',
  dia integer default 1,
  created_at timestamptz default now()
);

-- CHECK-INS DIÁRIOS
create table if not exists public.checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  dia_num integer not null,
  apareceu boolean default false,
  habitos_feitos text[] default '{}',
  reflexao text,
  created_at timestamptz default now(),
  unique(user_id, dia_num)
);

-- DECLARAÇÕES DE IDENTIDADE
create table if not exists public.identidades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  texto text not null,
  dia integer default 1,
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) — Segurança
-- Cada usuário só vê e edita seus próprios dados
-- ============================================

alter table public.perfis enable row level security;
alter table public.diagnosticos enable row level security;
alter table public.checkins enable row level security;
alter table public.identidades enable row level security;

-- Políticas: perfis
create policy "Users can view own profile" on public.perfis for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.perfis for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.perfis for update using (auth.uid() = user_id);

-- Políticas: diagnósticos
create policy "Users can view own diagnosticos" on public.diagnosticos for select using (auth.uid() = user_id);
create policy "Users can insert own diagnosticos" on public.diagnosticos for insert with check (auth.uid() = user_id);

-- Políticas: checkins
create policy "Users can view own checkins" on public.checkins for select using (auth.uid() = user_id);
create policy "Users can insert own checkins" on public.checkins for insert with check (auth.uid() = user_id);
create policy "Users can update own checkins" on public.checkins for update using (auth.uid() = user_id);

-- Políticas: identidades
create policy "Users can view own identidades" on public.identidades for select using (auth.uid() = user_id);
create policy "Users can insert own identidades" on public.identidades for insert with check (auth.uid() = user_id);

-- ============================================
-- TRIGGER: atualizar updated_at automaticamente
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_perfis_updated
  before update on public.perfis
  for each row execute procedure public.handle_updated_at();
