import { discordInviteUrl } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="footer-mark">たこやき</p>
          <p className="footer-note">GitHub → Discord, served fresh.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <a href="#home">home</a>
          <a href="#features">features</a>
          <a href="#commands">commands</a>
          <a href={discordInviteUrl} target="_blank" rel="noreferrer">add to discord</a>
        </nav>
      </div>
    </footer>
  );
}
