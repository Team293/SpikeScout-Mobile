set check_function_bodies = off;

CREATE OR REPLACE FUNCTION kit.slugify(value text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE STRICT
 SET search_path TO ''
AS $function$
    -- removes accents (diacritic signs) from a given string --
    with "unaccented" as(
        select
            kit.unaccent("value") as "value"
),
"lowercase" as(
    select
        lower("value") as "value"
    from
        "unaccented"
),
"removed_quotes" as(
    select
	regexp_replace("value", '[''"]+', '',
	    'gi') as "value"
    from
        "lowercase"
),
"hyphenated" as(
    select
	regexp_replace("value", '[^a-z0-9\\-_]+', '-',
	    'gi') as "value"
    from
        "removed_quotes"
),
"trimmed" as(
    select
	regexp_replace(regexp_replace("value", '\-+$',
	    ''), '^\-', '') as "value" from "hyphenated"
)
        select
            "value"
        from
            "trimmed";
$function$
;


drop policy "billing_customers_read_self" on "public"."billing_customers";

drop policy "order_items_read_self" on "public"."order_items";

drop policy "orders_read_self" on "public"."orders";

drop policy "subscription_items_read_self" on "public"."subscription_items";

drop policy "subscriptions_read_self" on "public"."subscriptions";

revoke delete on table "public"."billing_customers" from "anon";

revoke insert on table "public"."billing_customers" from "anon";

revoke references on table "public"."billing_customers" from "anon";

revoke select on table "public"."billing_customers" from "anon";

revoke trigger on table "public"."billing_customers" from "anon";

revoke truncate on table "public"."billing_customers" from "anon";

revoke update on table "public"."billing_customers" from "anon";

revoke select on table "public"."billing_customers" from "authenticated";

revoke delete on table "public"."billing_customers" from "service_role";

revoke insert on table "public"."billing_customers" from "service_role";

revoke select on table "public"."billing_customers" from "service_role";

revoke update on table "public"."billing_customers" from "service_role";

revoke delete on table "public"."order_items" from "anon";

revoke insert on table "public"."order_items" from "anon";

revoke references on table "public"."order_items" from "anon";

revoke select on table "public"."order_items" from "anon";

revoke trigger on table "public"."order_items" from "anon";

revoke truncate on table "public"."order_items" from "anon";

revoke update on table "public"."order_items" from "anon";

revoke select on table "public"."order_items" from "authenticated";

revoke delete on table "public"."order_items" from "service_role";

revoke insert on table "public"."order_items" from "service_role";

revoke select on table "public"."order_items" from "service_role";

revoke update on table "public"."order_items" from "service_role";

revoke delete on table "public"."orders" from "anon";

revoke insert on table "public"."orders" from "anon";

revoke references on table "public"."orders" from "anon";

revoke select on table "public"."orders" from "anon";

revoke trigger on table "public"."orders" from "anon";

revoke truncate on table "public"."orders" from "anon";

revoke update on table "public"."orders" from "anon";

revoke select on table "public"."orders" from "authenticated";

revoke delete on table "public"."orders" from "service_role";

revoke insert on table "public"."orders" from "service_role";

revoke select on table "public"."orders" from "service_role";

revoke update on table "public"."orders" from "service_role";

revoke delete on table "public"."subscription_items" from "anon";

revoke insert on table "public"."subscription_items" from "anon";

revoke references on table "public"."subscription_items" from "anon";

revoke select on table "public"."subscription_items" from "anon";

revoke trigger on table "public"."subscription_items" from "anon";

revoke truncate on table "public"."subscription_items" from "anon";

revoke update on table "public"."subscription_items" from "anon";

revoke select on table "public"."subscription_items" from "authenticated";

revoke delete on table "public"."subscription_items" from "service_role";

revoke insert on table "public"."subscription_items" from "service_role";

revoke select on table "public"."subscription_items" from "service_role";

revoke update on table "public"."subscription_items" from "service_role";

revoke delete on table "public"."subscriptions" from "anon";

revoke insert on table "public"."subscriptions" from "anon";

revoke references on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "anon";

revoke trigger on table "public"."subscriptions" from "anon";

revoke truncate on table "public"."subscriptions" from "anon";

revoke update on table "public"."subscriptions" from "anon";

revoke select on table "public"."subscriptions" from "authenticated";

revoke delete on table "public"."subscriptions" from "service_role";

revoke insert on table "public"."subscriptions" from "service_role";

revoke select on table "public"."subscriptions" from "service_role";

revoke update on table "public"."subscriptions" from "service_role";

alter table "public"."billing_customers" drop constraint "billing_customers_account_id_customer_id_provider_key";

alter table "public"."billing_customers" drop constraint "billing_customers_account_id_fkey";

alter table "public"."order_items" drop constraint "order_items_order_id_fkey";

alter table "public"."order_items" drop constraint "order_items_order_id_product_id_variant_id_key";

alter table "public"."orders" drop constraint "orders_account_id_fkey";

alter table "public"."orders" drop constraint "orders_billing_customer_id_fkey";

alter table "public"."subscription_items" drop constraint "subscription_items_interval_count_check";

alter table "public"."subscription_items" drop constraint "subscription_items_subscription_id_fkey";

alter table "public"."subscription_items" drop constraint "subscription_items_subscription_id_product_id_variant_id_key";

alter table "public"."subscriptions" drop constraint "subscriptions_account_id_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_billing_customer_id_fkey";

drop function if exists "public"."upsert_order"(target_account_id uuid, target_customer_id character varying, target_order_id text, status payment_status, billing_provider billing_provider, total_amount numeric, currency character varying, line_items jsonb);

drop function if exists "public"."upsert_subscription"(target_account_id uuid, target_customer_id character varying, target_subscription_id text, active boolean, status subscription_status, billing_provider billing_provider, cancel_at_period_end boolean, currency character varying, period_starts_at timestamp with time zone, period_ends_at timestamp with time zone, line_items jsonb, trial_starts_at timestamp with time zone, trial_ends_at timestamp with time zone);

drop view if exists "public"."user_account_workspace";

alter table "public"."billing_customers" drop constraint "billing_customers_pkey";

alter table "public"."order_items" drop constraint "order_items_pkey";

alter table "public"."orders" drop constraint "orders_pkey";

alter table "public"."subscription_items" drop constraint "subscription_items_pkey";

alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."billing_customers_account_id_customer_id_provider_key";

drop index if exists "public"."billing_customers_pkey";

drop index if exists "public"."ix_billing_customers_account_id";

drop index if exists "public"."ix_order_items_order_id";

drop index if exists "public"."ix_orders_account_id";

drop index if exists "public"."ix_subscription_items_subscription_id";

drop index if exists "public"."ix_subscriptions_account_id";

drop index if exists "public"."order_items_order_id_product_id_variant_id_key";

drop index if exists "public"."order_items_pkey";

drop index if exists "public"."orders_pkey";

drop index if exists "public"."subscription_items_pkey";

drop index if exists "public"."subscription_items_subscription_id_product_id_variant_id_key";

drop index if exists "public"."subscriptions_pkey";

drop table "public"."billing_customers";

drop table "public"."order_items";

drop table "public"."orders";

drop table "public"."subscription_items";

drop table "public"."subscriptions";

alter table "public"."scouting_responses" drop column "google_sheet_id";

alter table "public"."scouting_responses" drop column "google_sheet_title";

drop sequence if exists "public"."billing_customers_id_seq";

grant references on table "public"."accounts" to "authenticated";

grant trigger on table "public"."accounts" to "authenticated";

grant truncate on table "public"."accounts" to "authenticated";

grant references on table "public"."accounts" to "service_role";

grant trigger on table "public"."accounts" to "service_role";

grant truncate on table "public"."accounts" to "service_role";

grant references on table "public"."accounts_memberships" to "authenticated";

grant trigger on table "public"."accounts_memberships" to "authenticated";

grant truncate on table "public"."accounts_memberships" to "authenticated";

grant references on table "public"."accounts_memberships" to "service_role";

grant trigger on table "public"."accounts_memberships" to "service_role";

grant truncate on table "public"."accounts_memberships" to "service_role";

grant delete on table "public"."config" to "authenticated";

grant insert on table "public"."config" to "authenticated";

grant references on table "public"."config" to "authenticated";

grant trigger on table "public"."config" to "authenticated";

grant truncate on table "public"."config" to "authenticated";

grant update on table "public"."config" to "authenticated";

grant delete on table "public"."config" to "service_role";

grant insert on table "public"."config" to "service_role";

grant references on table "public"."config" to "service_role";

grant trigger on table "public"."config" to "service_role";

grant truncate on table "public"."config" to "service_role";

grant update on table "public"."config" to "service_role";

grant references on table "public"."invitations" to "authenticated";

grant trigger on table "public"."invitations" to "authenticated";

grant truncate on table "public"."invitations" to "authenticated";

grant references on table "public"."invitations" to "service_role";

grant trigger on table "public"."invitations" to "service_role";

grant truncate on table "public"."invitations" to "service_role";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant delete on table "public"."role_permissions" to "authenticated";

grant insert on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "authenticated";

grant trigger on table "public"."role_permissions" to "authenticated";

grant truncate on table "public"."role_permissions" to "authenticated";

grant update on table "public"."role_permissions" to "authenticated";

grant references on table "public"."role_permissions" to "service_role";

grant trigger on table "public"."role_permissions" to "service_role";

grant truncate on table "public"."role_permissions" to "service_role";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

create policy "delete_team_account"
on "public"."accounts"
as permissive
for delete
to authenticated
using ((auth.uid() = primary_owner_user_id));



