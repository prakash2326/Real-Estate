import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProperty, fetchPropertyById, updateProperty } from "../api";

const categories = ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Farms", "Arctic"];

const initialState = {
  title: "",
  description: "",
  location: "",
  country: "",
  categories: "Trending",
  price: 0,
  available: true,
  imageFile: null,
};

export default function PropertyFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit") return;
    fetchPropertyById(id)
      .then((payload) => {
        const p = payload.data;
        setForm({
          title: p.title || "",
          description: p.description || "",
          location: p.location || "",
          country: p.country || "",
          categories: p.categories || "Trending",
          price: p.price || 0,
          available: p.available !== false,
          imageFile: null,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "edit") {
        await updateProperty(id, { ...form, price: Number(form.price) });
      } else {
        await createProperty({ ...form, price: Number(form.price) });
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading form...</p>;

  return (
    <section className="details">
      <h1 className="page-title">{mode === "edit" ? "Edit Property" : "New Property"}</h1>
      {error ? <p className="error">{error}</p> : null}
      <form className="form" onSubmit={onSubmit}>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        <input required placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
        <input required placeholder="Country" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
        <input required type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
        <label>
          Property Image
          <div className="file-upload">
            <label className="file-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm((p) => ({ ...p, imageFile: e.target.files?.[0] || null }))}
              />
              Choose image
            </label>
            <span className="file-upload-name">
              {form.imageFile ? form.imageFile.name : "No file selected"}
            </span>
          </div>
        </label>
        <select value={form.categories} onChange={(e) => setForm((p) => ({ ...p, categories: e.target.value }))}>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.available} onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))} />
          Available
        </label>
        <button type="submit">{mode === "edit" ? "Update" : "Create"}</button>
      </form>
    </section>
  );
}
