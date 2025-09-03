-- Enable Row Level Security
alter table if exists auth.users enable row level security;

-- Create Students table
create table if not exists public.students (
  id uuid references auth.users on delete cascade primary key,
  student_id varchar(20) unique not null,
  full_name text not null,
  email varchar(255) unique not null,
  department text not null,
  phone varchar(20),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Department Users table
create table if not exists public.department_users (
  id uuid references auth.users on delete cascade primary key,
  username varchar(50) unique not null,
  full_name text not null,
  email varchar(255) unique not null,
  department text not null,
  role text not null check (role in ('department_officer', 'accounts')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Departments table
create table if not exists public.departments (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  code varchar(10) not null unique,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Clearance Records table
create table if not exists public.clearance_records (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.students(id) on delete cascade not null,
  department text not null,
  status text not null check (status in ('pending', 'cleared', 'blocked')),
  notes text,
  cleared_by text,
  cleared_at timestamp with time zone,
  updated_by uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, department)
);

-- Insert default departments
insert into public.departments (name, code, description) values
  ('Library', 'LIB', 'University Library Services'),
  ('Computer Science', 'CS', 'Computer Science Department'),
  ('Engineering', 'ENG', 'Engineering Department'),
  ('Business', 'BUS', 'Business Studies Department'),
  ('Science', 'SCI', 'Science Department'),
  ('SS&FC', 'SSFC', 'Student Services & Finance Committee'),
  ('Mess', 'MESS', 'Mess Hall Services'),
  ('AV Unit', 'AV', 'Audio Visual Unit'),
  ('Bookshop', 'BOOK', 'University Bookshop'),
  ('Accounts Office', 'ACC', 'Accounts & Finance Office')
on conflict (name) do nothing;

-- Create triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger handle_students_updated_at before update on public.students
  for each row execute procedure public.handle_updated_at();

create trigger handle_department_users_updated_at before update on public.department_users
  for each row execute procedure public.handle_updated_at();

create trigger handle_clearance_records_updated_at before update on public.clearance_records
  for each row execute procedure public.handle_updated_at();

-- Row Level Security Policies

-- Students can only see their own data
create policy "Students can view own profile" on public.students
  for select using (auth.uid() = id);

create policy "Students can update own profile" on public.students
  for update using (auth.uid() = id);

-- Department users can view their own data
create policy "Department users can view own profile" on public.department_users
  for select using (auth.uid() = id);

create policy "Department users can update own profile" on public.department_users
  for update using (auth.uid() = id);

-- Clearance records access
create policy "Students can view own clearance records" on public.clearance_records
  for select using (
    student_id = auth.uid() or
    exists (
      select 1 from public.department_users
      where id = auth.uid()
    )
  );

create policy "Department users can insert clearance records" on public.clearance_records
  for insert with check (
    exists (
      select 1 from public.department_users
      where id = auth.uid()
      and (department = new.department or role = 'accounts')
    )
  );

create policy "Department users can update clearance records" on public.clearance_records
  for update using (
    exists (
      select 1 from public.department_users
      where id = auth.uid()
      and (department = clearance_records.department or role = 'accounts')
    )
  );

-- Departments table - everyone can read
create policy "Everyone can view departments" on public.departments
  for select using (true);

-- Enable RLS on all tables
alter table public.students enable row level security;
alter table public.department_users enable row level security;
alter table public.departments enable row level security;
alter table public.clearance_records enable row level security;

-- Create indexes for better performance
create index if not exists idx_students_student_id on public.students(student_id);
create index if not exists idx_department_users_username on public.department_users(username);
create index if not exists idx_clearance_records_student_dept on public.clearance_records(student_id, department);
create index if not exists idx_clearance_records_department on public.clearance_records(department);
create index if not exists idx_clearance_records_status on public.clearance_records(status);