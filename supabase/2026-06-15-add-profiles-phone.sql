-- Adds a phone column to profiles so coaches/commissioners can manage their
-- contact phone number from the Account settings tab.

alter table public.profiles add column if not exists phone text;
