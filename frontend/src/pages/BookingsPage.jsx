import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBookings } from "../api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings()
      .then((payload) => setBookings(payload.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h1 className="page-title">My Bookings</h1>
      {bookings.length === 0 ? <p>No bookings found.</p> : null}
      <div className="grid">
        {bookings.map((booking) => (
          <article key={booking._id} className="card">
            <h2>{booking.property?.title}</h2>
            <p>{booking.property?.location}, {booking.property?.country}</p>
            <p>
              Rs. {Number(booking.property?.price || 0).toLocaleString("en-IN")}/night
            </p>
            <p className={booking.property?.available === false ? "status-unavailable" : "status-available"}>
              {booking.property?.available === false ? "Unavailable" : "Available"}
            </p>
            <Link to={`/properties/${booking.property?._id}`}>View property</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
