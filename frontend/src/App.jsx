import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BookingsPage from "./pages/BookingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from "./components/Footer";

function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <i className="fa-solid fa-compass" aria-hidden="true"></i>
          <span>Wanderlust</span>
        </Link>
        <nav className="topnav">
          <Link to="/" className="nav-btn">Home</Link>
          {user && user.role === "Client" ? <Link to="/bookings" className="nav-btn">Bookings</Link> : null}
          {user && user.role === "Admin" ? <Link to="/properties/new" className="nav-btn">Add Property</Link> : null}
          {!user ? <Link to="/login" className="nav-btn">Login</Link> : null}
          {!user ? <Link to="/signup" className="nav-btn">Signup</Link> : null}
          {user ? <button className="link-button nav-btn" onClick={onLogout}>Logout</button> : null}
        </nav>
      </header>
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "Admin") return <Navigate to="/login" replace />;
  return children;
}

function ClientOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "Client") return <Navigate to="/login" replace />;
  return children;
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route
          path="/properties/new"
          element={
            <AdminOnly>
              <PropertyFormPage mode="create" />
            </AdminOnly>
          }
        />
        <Route
          path="/properties/:id/edit"
          element={
            <AdminOnly>
              <PropertyFormPage mode="edit" />
            </AdminOnly>
          }
        />
        <Route
          path="/bookings"
          element={
            <ClientOnly>
              <BookingsPage />
            </ClientOnly>
          }
        />
        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignupPage />
            </GuestOnly>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppShell>
  );
}
