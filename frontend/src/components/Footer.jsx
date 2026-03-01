import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-container">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link to="/" className="site-footer-logo">
              <i className="fa-solid fa-compass" aria-hidden="true"></i>
              <span>WanderLust</span>
            </Link>
            <p className="site-footer-tagline">
              Find trusted stays and book with confidence.
            </p>
          </div>
          <div className="site-footer-meta">
            <div className="site-footer-socials">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in" aria-hidden="true"></i>
              </a>
            </div>
            <div className="site-footer-links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p>&copy; 2026 WanderLust Private Limited</p>
        </div>
      </div>
    </footer>
  );
}
