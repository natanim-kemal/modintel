import './CTA.css';

const repo = 'https://github.com/modintel/modintel';
const docs = 'https://natanim.dev/blog';

const CTA = () => (
  <section className="cta" id="get-started">
    <div className="cta-grain grain" aria-hidden="true" />
    <div className="container cta-inner">
      <span className="cta-badge" data-reveal>
        <i aria-hidden="true" />
        Open source · self-hosted
      </span>

      <h2 className="cta-title" data-reveal>
        See what your WAF <br className="br-wide" />
        is missing.
      </h2>

      <p className="cta-lede" data-reveal>
        Clear the false positives, catch the quiet attacks, and keep every payload on your
        infrastructure. ModIntel runs beside the stack you already have.
      </p>

      <div className="cta-actions" data-reveal>
        <a className="btn btn-light btn-lg" href={repo} target="_blank" rel="noreferrer">
          Get started on GitHub
          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
        <a className="btn btn-glass btn-lg" href={docs} target="_blank" rel="noreferrer">
          Read the docs
        </a>
      </div>

      <div className="cta-cmd" data-reveal>
        <span aria-hidden="true">$</span>
        <code>git clone https://github.com/modintel/modintel</code>
      </div>
    </div>
  </section>
);

export default CTA;
