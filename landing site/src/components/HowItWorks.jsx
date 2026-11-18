import { useState } from 'react';
import './HowItWorks.css';

const repo = 'https://github.com/modintel/modintel';

const steps = [
  {
    title: 'Traffic ingestion',
    desc: 'Coraza intercepts requests at the ingress layer. No DNS changes, no application rewrites.',
  },
  {
    title: 'Parallel analysis',
    desc: 'A copy of each request is scored beside the WAF decision, not after it, so latency stays flat.',
  },
  {
    title: 'Smart decision',
    desc: 'Rule hits that look benign are cleared. Quiet variants that look malicious are flagged for review.',
  },
  {
    title: 'Visual triage',
    desc: 'Every verdict lands with its payload, triggered rules, and confidence score in one dashboard.',
  },
];

const Inspection = () => (
  <div className="inspect" aria-hidden="true">
    <div className="inspect-top">
      <span className="inspect-live"><i />Live inspection</span>
      <span className="inspect-time">12 ms</span>
    </div>

    <div className="inspect-req">
      <b>POST</b>
      <code>/api/checkout</code>
      <span>203.0.113.42</span>
    </div>

    <div className="inspect-cols">
      <div className="inspect-col">
        <div className="inspect-col-head">
          <span className="inspect-ico is-warn">
            <svg viewBox="0 0 24 24"><path d="M12 3 19 6.2v5.3c0 4.2-2.9 7-7 8.3-4.1-1.3-7-4.1-7-8.3V6.2z" /></svg>
          </span>
          Coraza · CRS 4.0
        </div>
        <div className="inspect-kv"><span>Rules fired</span><b>2</b></div>
        <div className="inspect-chips"><span>942100</span><span>942430</span></div>
        <div className="inspect-verdict is-block">Would block</div>
      </div>

      <div className="inspect-col">
        <div className="inspect-col-head">
          <span className="inspect-ico is-good">
            <svg viewBox="0 0 24 24"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" /></svg>
          </span>
          ML judge · v2.4
        </div>
        <div className="inspect-kv"><span>Benign probability</span><b>0.97</b></div>
        <div className="inspect-meter"><i /></div>
        <div className="inspect-verdict is-allow">Allow</div>
      </div>
    </div>

    <div className="inspect-final">
      <svg viewBox="0 0 16 16"><path d="m3 8 3.2 3.2L13 4.6" /></svg>
      Cleared · 2 rule hits judged benign
      <span>analyst not required</span>
    </div>

    <div className="inspect-recent">
      <div><code>/login</code><b>0.27</b><em className="is-review">Review</em></div>
      <div><code>/assets/app.js</code><b>0.01</b><em className="is-allow">Allowed</em></div>
      <div><code>/api/refund</code><b>0.44</b><em className="is-review">Review</em></div>
    </div>
  </div>
);

const HowItWorks = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="how" id="how-it-works">
      <div className="container">
        <div className="how-head">
          <div className="eyebrow">
            <i className="eyebrow-line" />
            <span className="eyebrow-pill">How it works</span>
            <i className="eyebrow-line eyebrow-line-r" />
          </div>
          <h2 className="h2" data-reveal>
            From raw request to <br className="br-wide" />
            a confident verdict.
          </h2>
          <p className="sec-lede" data-reveal>
            One parallel path, no added hops. ModIntel scores traffic alongside Coraza and hands your
            team the context to decide.
          </p>
        </div>

        <div className="how-block">
          <p className="kicker" data-reveal>The intelligent pipeline</p>
          <h3 className="how-title" data-reveal>Coraza detects. The model judges. You decide.</h3>

          <div className="how-grid">
            <div className="how-left" data-reveal>
              <div className="acc">
                {steps.map((step, index) => (
                  <div className={`acc-item${open === index ? ' is-open' : ''}`} key={step.title}>
                    <button
                      type="button"
                      className="acc-btn"
                      aria-expanded={open === index}
                      aria-controls={`pipeline-panel-${index}`}
                      onClick={() => setOpen(open === index ? -1 : index)}
                    >
                      <span className="acc-bullet" aria-hidden="true" />
                      {step.title}
                    </button>
                    <div className="acc-body" id={`pipeline-panel-${index}`}>
                      <div><p>{step.desc}</p></div>
                    </div>
                  </div>
                ))}
              </div>

              <a className="btn btn-orange btn-lg how-cta" href={repo} target="_blank" rel="noreferrer">
                Get started
                <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
              </a>
            </div>

            <div className="how-right" data-reveal>
              <div className="how-frame">
                <Inspection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
