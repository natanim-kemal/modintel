import './Features.css';

const cards = [
  {
    title: 'Context, not just patterns',
    body: 'A model trained on WAF audit data scores intent. Benign anomalies get cleared; novel variants still reach a reviewer.',
    art: 'score',
  },
  {
    title: 'Private by default',
    body: 'Inference runs beside your app. Payloads, headers, and scores stay on your infrastructure. No cloud round trip.',
    art: 'local',
  },
  {
    title: 'Triage that explains itself',
    body: 'Every alert arrives with the payload, the rules that fired, and the model’s confidence, so deciding takes seconds.',
    art: 'triage',
  },
];

const Art = ({ type }) => {
  if (type === 'score') {
    return (
      <div className="art art-score">
        <div className="art-score-back" />
        <div className="art-score-card">
          <div className="art-row">
            <span>Request score</span>
            <b className="art-mono">v2.4</b>
          </div>
          <div className="art-score-val">0.03<span>benign</span></div>
          <div className="art-meter"><i /></div>
          <div className="art-chips">
            <span className="chip-rule">942100</span>
            <span className="art-strike">SQL injection</span>
          </div>
          <div className="art-cleared">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.6" /></svg>
            Cleared by model · 7 ms
          </div>
        </div>
      </div>
    );
  }

  if (type === 'local') {
    return (
      <div className="art art-local">
        <div className="art-local-card">
          <div className="art-row">
            <span className="art-lock">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="10.5" width="14" height="10" rx="2" />
                <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
              </svg>
            </span>
            <span>Local inference</span>
            <b className="art-on"><i />on</b>
          </div>
          <div className="art-rack">
            <span><i /><i /><b /></span>
            <span><i /><i /><b /></span>
            <span><i /><i /><b /></span>
          </div>
          <div className="art-endpoint art-mono">127.0.0.1:8091 · grpc</div>
        </div>
      </div>
    );
  }

  return (
    <div className="art art-triage">
      <div className="art-alert">
        <div className="art-row">
          <span className="art-mono">#4821</span>
          <span className="art-review">Review</span>
        </div>
        <code className="art-payload">GET /search?q=%27+OR+1%3D1--</code>
        <div className="art-alert-meta">
          <span className="chip-rule">942100</span>
          <span className="chip-rule">942430</span>
          <b>score 0.27</b>
        </div>
        <div className="art-actions"><span>Allow</span><b>Block</b></div>
      </div>
    </div>
  );
};

const Features = () => (
  <section className="features" id="features">
    <div className="container">
      <div className="features-head">
        <div className="eyebrow">
          <i className="eyebrow-line" />
          <span className="eyebrow-pill">Why ModIntel</span>
          <i className="eyebrow-line eyebrow-line-r" />
        </div>
        <h2 className="h2" data-reveal>
          Everything you need to trust <br className="br-wide" />
          every verdict.
        </h2>
        <p className="sec-lede" data-reveal>
          A verdict you can’t explain is just a guess. ModIntel shows the rule, the score, and the
          payload behind every decision.
        </p>
      </div>

      <div className="features-grid">
        {cards.map((card) => (
          <article className="feature-card" key={card.title} data-reveal>
            <div className="feature-art">
              <span className="feature-dots halftone" aria-hidden="true" />
              <Art type={card.art} />
            </div>
            <div className="feature-copy">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
