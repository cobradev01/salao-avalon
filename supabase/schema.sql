-- Avalon Barbearia: esquema do banco no Supabase.
-- Cole o arquivo inteiro no SQL Editor do Supabase e clique em "Run". Pode rodar mais de uma vez.

create extension if not exists pgcrypto;

-- ===== Tabelas =====

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  subtitle text,
  image_url text not null,
  button_label text,
  button_link text,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  instagram text,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_label text not null default 'Consulte',
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  price_label text,
  image_url text,
  valid_until date,
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===== Segurança (RLS) =====
-- Qualquer visitante lê o conteúdo; só usuários logados (o admin) alteram.

alter table public.site_settings enable row level security;
alter table public.banners enable row level security;
alter table public.team_members enable row level security;
alter table public.services enable row level security;
alter table public.promotions enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['site_settings', 'banners', 'team_members', 'services', 'promotions']
  loop
    execute format('drop policy if exists "leitura publica" on public.%I', t);
    execute format('create policy "leitura publica" on public.%I for select using (true)', t);
    execute format('drop policy if exists "admin escreve" on public.%I', t);
    execute format('create policy "admin escreve" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ===== Storage (fotos de banners, equipe e promoções) =====

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "midia leitura publica" on storage.objects;
create policy "midia leitura publica" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "midia admin envia" on storage.objects;
create policy "midia admin envia" on storage.objects
  for all to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

-- ===== Dados iniciais (só entram se a tabela estiver vazia) =====

insert into public.site_settings (key, value)
values ('site', '{
  "nome": "Avalon Barbearia",
  "whatsapp": "5562993067066",
  "whatsapp_exibir": "(62) 99306-7066",
  "mensagem": "Olá! Quero agendar um horário na Avalon Barbearia.",
  "endereco": "",
  "horario": "",
  "google_maps": "",
  "instagram": "https://instagram.com/avalonbarbearia062",
  "facebook": "",
  "tiktok": "",
  "youtube": ""
}'::jsonb)
on conflict (key) do nothing;

insert into public.banners (title, subtitle, image_url, button_label, position)
select v.title, v.subtitle, v.image_url, v.button_label, v.position
from (values
  ('Precisão em cada detalhe', 'Cortes masculinos com acabamento de alto padrão', 'assets/img/hero-01.jpg', 'Agendar pelo WhatsApp', 1),
  ('A barba feita como ela merece', 'Navalha, toalha quente e acabamento impecável', 'assets/img/hero-02.jpg', 'Agendar pelo WhatsApp', 2),
  ('Sua melhor versão começa aqui', 'Estilo • Cuidado • Confiança', 'assets/img/hero-03.jpg', 'Agendar pelo WhatsApp', 3)
) as v(title, subtitle, image_url, button_label, position)
where not exists (select 1 from public.banners);

insert into public.team_members (name, role, photo_url, position)
select v.name, v.role, v.photo_url, v.position
from (values
  ('Barbeiro Avalon', 'Barbeiro especialista', 'assets/img/equipe-01.jpeg', 1),
  ('Barbeiro Avalon', 'Barbeiro especialista', 'assets/img/equipe-02.jpeg', 2),
  ('Barbeiro Avalon', 'Barbeiro especialista', 'assets/img/equipe-03.jpeg', 3)
) as v(name, role, photo_url, position)
where not exists (select 1 from public.team_members);

insert into public.services (name, description, price_label, position)
select v.name, v.description, v.price_label, v.position
from (values
  ('Corte masculino', 'Corte moderno com acabamento impecável e finalização.', 'Consulte', 1),
  ('Barba modelada', 'Desenho e modelagem da barba com toalha quente.', 'Consulte', 2),
  ('Sobrancelha masculina', 'Alinhamento e definição para um olhar marcante.', 'Consulte', 3),
  ('Corte + barba', 'O combo completo para renovar o visual de ponta a ponta.', 'Consulte', 4)
) as v(name, description, price_label, position)
where not exists (select 1 from public.services);
