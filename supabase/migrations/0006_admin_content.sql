-- Konnecta Academy — admin content editing
--
-- 0002_rls.sql revoked insert, update and delete on every content table from
-- the authenticated role, on the reasoning that a policy added by mistake
-- later should not be able to quietly open content up to editing. That is a
-- good decision and this migration keeps it: the grants stay revoked, and
-- editing happens through security definer functions that check is_admin()
-- before they touch anything.
--
-- Run this after 0005_admin.sql.

-- ===========================================================================
-- What may be edited
--
-- cefr_levels is deliberately absent. The CEFR ladder is fixed, other tables
-- reference it by code, and it is keyed on code rather than id, so it does
-- not fit the generic editor.
-- ===========================================================================

create or replace function public.admin_content_entities()
returns text[]
language sql
immutable
as $$
  select array[
    'languages', 'courses', 'modules', 'lessons',
    'lesson_questions', 'lesson_options',
    'placement_questions', 'placement_options',
    'vocabulary',
    'practice_modules', 'practice_exercises',
    'tutor_scenarios', 'tutor_turns', 'tutor_replies'
  ]::text[];
$$;

create or replace function public.admin_content_guard(entity text)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'This account is not an administrator.' using errcode = '42501';
  end if;

  if entity is null or not (entity = any (public.admin_content_entities())) then
    raise exception 'Not an editable content table: %', coalesce(entity, 'null')
      using errcode = '42P01';
  end if;
end;
$$;

-- ===========================================================================
-- Save
--
-- Only the keys present in the payload are written, so a column left out of
-- the form keeps its default on insert and its current value on update.
-- jsonb_populate_record does the casting, so the payload can carry plain JSON
-- and still land in int, boolean and uuid columns correctly.
--
-- Keys that are not real columns of the table are ignored rather than causing
-- an error, which keeps the client free to send a whole form object.
-- ===========================================================================

create or replace function public.admin_content_save(
  entity  text,
  payload jsonb,
  row_id  uuid default null
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  cols     text[];
  col_list text;
  result   jsonb;
begin
  perform public.admin_content_guard(entity);

  if payload is null or jsonb_typeof(payload) <> 'object' then
    raise exception 'Nothing to save.' using errcode = '22023';
  end if;

  -- The payload keys that are genuinely columns of this table, id excluded:
  -- id is set by the default on insert and by row_id on update.
  select array_agg(c.column_name::text order by c.ordinal_position)
    into cols
    from information_schema.columns c
   where c.table_schema = 'public'
     and c.table_name = entity
     and c.column_name <> 'id'
     and payload ? c.column_name;

  if cols is null then
    raise exception 'None of those fields belong to %.', entity using errcode = '42703';
  end if;

  col_list := (select string_agg(format('%I', c), ', ') from unnest(cols) c);

  if row_id is null then
    execute format(
      'insert into public.%I as t (%s)
         select %s
           from jsonb_populate_record(null::public.%I, $1) as r
       returning to_jsonb(t)',
      entity,
      col_list,
      (select string_agg(format('r.%I', c), ', ') from unnest(cols) c),
      entity
    )
    into result
    using payload;
  else
    execute format(
      'update public.%I as t
          set %s
         from jsonb_populate_record(null::public.%I, $1) as r
        where t.id = $2
    returning to_jsonb(t)',
      entity,
      (select string_agg(format('%I = r.%I', c, c), ', ') from unnest(cols) c),
      entity
    )
    into result
    using payload, row_id;

    if result is null then
      raise exception 'That row no longer exists.' using errcode = 'P0002';
    end if;
  end if;

  return result;
end;
$$;

-- ===========================================================================
-- Delete
--
-- Foreign keys cascade, so deleting a module takes its lessons, their
-- questions and their options with it. The count is returned so the interface
-- can say what actually went.
-- ===========================================================================

create or replace function public.admin_content_delete(entity text, row_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  gone int;
begin
  perform public.admin_content_guard(entity);

  execute format('delete from public.%I where id = $1', entity) using row_id;
  get diagnostics gone = row_count;

  if gone = 0 then
    raise exception 'That row no longer exists.' using errcode = 'P0002';
  end if;

  return jsonb_build_object('deleted', gone);
end;
$$;

-- ===========================================================================
-- Reordering
--
-- Swapping two sort_order values in one statement, so a reorder cannot leave
-- two rows sharing a position if the second update fails.
-- ===========================================================================

create or replace function public.admin_content_swap_order(entity text, id_a uuid, id_b uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  moved int;
begin
  perform public.admin_content_guard(entity);

  if id_a = id_b then
    raise exception 'Nothing to swap.' using errcode = '22023';
  end if;

  execute format(
    'with pair as (
       select id, sort_order from public.%I where id in ($1, $2)
     )
     update public.%I t
        set sort_order = other.sort_order
       from pair self, pair other
      where t.id = self.id
        and other.id <> self.id
        and (select count(*) from pair) = 2',
    entity, entity
  ) using id_a, id_b;

  get diagnostics moved = row_count;

  if moved <> 2 then
    raise exception 'Could not reorder those rows.' using errcode = 'P0002';
  end if;

  return jsonb_build_object('swapped', moved);
end;
$$;

revoke all on function public.admin_content_guard(text)                    from public, anon;
revoke all on function public.admin_content_save(text, jsonb, uuid)        from public, anon;
revoke all on function public.admin_content_delete(text, uuid)             from public, anon;
revoke all on function public.admin_content_swap_order(text, uuid, uuid)   from public, anon;

grant execute on function public.admin_content_entities()                  to authenticated;
grant execute on function public.admin_content_save(text, jsonb, uuid)     to authenticated;
grant execute on function public.admin_content_delete(text, uuid)          to authenticated;
grant execute on function public.admin_content_swap_order(text, uuid, uuid) to authenticated;
