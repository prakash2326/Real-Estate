import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBooking, createReview, deleteProperty, deleteReview, fetchPropertyById } from "../api";
import { useAuth } from "../context/AuthContext";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProperty = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await fetchPropertyById(id);
      setProperty(payload.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  const onBook = async () => {
    try {
      await createBooking(id);
      navigate("/bookings");
    } catch (err) {
      setError(err.message);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProperty(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const onCreateReview = async (e) => {
    e.preventDefault();
    try {
      await createReview(id, { rating: Number(review.rating), comment: review.comment });
      setReview({ rating: 5, comment: "" });
      await loadProperty();
    } catch (err) {
      setError(err.message);
    }
  };

  const onDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId);
      await loadProperty();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading property...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!property) return <p>Property not found.</p>;

  const canAdmin = user && user.role === "Admin";
  const canBook = user && user.role === "Client";
  const reviews = property.reviews || [];

  return (
    <section className="details">
      <Link to="/">Back</Link>
      <h1 className="page-title">{property.title}</h1>
      <img src={property?.image?.url} alt={property.title} className="hero-image" />
      <p>{property.description}</p>
      <p>{property.location}, {property.country}</p>
      <p>Category: {property.categories}</p>
      <p>Rs. {Number(property.price || 0).toLocaleString("en-IN")}/night</p>
      <p>Status: {property.available === false ? "Unavailable" : "Available"}</p>

      <div className="actions-row">
        {canBook ? <button onClick={onBook}>Book now</button> : null}
        {canAdmin ? <Link to={`/properties/${property._id}/edit`} className="btn-link">Edit</Link> : null}
        {canAdmin ? <button className="danger" onClick={onDelete}>Delete</button> : null}
      </div>

      <h2>Reviews</h2>
      {reviews.length === 0 ? <p>No reviews yet.</p> : null}
      <div className="reviews">
        {reviews.map((r) => (
          <article key={r._id} className="review">
            <p>Rating: {r.rating}/5</p>
            <p>{r.comment}</p>
            {user && r.author && user.id === r.author._id ? (
              <button className="danger" onClick={() => onDeleteReview(r._id)}>Delete review</button>
            ) : null}
          </article>
        ))}
      </div>

      {user ? (
        <form className="form" onSubmit={onCreateReview}>
          <h3>Add review</h3>
          <select
            value={review.rating}
            onChange={(e) => setReview((prev) => ({ ...prev, rating: e.target.value }))}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
          <textarea
            required
            value={review.comment}
            onChange={(e) => setReview((prev) => ({ ...prev, comment: e.target.value }))}
            placeholder="Your feedback"
          />
          <button type="submit">Submit review</button>
        </form>
      ) : null}
    </section>
  );
}
