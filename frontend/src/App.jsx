import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [flights, setFlights] = useState([]);
  const [guests, setGuests] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [selectedFlight, setSelectedFlight] = useState("");
  const [selectedGuest, setSelectedGuest] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");

  const [message, setMessage] = useState("");

  // ---------------- FETCH DATA ----------------

  const fetchFlights = async () => {
    try {
      const response = await fetch(`${API_URL}/flights`);
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGuests = async () => {
    try {
      const response = await fetch(`${API_URL}/guests`);
      const data = await response.json();
      setGuests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchGuests();
    fetchBookings();
  }, []);

  // ---------------- CREATE BOOKING ----------------

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedFlight || !selectedGuest || !travelDate || !travelTime) {
      setMessage("Please fill all the fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flight_number: selectedFlight,
          guest_id: Number(selectedGuest),
          travel_date: travelDate,
          travel_time: travelTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Booking failed.");
        return;
      }

      setMessage(
        `Booking created successfully! Booking ID: ${data.booking_id}`
      );

      setSelectedFlight("");
      setSelectedGuest("");
      setTravelDate("");
      setTravelTime("");

      fetchBookings();
    } catch (error) {
      setMessage("Could not connect to backend.");
    }
  };

  // ---------------- EDIT FLIGHT ----------------

  const editFlight = async (flight) => {
    const newFlightNumber = prompt(
      "Enter new flight number:",
      flight.flight_number
    );

    if (newFlightNumber === null) return;

    const newTiming = prompt(
      "Enter new timing:",
      flight.timing
    );

    if (newTiming === null) return;

    try {
      const response = await fetch(
        `${API_URL}/flights/${flight.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flight_number: newFlightNumber,
            timing: newTiming,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not update flight.");
        return;
      }

      alert("Flight updated successfully.");
      fetchFlights();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- DELETE FLIGHT ----------------

  const deleteFlight = async (flightId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flight?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/flights/${flightId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not delete flight.");
        return;
      }

      alert("Flight deleted successfully.");
      fetchFlights();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- HEAD FLIGHT ----------------

  const checkFlight = async (flightId) => {
    try {
      const response = await fetch(
        `${API_URL}/flights/${flightId}`,
        {
          method: "HEAD",
        }
      );

      if (response.ok) {
        alert(`Flight ${flightId} exists.`);
      } else {
        alert(`Flight ${flightId} does not exist.`);
      }
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- EDIT GUEST ----------------

  const editGuest = async (guest) => {
    const newName = prompt(
      "Enter new name:",
      guest.name
    );

    if (newName === null) return;

    const newMobile = prompt(
      "Enter new mobile number:",
      guest.mobile_number
    );

    if (newMobile === null) return;

    try {
      const response = await fetch(
        `${API_URL}/guests/${guest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            mobile_number: newMobile,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not update guest.");
        return;
      }

      alert("Guest updated successfully.");
      fetchGuests();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- DELETE GUEST ----------------

  const deleteGuest = async (guestId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this guest?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/guests/${guestId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not delete guest.");
        return;
      }

      alert("Guest deleted successfully.");
      fetchGuests();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- HEAD GUEST ----------------

  const checkGuest = async (guestId) => {
    try {
      const response = await fetch(
        `${API_URL}/guests/${guestId}`,
        {
          method: "HEAD",
        }
      );

      if (response.ok) {
        alert(`Guest ${guestId} exists.`);
      } else {
        alert(`Guest ${guestId} does not exist.`);
      }
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- EDIT BOOKING ----------------

  const editBooking = async (booking) => {
    const newFlightNumber = prompt(
      "Enter flight number:",
      booking.flight_number
    );

    if (newFlightNumber === null) return;

    const newGuestId = prompt(
      "Enter guest ID:",
      booking.guest_id
    );

    if (newGuestId === null) return;

    const newDate = prompt(
      "Enter travel date (YYYY-MM-DD):",
      booking.travel_date
    );

    if (newDate === null) return;

    const newTime = prompt(
      "Enter travel time (HH:MM:SS):",
      booking.travel_time
    );

    if (newTime === null) return;

    try {
      const response = await fetch(
        `${API_URL}/bookings/${booking.booking_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            flight_number: newFlightNumber,
            guest_id: Number(newGuestId),
            travel_date: newDate,
            travel_time: newTime,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not update booking.");
        return;
      }

      alert("Booking updated successfully.");
      fetchBookings();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- DELETE BOOKING ----------------

  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Could not delete booking.");
        return;
      }

      alert("Booking deleted successfully.");
      fetchBookings();
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  // ---------------- HEAD BOOKING ----------------

  const checkBooking = async (bookingId) => {
    try {
      const response = await fetch(
        `${API_URL}/bookings/${bookingId}`,
        {
          method: "HEAD",
        }
      );

      if (response.ok) {
        alert(`Booking ${bookingId} exists.`);
      } else {
        alert(`Booking ${bookingId} does not exist.`);
      }
    } catch (error) {
      alert("Could not connect to backend.");
    }
  };

  return (
    <div className="container">

      {/* HEADER */}
      <header className="header">
        <h1>✈ Airline Management System</h1>
        <p>Simple Flight Booking System</p>
      </header>

      {/* FLIGHTS */}
      <section className="section">

        <h2>Available Flights</h2>

        <div className="card-grid">

          {flights.map((flight) => (

            <div className="card" key={flight.id}>

              <h3>{flight.flight_number}</h3>

              <p>
                <strong>Timing:</strong> {flight.timing}
              </p>

              <div className="actions">

                <button
                  onClick={() => editFlight(flight)}
                  className="edit-btn"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteFlight(flight.id)}
                  className="delete-btn"
                >
                  Delete
                </button>

                <button
                  onClick={() => checkFlight(flight.id)}
                  className="check-btn"
                >
                  Check
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* GUESTS */}
      <section className="section">

        <h2>Guests</h2>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {guests.map((guest) => (

                <tr key={guest.id}>

                  <td>{guest.id}</td>
                  <td>{guest.name}</td>
                  <td>{guest.mobile_number}</td>

                  <td>

                    <button
                      onClick={() => editGuest(guest)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteGuest(guest.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => checkGuest(guest.id)}
                      className="check-btn"
                    >
                      Check
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

      {/* BOOKING */}
      <section className="section">

        <h2>Book a Flight</h2>

        <form
          onSubmit={handleBooking}
          className="booking-form"
        >

          <label>Select Flight</label>

          <select
            value={selectedFlight}
            onChange={(e) =>
              setSelectedFlight(e.target.value)
            }
          >

            <option value="">
              Choose a flight
            </option>

            {flights.map((flight) => (

              <option
                key={flight.id}
                value={flight.flight_number}
              >
                {flight.flight_number} - {flight.timing}
              </option>

            ))}

          </select>


          <label>Select Guest</label>

          <select
            value={selectedGuest}
            onChange={(e) =>
              setSelectedGuest(e.target.value)
            }
          >

            <option value="">
              Choose a guest
            </option>

            {guests.map((guest) => (

              <option
                key={guest.id}
                value={guest.id}
              >
                {guest.name} - {guest.mobile_number}
              </option>

            ))}

          </select>


          <label>Travel Date</label>

          <input
            type="date"
            value={travelDate}
            onChange={(e) =>
              setTravelDate(e.target.value)
            }
          />


          <label>Travel Time</label>

          <input
            type="time"
            value={travelTime}
            onChange={(e) =>
              setTravelTime(e.target.value)
            }
          />


          <button type="submit">
            Book Flight
          </button>

        </form>

        {message && (
          <div className="message">
            {message}
          </div>
        )}

      </section>

      {/* BOOKINGS */}
      <section className="section">

        <h2>Bookings</h2>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Booking ID</th>
                <th>Flight Number</th>
                <th>Guest ID</th>
                <th>Travel Date</th>
                <th>Travel Time</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking.booking_id}>

                  <td>{booking.booking_id}</td>
                  <td>{booking.flight_number}</td>
                  <td>{booking.guest_id}</td>
                  <td>{booking.travel_date}</td>
                  <td>{booking.travel_time}</td>

                  <td>

                    <button
                      onClick={() => editBooking(booking)}
                      className="edit-btn"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteBooking(booking.booking_id)
                      }
                      className="delete-btn"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        checkBooking(booking.booking_id)
                      }
                      className="check-btn"
                    >
                      Check
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default App;