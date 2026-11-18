import './Hero.css';

const repo = 'https://github.com/modintel/modintel';
const docs = 'https://natanim.dev/blog';

const Hero = () => {
  return (
    <section className="hero" id="top">
      <div className="hero-grain grain" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-badge" data-reveal>
          <span className="hero-badge-chip">Open source</span>
          <span className="hero-badge-text">Coraza + a local ML judge</span>
        </div>

        <h1 className="hero-title" data-reveal>
          Security that reads <br className="br-wide" />
          between the requests.
        </h1>

        <p className="hero-lede" data-reveal>
          ModIntel pairs Coraza&apos;s rules with a local model that scores intent, clearing false
          positives, catching what signatures miss, and keeping every payload on your infrastructure.
        </p>

        <div className="hero-actions" data-reveal>
          <a className="btn btn-light btn-lg" href={repo} target="_blank" rel="noreferrer">
            Get started
            <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <a className="btn btn-glass btn-lg" href={docs} target="_blank" rel="noreferrer">
            Read the docs
          </a>
        </div>

        <p className="hero-note" data-reveal>
          <span className="hero-note-dot" aria-hidden="true" />
          Self-hosted inference · no DNS changes · no payloads in the cloud
        </p>
      </div>
    </section>
  );
};

export default Hero;
