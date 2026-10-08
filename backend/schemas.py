from datetime import date, time
from pydantic import BaseModel


# ---------- FLIGHT ----------

class FlightCreate(BaseModel):
    flight_number: str
    timing: str


class FlightResponse(BaseModel):
    id: int
    flight_number: str
    timing: str

    class Config:
        from_attributes = True


# ---------- GUEST ----------

class GuestCreate(BaseModel):
    name: str
    mobile_number: str


class GuestResponse(BaseModel):
    id: int
    name: str
    mobile_number: str

    class Config:
        from_attributes = True


# ---------- BOOKING ----------

class BookingCreate(BaseModel):
    flight_number: str
    guest_id: int
    travel_date: date
    travel_time: time


class BookingResponse(BaseModel):
    booking_id: int
    flight_number: str
    guest_id: int
    travel_date: date
    travel_time: time

    class Config:
        from_attributes = True