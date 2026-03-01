import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="auth-card">
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Go to home</Link>
    </section>
  );
}
