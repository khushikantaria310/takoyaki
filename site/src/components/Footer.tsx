export function Footer() {
  return (
    <footer className="site-footer" id="project">
      <div className="site-footer__inner">
        <div>
          <a className="brand" href="#main" aria-label="Takoyaki, back to the top">
            <span className="brand__seal" aria-hidden="true">焼</span>
            <span className="brand__wordmark">Takoyaki<span>.</span></span>
          </a>
          <p className="footer-note">
            GitHub activity, served hot in your Discord channel.
          </p>
        </div>

        <nav className="footer-links" aria-label="Project links">
          <a href="#main">Back to top</a>
          <a href="#notifications">Notifications</a>
          <a href="#setup">Setup</a>
        </nav>
      </div>
      <div className="footer-bottom">
        Takoyaki / GitHub → Discord / たこ焼き
      </div>
    </footer>
  );
}
