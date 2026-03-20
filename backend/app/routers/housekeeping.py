from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Room, RoomStatus
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/housekeeping", tags=["housekeeping"])

class HousekeepingOut(BaseModel):
    id: int
    room_number: str
    floor: int
    room_type: str
    status: str

    class Config:
        from_attributes = True

@router.get("/", response_model=List[HousekeepingOut])
def get_housekeeping_status(db: Session = Depends(get_db)):
    # 청소 필요한 객실만 조회 (cleaning, available 상태)
    rooms = db.query(Room).filter(
        Room.status.in_([RoomStatus.cleaning, RoomStatus.available])
    ).all()
    return rooms

@router.get("/all", response_model=List[HousekeepingOut])
def get_all_rooms_status(db: Session = Depends(get_db)):
    # 전체 객실 상태 조회
    return db.query(Room).order_by(Room.floor, Room.room_number).all()

@router.patch("/{room_id}/clean")
def mark_as_cleaned(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="객실을 찾을 수 없습니다")
    if room.status != RoomStatus.cleaning:
        raise HTTPException(status_code=400, detail="청소 중인 객실이 아닙니다")
    room.status = RoomStatus.available
    db.commit()
    return {"message": f"{room.room_number}호 청소 완료", "status": "available"}

@router.patch("/{room_id}/maintenance")
def mark_as_maintenance(room_id: int, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="객실을 찾을 수 없습니다")
    room.status = RoomStatus.maintenance
    db.commit()
    return {"message": f"{room.room_number}호 점검 중으로 변경", "status": "maintenance"}