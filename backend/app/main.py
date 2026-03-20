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
    allow_origins=["http://192.168.80.99"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# /api prefix 추가
app.include_router(rooms.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(guests.router, prefix="/api")
app.include_router(housekeeping.router, prefix="/api")

@app.get("/api")
def root():
    return {"message": "Hotel PMS API가 정상 동작 중입니다"}

@app.get("/api/health")
def health():
    return {"status": "ok"}