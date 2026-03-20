from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Reservation, Room, Guest, ReservationStatus, RoomStatus
from pydantic import BaseModel
from datetime import date
from typing import List, Optional

router = APIRouter(prefix="/reservations", tags=["reservations"])

class ReservationCreate(BaseModel):
    guest_id: int
    room_id: int
    check_in_date: date
    check_out_date: date
    notes: Optional[str] = None

class ReservationOut(BaseModel):
    id: int
    guest_id: int
    room_id: int
    check_in_date: date
    check_out_date: date
    status: str
    total_price: Optional[float]
    notes: Optional[str]

    class Config:
        from_attributes = True

@router.get("/", response_model=List[ReservationOut])
def get_reservations(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Reservation)
    if status:
        query = query.filter(Reservation.status == status)
    return query.all()

@router.post("/", response_model=ReservationOut)
def create_reservation(data: ReservationCreate, db: Session = Depends(get_db)):
    # 객실 가용 여부 확인
    room = db.query(Room).filter(Room.id == data.room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="객실을 찾을 수 없습니다")
    if room.status != RoomStatus.available:
        raise HTTPException(status_code=400, detail="해당 객실은 현재 예약 불가능합니다")
    # 총 금액 계산
    nights = (data.check_out_date - data.check_in_date).days
    total_price = float(room.price_per_night) * nights
    reservation = Reservation(
        **data.model_dump(), total_price=total_price,
        status=ReservationStatus.confirmed
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation

@router.patch("/{reservation_id}/checkin")
def check_in(reservation_id: int, db: Session = Depends(get_db)):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다")
    res.status = ReservationStatus.checked_in
    res.room.status = RoomStatus.occupied
    db.commit()
    return {"message": "체크인 완료", "reservation_id": reservation_id}

@router.patch("/{reservation_id}/checkout")
def check_out(reservation_id: int, db: Session = Depends(get_db)):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다")
    res.status = ReservationStatus.checked_out
    res.room.status = RoomStatus.cleaning   # 체크아웃 후 청소 상태로
    db.commit()
    return {"message": "체크아웃 완료", "reservation_id": reservation_id}