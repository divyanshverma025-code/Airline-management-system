from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from database import Base


class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, nullable=False)
    timing = Column(String, nullable=False)


class Guest(Base):
    __tablename__ = "guests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(
        String,
        ForeignKey("flights.flight_number"),
        nullable=False
    )
    guest_id = Column(
        Integer,
        ForeignKey("guests.id"),
        nullable=False
    )
    travel_date = Column(Date, nullable=False)
    travel_time = Column(Time, nullable=False)