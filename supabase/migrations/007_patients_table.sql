-- ============================================================
-- Amaterra Dental Clinic — Migration 007: Patients Table
-- ============================================================

-- 1. Create the patients table
create table if not exists public.patients (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  phone         text not null unique,
  email         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.patients is 'Unified patient database holding contact information and history.';

-- 2. Add patient_id to appointments
alter table public.appointments
  add column if not exists patient_id uuid references public.patients(id) on delete restrict;

create index if not exists idx_appointments_patient_id on public.appointments(patient_id);

-- 3. Enable RLS on patients
alter table public.patients enable row level security;

-- Only authenticated admins can manage patients
create policy "Admins can manage patients"
  on public.patients for all
  using (true)
  with check (true);

-- 4. Auto-update updated_at trigger for patients
create trigger set_updated_at before update on public.patients
  for each row execute function public.handle_updated_at();

-- 5. Data Migration: Migrate existing appointments to the new patients table
-- We group existing appointments by phone number to create unique patients
do $$
declare
  r record;
  new_patient_id uuid;
begin
  for r in 
    select distinct phone, 
           (array_agg(first_name order by created_at desc))[1] as latest_first_name,
           (array_agg(last_name order by created_at desc))[1] as latest_last_name,
           (array_agg(email order by created_at desc))[1] as latest_email
    from public.appointments
    where phone is not null and phone != ''
    group by phone
  loop
    -- Check if patient already exists (in case script runs twice)
    select id into new_patient_id from public.patients where phone = r.phone;
    
    if new_patient_id is null then
      insert into public.patients (first_name, last_name, phone, email)
      values (r.latest_first_name, r.latest_last_name, r.phone, r.latest_email)
      returning id into new_patient_id;
    end if;

    -- Update appointments to link to this patient
    update public.appointments 
    set patient_id = new_patient_id 
    where phone = r.phone and patient_id is null;
  end loop;
end;
$$;
