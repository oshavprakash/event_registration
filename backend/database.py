import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("SUPABASE_DB_URL")

schema_sql = """
-- Enable extension
create extension if not exists "pgcrypto";

-- USERS TABLE
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text unique not null,
    created_at timestamp default now()
);

-- EVENTS TABLE
create table if not exists events (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    event_date timestamp not null,
    capacity integer not null,
    registered_count integer default 0,
    created_at timestamp default now()
);

-- REGISTRATIONS TABLE
create table if not exists registrations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    event_id uuid references events(id) on delete cascade,
    status text check (status in ('CONFIRMED','CANCELLED')) default 'CONFIRMED',
    created_at timestamp default now(),
    unique(user_id, event_id)
);

-- INDEXES
create index if not exists idx_event_id on registrations(event_id);
create index if not exists idx_user_id on registrations(user_id);

-- CONCURRENCY-SAFE REGISTRATION FUNCTION
create or replace function register_user(p_user uuid, p_event uuid)
returns text
language plpgsql
as $$
declare
    current_count integer;
    max_capacity integer;
begin
    -- Lock event row
    select registered_count, capacity
    into current_count, max_capacity
    from events
    where id = p_event
    for update;

    if current_count >= max_capacity then
        return 'FULL';
    end if;

    insert into registrations(user_id, event_id)
    values (p_user, p_event);

    update events
    set registered_count = registered_count + 1
    where id = p_event;

    return 'REGISTERED';
end;
$$;

-- DECREMENT FUNCTION
create or replace function decrement_registration(p_event uuid)
returns void
language sql
as $$
update events
set registered_count = registered_count - 1
where id = p_event;
$$;
"""

def create_schema():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute(schema_sql)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database schema created successfully!")

    except Exception as e:
        print(" Error:", e)


if __name__ == "__main__":
    create_schema()
