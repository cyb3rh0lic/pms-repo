from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import rooms, reservations, guests, housekeeping

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hotel PMS API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.80.99:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(reservations.router)
app.include_router(guests.router)
app.include_router(housekeeping.router)

@app.get("/")
def root():
    return {"message": "Hotel PMS API가 정상 동작 중입니다"}

@app.get("/health")
def health():
    return {"status": "ok"}