import { useEffect, useState } from 'react';
import './Navbar.css';

const repo = 'https://github.com/modintel/modintel';
const docs = 'https://natanim.dev/blog';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Docs', href: docs, external: true },
  { label: 'GitHub', href: repo, external: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);

  return (
    <header className="nav-shell">
      <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Primary">
        <a href="#top" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span className="brand-word">Mod<span>Intel</span></span>
        </a>

        <div className="nav-links" id="nav-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <a className="btn btn-orange btn-sm nav-cta" href={repo} target="_blank" rel="noreferrer">
            Get started
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
