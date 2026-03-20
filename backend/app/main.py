from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import rooms, reservations

Base.metadata.create_all(bind=engine)   # 서버 시작 시 테이블 자동 생성

app = FastAPI(title="Hotel PMS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.80.99:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(reservations.router)

@app.get("/")
def root():
    return {"message": "Hotel PMS API가 정상 동작 중입니다"}

@app.get("/health")
def health():
    return {"status": "ok"}