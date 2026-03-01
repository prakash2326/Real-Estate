import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperties } from "../api";

const categories = [
  { name: "Trending", icon: "fa-solid fa-fire" },
  { name: "Rooms", icon: "fa-solid fa-bed" },
  { name: "Iconic Cities", icon: "fa-solid fa-mountain-city" },
  { name: "Mountains", icon: "fa-solid fa-mountain-sun" },
  { name: "Castles", icon: "fa-regular fa-house" },
  { name: "Amazing Pools", icon: "fa-solid fa-person-swimming" },
  { name: "Camping", icon: "fa-solid fa-campground" },
  { name: "Farms", icon: "fa-regular fa-house" },
  { name: "Arctic", icon: "fa-regular fa-snowflake" },
];

export default function PropertiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ q: "", available: "all", categories: "" });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    fetchProperties(filters)
      .then((payload) => {
        if (isMounted) setItems(payload.data || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <section>
      <h1 className="page-title">Properties</h1>
      <div className="category-filters">
        <button
          type="button"
          className={`category-pill ${filters.categories === "" ? "active" : ""}`}
          onClick={() => setFilters((prev) => ({ ...prev, categories: "" }))}
        >
          <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
          All
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat.name}
            className={`category-pill ${filters.categories === cat.name ? "active" : ""}`}
            onClick={() => setFilters((prev) => ({ ...prev, categories: cat.name }))}
          >
            <i className={cat.icon} aria-hidden="true"></i>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title"
          value={filters.q}
          onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
        />
        <select
          value={filters.available}
          onChange={(e) => setFilters((prev) => ({ ...prev, available: e.target.value }))}
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <button type="button" className="search-btn-icon" aria-label="Search">
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          Search
        </button>
      </div>

      {loading ? <p>Loading properties...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {!loading && !error ? (
        <div className="grid">
          {items.map((property) => (
            <Link key={property._id} to={`/properties/${property._id}`} className="card-link">
              <article className="card">
                <img className="card-image" src={property?.image?.url} alt={property.title} />
                <h2>{property.title}</h2>
                <p>{property.location}, {property.country}</p>
                <p>
                  Rs. {Number(property.price || 0).toLocaleString("en-IN")}/night
                </p>
                <p className={property.available === false ? "status-unavailable" : "status-available"}>
                  {property.available === false ? "Unavailable" : "Available"}
                </p>
              </article>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
