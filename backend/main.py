from fastapi import FastAPI,HTTPException
from supabase import create_client,Client
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()


class EventCreate(BaseModel):
    title: str
    description: str
    event_date: str
    capacity: int


class RegisterRequest(BaseModel):
    user_id: str
    event_id: str


@app.post("/events")
def create_event(event: EventCreate):
    response = supabase.table("events").insert({
        "title": event.title,
        "description": event.description,
        "event_date": event.event_date,
        "capacity": event.capacity
    }).execute()

    return response.data


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return response.data


@app.post("/register")
def register_user(data: RegisterRequest):
    response = supabase.rpc("register_user", {
        "p_user": data.user_id,
        "p_event": data.event_id
    }).execute()

    result = response.data

    if result == "FULL":
        raise HTTPException(status_code=400, detail="Event is full")

    return {"status": result}


@app.post("/cancel")
def cancel_registration(data: RegisterRequest):
    supabase.table("registrations") \
        .update({"status": "CANCELLED"}) \
        .eq("user_id", data.user_id) \
        .eq("event_id", data.event_id) \
        .execute()

    supabase.rpc("decrement_registration", {
        "p_event": data.event_id
    }).execute()

    return {"status": "Cancelled"}