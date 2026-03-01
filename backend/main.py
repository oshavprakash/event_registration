# -------------------------------
# SeatFlow - Event Registration API
# -------------------------------

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (HTML/JS) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Temporary In-Memory Database
# -------------------------------

users = []

events = [
    {
        "id": 1,
        "title": "AI & Machine Learning Workshop",
        "date": "2026-03-10",
        "total_seats": 5,
        "registered": 0
    },
    {
        "id": 2,
        "title": "Full Stack Web Bootcamp",
        "date": "2026-03-15",
        "total_seats": 3,
        "registered": 0
    }
]

# -------------------------------
# Data Models
# -------------------------------

class User(BaseModel):
    name: str
    email: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class EventRegistration(BaseModel):
    event_id: int


# -------------------------------
# SIGNUP Endpoint
# -------------------------------

@app.post("/signup")
def signup(user: User):
    for u in users:
        if u["email"] == user.email:
            raise HTTPException(status_code=400, detail="User already exists")

    users.append(user.dict())
    return {"message": "Signup successful"}


# -------------------------------
# LOGIN Endpoint
# -------------------------------

@app.post("/login")
def login(data: Login):
    for u in users:
        if u["email"] == data.email and u["password"] == data.password:
            return {"message": "Login successful"}

    raise HTTPException(status_code=400, detail="Invalid credentials")


# -------------------------------
# GET ALL EVENTS
# -------------------------------

@app.get("/events")
def get_events():
    return events


# -------------------------------
# REGISTER FOR EVENT
# -------------------------------

@app.post("/register/{event_id}")
def register_event(event_id: int):

    for event in events:
        if event["id"] == event_id:

            # Check if event is full
            if event["registered"] >= event["total_seats"]:
                raise HTTPException(status_code=400, detail="Event Fully Booked")

            event["registered"] += 1
            return {"message": "Registration successful"}

    raise HTTPException(status_code=404, detail="Event not found")