from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class RoomStatus(str, enum.Enum):
    available = "available"
    occupied = "occupied"
    cleaning = "cleaning"
    maintenance = "maintenance"

class ReservationStatus(str, enum.Enum):
    confirmed = "confirmed"
    checked_in = "checked_in"
    checked_out = "checked_out"
    cancelled = "cancelled"

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, nullable=False)
    room_type = Column(String(50), nullable=False)   # standard, deluxe, suite
    floor = Column(Integer)
    capacity = Column(Integer, default=2)
    price_per_night = Column(Numeric(10, 2), nullable=False)
    status = Column(Enum(RoomStatus), default=RoomStatus.available)
    reservations = relationship("Reservation", back_populates="room")

class Guest(Base):
    __tablename__ = "guests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    email = Column(String(100))
    id_number = Column(String(50))   # 주민번호 또는 여권번호
    created_at = Column(DateTime, server_default=func.now())
    reservations = relationship("Reservation", back_populates="guest")

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    guest_id = Column(Integer, ForeignKey("guests.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    status = Column(Enum(ReservationStatus), default=ReservationStatus.confirmed)
    total_price = Column(Numeric(10, 2))
    notes = Column(String(500))
    created_at = Column(DateTime, server_default=func.now())
    guest = relationship("Guest", back_populates="reservations")
    room = relationship("Room", back_populates="reservations")