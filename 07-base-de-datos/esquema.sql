-- 01. Table ownership: una fila por usuario y asignatura; sin datos de otros perfiles.
create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_code text not null check (course_code in ('ISC-101', 'ISC-102', 'ISC-103', 'ISC-204', 'ISC-211', 'ISC-312', 'ISC-313', 'ISC-305', 'ISC-407', 'ISC-414', 'ISC-415', 'ISC-341', 'ISC-306', 'ISC-408', 'ISC-409', 'ISC-443', 'ISC-445', 'ISC-546', 'ISC-544', 'ISC-321', 'ISC-422', 'ISC-423', 'IE-326', 'ISC-331', 'ISC-332', 'ISC-333', 'ISC-334', 'ISC-336', 'ISC-437', 'ISC-435', 'ISC-442', 'MM-110', 'MM-111', 'MM-201', 'MM-211', 'MM-420', 'MM-202', 'MM-401', 'FS-100', 'FS-200', 'AGE-102', 'ISC-351', 'ISC-552', 'PPS-100', 'EG-011', 'SC-101', 'FF-101', 'HH-101', 'IN-101', 'IN-102', 'IN-103', 'HUM-OPT', 'ART-OPT', 'NAT-OPT')),
  state text not null default 'PENDING' check (state in ('PENDING','IN_PROGRESS','PASSED')),
  hidden boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_code)
);
alter table public.course_progress enable row level security;

-- 02. RLS policies: authenticated no significa acceso a filas de otros usuarios.
create policy "read_own_progress" on public.course_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert_own_progress" on public.course_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update_own_progress" on public.course_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
revoke all on public.course_progress from anon;
grant select, insert, update on public.course_progress to authenticated;

-- 03. Atomic patches: un dispositivo no reemplaza campos que no modificó.
-- Security invoker: siempre respeta RLS y la identidad de la sesión.
create or replace function public.apply_progress_changes(changes jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare
  entry record;
  next_state text;
  next_hidden boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if jsonb_typeof(changes) <> 'object' then raise exception 'Invalid changes'; end if;
  if (select count(*) from jsonb_object_keys(changes)) > 54 then raise exception 'Too many changes'; end if;
  for entry in select key, value from jsonb_each(changes) loop
    if jsonb_typeof(entry.value) <> 'object' then raise exception 'Invalid patch'; end if;
    if exists (select 1 from jsonb_object_keys(entry.value) as fields(name) where name not in ('state','hidden')) then raise exception 'Unknown field'; end if;
    if entry.value ? 'state' and jsonb_typeof(entry.value->'state') <> 'string' then raise exception 'Invalid state'; end if;
    if entry.value ? 'hidden' and jsonb_typeof(entry.value->'hidden') <> 'boolean' then raise exception 'Invalid hidden'; end if;
    next_state := entry.value->>'state';
    next_hidden := (entry.value->>'hidden')::boolean;
    insert into public.course_progress (user_id, course_code, state, hidden)
    values (auth.uid(),entry.key,coalesce(next_state,'PENDING'),coalesce(next_hidden,false))
    on conflict (user_id,course_code) do update
      set state = coalesce(next_state,course_progress.state),
          hidden = coalesce(next_hidden,course_progress.hidden),
          updated_at = clock_timestamp();
  end loop;
end;
$$;
revoke all on function public.apply_progress_changes(jsonb) from public, anon;
grant execute on function public.apply_progress_changes(jsonb) to authenticated;

-- 04. Realtime publication: notifica los cambios; el cliente también recupera al reconectar.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='course_progress') then
    alter publication supabase_realtime add table public.course_progress;
  end if;
end $$;
