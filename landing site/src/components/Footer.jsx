import './Footer.css';

const repo = 'https://github.com/modintel/modintel';
const docs = 'https://natanim.dev/blog';
const sponsor = 'https://github.com/sponsors/modintel';

const GhIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.26 9.26 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
  </svg>
);

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Console', href: `${repo}/tree/main/dashboard` },
      { label: 'Sponsor', href: sponsor },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: docs },
      { label: 'Blog', href: docs },
      { label: 'ML pipeline', href: `${repo}/tree/main/ml-pipeline` },
      { label: 'Dashboard', href: `${repo}/tree/main/dashboard` },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: repo },
      { label: 'Issues', href: `${repo}/issues` },
      { label: 'Changelog', href: `${repo}/commits/main` },
      { label: 'License', href: `${repo}/blob/main/LICENSE` },
    ],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="footer-logo" href="#top">
            <span className="footer-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            Mod<span>Intel</span>
          </a>
          <p>
            An open-source hybrid WAF. Coraza and the OWASP Core Rule Set detect, a local model
            judges, and analysts review the edge cases.
          </p>
          <div className="footer-actions">
            <a className="btn btn-orange btn-sm" href={repo} target="_blank" rel="noreferrer">
              <GhIcon />
              GitHub
            </a>
            <a className="footer-sponsor" href={sponsor} target="_blank" rel="noreferrer">
              Sponsor the project
            </a>
          </div>
        </div>

        <nav className="footer-cols" aria-label="Footer">
          {columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer-word" aria-hidden="true">Mod<span>Intel</span></div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ModIntel</span>
        <span className="footer-bottom-note">Open source · self-hosted · no payloads in the cloud</span>
        <a href={repo} target="_blank" rel="noreferrer" aria-label="ModIntel on GitHub">
          <GhIcon size={16} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
