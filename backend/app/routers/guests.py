from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Guest
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/guests", tags=["guests"])

class GuestCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    id_number: Optional[str] = None

class GuestOut(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]
    id_number: Optional[str]

    class Config:
        from_attributes = True

@router.get("/", response_model=List[GuestOut])
def get_guests(db: Session = Depends(get_db)):
    return db.query(Guest).all()

@router.get("/{guest_id}", response_model=GuestOut)
def get_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="고객을 찾을 수 없습니다")
    return guest

@router.post("/", response_model=GuestOut)
def create_guest(data: GuestCreate, db: Session = Depends(get_db)):
    guest = Guest(**data.model_dump())
    db.add(guest)
    db.commit()
    db.refresh(guest)
    return guest

@router.put("/{guest_id}", response_model=GuestOut)
def update_guest(guest_id: int, data: GuestCreate, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="고객을 찾을 수 없습니다")
    for key, value in data.model_dump().items():
        setattr(guest, key, value)
    db.commit()
    db.refresh(guest)
    return guest

@router.delete("/{guest_id}")
def delete_guest(guest_id: int, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="고객을 찾을 수 없습니다")
    db.delete(guest)
    db.commit()
    return {"message": "고객이 삭제되었습니다"}