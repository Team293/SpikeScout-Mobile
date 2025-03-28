create type "public"."scouting_types" as enum ('pit', 'match');

create table "public"."scouting_responses" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "type" scouting_types not null,
    "scouting_json" jsonb not null,
    "form_schema" jsonb not null,
    "team" uuid not null,
    "scouter" uuid,
    "event_code" text not null
);

-- Add Google Sheets configuration columns
alter table "public"."scouting_responses" 
add column if not exists "google_sheet_id" text,
add column if not exists "google_sheet_title" text;

alter table "public"."scouting_responses" enable row level security;

create table "public"."scouting_schedules" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "team" uuid,
    "event_code" text not null,
    "schedule_json" jsonb not null,
    "type" scouting_types default 'match'::scouting_types
);


alter table "public"."scouting_schedules" enable row level security;

create table "public"."scouting_schemas" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "team" uuid,
    "name" text not null,
    "schema" jsonb not null,
    "scouting_type" scouting_types
);


alter table "public"."scouting_schemas" enable row level security;

alter table "public"."accounts" add column "current_event" text;

CREATE UNIQUE INDEX scouting_responses_pkey ON public.scouting_responses USING btree (id);

CREATE UNIQUE INDEX scouting_scehdules_pkey ON public.scouting_schedules USING btree (id);

CREATE UNIQUE INDEX scouting_schemas_pkey ON public.scouting_schemas USING btree (id);

alter table "public"."scouting_responses" add constraint "scouting_responses_pkey" PRIMARY KEY using index "scouting_responses_pkey";

alter table "public"."scouting_schedules" add constraint "scouting_scehdules_pkey" PRIMARY KEY using index "scouting_scehdules_pkey";

alter table "public"."scouting_schemas" add constraint "scouting_schemas_pkey" PRIMARY KEY using index "scouting_schemas_pkey";

alter table "public"."scouting_responses" add constraint "scouting_responses_scouter_fkey" FOREIGN KEY (scouter) REFERENCES accounts(id) not valid;

alter table "public"."scouting_responses" validate constraint "scouting_responses_scouter_fkey";

alter table "public"."scouting_responses" add constraint "scouting_responses_team_fkey" FOREIGN KEY (team) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."scouting_responses" validate constraint "scouting_responses_team_fkey";

alter table "public"."scouting_schedules" add constraint "scouting_scehdules_team_fkey" FOREIGN KEY (team) REFERENCES accounts(id) not valid;

alter table "public"."scouting_schedules" validate constraint "scouting_scehdules_team_fkey";

alter table "public"."scouting_schemas" add constraint "scouting_schemas_team_fkey" FOREIGN KEY (team) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."scouting_schemas" validate constraint "scouting_schemas_team_fkey";

grant delete on table "public"."scouting_responses" to "anon";

grant insert on table "public"."scouting_responses" to "anon";

grant references on table "public"."scouting_responses" to "anon";

grant select on table "public"."scouting_responses" to "anon";

grant trigger on table "public"."scouting_responses" to "anon";

grant truncate on table "public"."scouting_responses" to "anon";

grant update on table "public"."scouting_responses" to "anon";

grant delete on table "public"."scouting_responses" to "authenticated";

grant insert on table "public"."scouting_responses" to "authenticated";

grant references on table "public"."scouting_responses" to "authenticated";

grant select on table "public"."scouting_responses" to "authenticated";

grant trigger on table "public"."scouting_responses" to "authenticated";

grant truncate on table "public"."scouting_responses" to "authenticated";

grant update on table "public"."scouting_responses" to "authenticated";

grant delete on table "public"."scouting_responses" to "service_role";

grant insert on table "public"."scouting_responses" to "service_role";

grant references on table "public"."scouting_responses" to "service_role";

grant select on table "public"."scouting_responses" to "service_role";

grant trigger on table "public"."scouting_responses" to "service_role";

grant truncate on table "public"."scouting_responses" to "service_role";

grant update on table "public"."scouting_responses" to "service_role";

grant delete on table "public"."scouting_schedules" to "anon";

grant insert on table "public"."scouting_schedules" to "anon";

grant references on table "public"."scouting_schedules" to "anon";

grant select on table "public"."scouting_schedules" to "anon";

grant trigger on table "public"."scouting_schedules" to "anon";

grant truncate on table "public"."scouting_schedules" to "anon";

grant update on table "public"."scouting_schedules" to "anon";

grant delete on table "public"."scouting_schedules" to "authenticated";

grant insert on table "public"."scouting_schedules" to "authenticated";

grant references on table "public"."scouting_schedules" to "authenticated";

grant select on table "public"."scouting_schedules" to "authenticated";

grant trigger on table "public"."scouting_schedules" to "authenticated";

grant truncate on table "public"."scouting_schedules" to "authenticated";

grant update on table "public"."scouting_schedules" to "authenticated";

grant delete on table "public"."scouting_schedules" to "service_role";

grant insert on table "public"."scouting_schedules" to "service_role";

grant references on table "public"."scouting_schedules" to "service_role";

grant select on table "public"."scouting_schedules" to "service_role";

grant trigger on table "public"."scouting_schedules" to "service_role";

grant truncate on table "public"."scouting_schedules" to "service_role";

grant update on table "public"."scouting_schedules" to "service_role";

grant delete on table "public"."scouting_schemas" to "anon";

grant insert on table "public"."scouting_schemas" to "anon";

grant references on table "public"."scouting_schemas" to "anon";

grant select on table "public"."scouting_schemas" to "anon";

grant trigger on table "public"."scouting_schemas" to "anon";

grant truncate on table "public"."scouting_schemas" to "anon";

grant update on table "public"."scouting_schemas" to "anon";

grant delete on table "public"."scouting_schemas" to "authenticated";

grant insert on table "public"."scouting_schemas" to "authenticated";

grant references on table "public"."scouting_schemas" to "authenticated";

grant select on table "public"."scouting_schemas" to "authenticated";

grant trigger on table "public"."scouting_schemas" to "authenticated";

grant truncate on table "public"."scouting_schemas" to "authenticated";

grant update on table "public"."scouting_schemas" to "authenticated";

grant delete on table "public"."scouting_schemas" to "service_role";

grant insert on table "public"."scouting_schemas" to "service_role";

grant references on table "public"."scouting_schemas" to "service_role";

grant select on table "public"."scouting_schemas" to "service_role";

grant trigger on table "public"."scouting_schemas" to "service_role";

grant truncate on table "public"."scouting_schemas" to "service_role";

grant update on table "public"."scouting_schemas" to "service_role";

create policy "authenticated"
on "public"."scouting_responses"
as permissive
for all
to authenticated
using (has_role_on_account(team));


create policy "authenticated"
on "public"."scouting_schedules"
as permissive
for all
to authenticated
using (has_role_on_account(team));


create policy "authenticated only"
on "public"."scouting_schemas"
as permissive
for all
to authenticated
using (has_role_on_account(team));