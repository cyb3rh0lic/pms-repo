from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Room, RoomStatus
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/rooms", tags=["rooms"])

class RoomOut(BaseModel):
    id: int
    room_number: str
    room_type: str
    floor: int
    capacity: int
    price_per_night: float
    status: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[RoomOut])
def get_rooms(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Room)
    if status:
        query = query.filter(Room.status == status)
    return query.all()

@router.patch("/{room_id}/status")
def update_room_status(room_id: int, status: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="객실을 찾을 수 없습니다")
    room.status = status
    db.commit()
    return {"message": "객실 상태가 업데이트되었습니다", "room_id": room_id, "status": status}