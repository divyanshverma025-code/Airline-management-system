from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Flight, Guest, Booking
from schemas import (
    FlightCreate,
    FlightResponse,
    GuestCreate,
    GuestResponse,
    BookingCreate,
    BookingResponse
)


app = FastAPI(
    title="Airline Management System",
    version="1.0.0"
)




app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



Base.metadata.create_all(bind=engine)




@app.get("/")
def home():
    return {
        "message": "Airline Management System API is running"
    }



@app.get(
    "/flights",
    response_model=list[FlightResponse]
)
def get_flights(
    db: Session = Depends(get_db)
):
    flights = db.query(Flight).all()
    return flights


# GET - Get one flight
@app.get(
    "/flights/{flight_id}",
    response_model=FlightResponse
)
def get_flight(
    flight_id: int,
    db: Session = Depends(get_db)
):
    flight = db.query(Flight).filter(
        Flight.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

    return flight


# POST - Create flight
@app.post(
    "/flights",
    response_model=FlightResponse
)
def create_flight(
    flight_data: FlightCreate,
    db: Session = Depends(get_db)
):

    # Check duplicate flight number
    existing_flight = db.query(Flight).filter(
        Flight.flight_number == flight_data.flight_number
    ).first()

    if existing_flight:
        raise HTTPException(
            status_code=400,
            detail="Flight number already exists"
        )

    new_flight = Flight(
        flight_number=flight_data.flight_number,
        timing=flight_data.timing
    )

    db.add(new_flight)
    db.commit()
    db.refresh(new_flight)

    return new_flight


# PATCH - Update flight
@app.patch(
    "/flights/{flight_id}",
    response_model=FlightResponse
)
def update_flight(
    flight_id: int,
    flight_data: FlightCreate,
    db: Session = Depends(get_db)
):

    flight = db.query(Flight).filter(
        Flight.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

    # Check if another flight already uses the new number
    duplicate = db.query(Flight).filter(
        Flight.flight_number == flight_data.flight_number,
        Flight.id != flight_id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Another flight already uses this flight number"
        )

    flight.flight_number = flight_data.flight_number
    flight.timing = flight_data.timing

    db.commit()
    db.refresh(flight)

    return flight


# DELETE - Delete flight
@app.delete(
    "/flights/{flight_id}"
)
def delete_flight(
    flight_id: int,
    db: Session = Depends(get_db)
):

    flight = db.query(Flight).filter(
        Flight.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

    # Check whether bookings exist for this flight
    bookings = db.query(Booking).filter(
        Booking.flight_number == flight.flight_number
    ).first()

    if bookings:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete flight because bookings exist for this flight"
        )

    db.delete(flight)
    db.commit()

    return {
        "message": "Flight deleted successfully"
    }


# HEAD - Check whether flight exists
@app.head(
    "/flights/{flight_id}"
)
def check_flight(
    flight_id: int,
    db: Session = Depends(get_db)
):

    flight = db.query(Flight).filter(
        Flight.id == flight_id
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

    return Response(status_code=200)


# =========================================================
# GUEST APIs
# =========================================================

# GET - Get all guests
@app.get(
    "/guests",
    response_model=list[GuestResponse]
)
def get_guests(
    db: Session = Depends(get_db)
):
    guests = db.query(Guest).all()
    return guests


# GET - Get one guest
@app.get(
    "/guests/{guest_id}",
    response_model=GuestResponse
)
def get_guest(
    guest_id: int,
    db: Session = Depends(get_db)
):

    guest = db.query(Guest).filter(
        Guest.id == guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

    return guest



@app.post(
    "/guests",
    response_model=GuestResponse
)
def create_guest(
    guest_data: GuestCreate,
    db: Session = Depends(get_db)
):

    new_guest = Guest(
        name=guest_data.name,
        mobile_number=guest_data.mobile_number
    )

    db.add(new_guest)
    db.commit()
    db.refresh(new_guest)

    return new_guest



@app.patch(
    "/guests/{guest_id}",
    response_model=GuestResponse
)
def update_guest(
    guest_id: int,
    guest_data: GuestCreate,
    db: Session = Depends(get_db)
):

    guest = db.query(Guest).filter(
        Guest.id == guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

    guest.name = guest_data.name
    guest.mobile_number = guest_data.mobile_number

    db.commit()
    db.refresh(guest)

    return guest



@app.delete(
    "/guests/{guest_id}"
)
def delete_guest(
    guest_id: int,
    db: Session = Depends(get_db)
):

    guest = db.query(Guest).filter(
        Guest.id == guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

    # Check whether guest has bookings
    booking = db.query(Booking).filter(
        Booking.guest_id == guest_id
    ).first()

    if booking:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete guest because bookings exist for this guest"
        )

    db.delete(guest)
    db.commit()

    return {
        "message": "Guest deleted successfully"
    }



@app.head(
    "/guests/{guest_id}"
)
def check_guest(
    guest_id: int,
    db: Session = Depends(get_db)
):

    guest = db.query(Guest).filter(
        Guest.id == guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

    return Response(status_code=200)



@app.get(
    "/bookings",
    response_model=list[BookingResponse]
)
def get_bookings(
    db: Session = Depends(get_db)
):
    bookings = db.query(Booking).all()
    return bookings



@app.get(
    "/bookings/{booking_id}",
    response_model=BookingResponse
)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking


@app.post(
    "/bookings",
    response_model=BookingResponse
)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db)
):

    flight = db.query(Flight).filter(
        Flight.flight_number == booking_data.flight_number
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

  
    guest = db.query(Guest).filter(
        Guest.id == booking_data.guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

   
    new_booking = Booking(
        flight_number=booking_data.flight_number,
        guest_id=booking_data.guest_id,
        travel_date=booking_data.travel_date,
        travel_time=booking_data.travel_time
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    return new_booking



@app.patch(
    "/bookings/{booking_id}",
    response_model=BookingResponse
)
def update_booking(
    booking_id: int,
    booking_data: BookingCreate,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    # Check flight exists
    flight = db.query(Flight).filter(
        Flight.flight_number == booking_data.flight_number
    ).first()

    if not flight:
        raise HTTPException(
            status_code=404,
            detail="Flight not found"
        )

    
    guest = db.query(Guest).filter(
        Guest.id == booking_data.guest_id
    ).first()

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found"
        )

    booking.flight_number = booking_data.flight_number
    booking.guest_id = booking_data.guest_id
    booking.travel_date = booking_data.travel_date
    booking.travel_time = booking_data.travel_time

    db.commit()
    db.refresh(booking)

    return booking



@app.delete(
    "/bookings/{booking_id}"
)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    db.delete(booking)
    db.commit()

    return {
        "message": "Booking deleted successfully"
    }



@app.head(
    "/bookings/{booking_id}"
)
def check_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return Response(status_code=200)