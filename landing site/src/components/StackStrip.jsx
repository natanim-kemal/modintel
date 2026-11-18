import './StackStrip.css';

const icons = {
  shield: 'M12 3 19 6.2v5.3c0 4.2-2.9 7-7 8.3-4.1-1.3-7-4.1-7-8.3V6.2z',
  layers: 'M12 3 21 8l-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM7 7h.01M7 17h.01',
  branch: 'M6 4v10a4 4 0 0 0 4 4h8M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  arrows: 'M4 8h13l-3-3M20 16H7l3 3',
};

const items = [
  { label: 'Coraza', icon: 'shield' },
  { label: 'OWASP Core Rule Set', icon: 'layers' },
  { label: 'Self-hosted', icon: 'server' },
  { label: 'Open source', icon: 'branch' },
  { label: 'Drop-in proxy', icon: 'arrows' },
];

const StackStrip = () => (
  <section className="stack" aria-label="Compatibility">
    <div className="container">
      <p className="stack-label" data-reveal>Built on the WAF you already trust</p>
      <div className="stack-row" data-reveal>
        {items.map((item) => (
          <span className="stack-item" key={item.label}>
            <svg className="stack-ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d={icons[item.icon]} />
            </svg>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default StackStrip;
