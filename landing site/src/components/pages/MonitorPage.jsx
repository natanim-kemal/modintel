import { useEffect, useState } from 'react';
import './MonitorPage.css';

const RANGE_DATA = {
  '1H': {
    requests: '1,284',
    error: '0.02%',
    latency: { p50: 3.2, p95: 8.4, p99: 14.1 },
    labels: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
    line: 'M0 150 C60 140 90 160 150 130 C210 100 250 120 310 96 C370 72 410 86 470 66 C530 46 570 60 630 44 C690 28 730 40 790 30 C840 22 870 32 900 20',
  },
  '6H': {
    requests: '1,196',
    error: '0.03%',
    latency: { p50: 3.6, p95: 9.1, p99: 15.6 },
    labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    line: 'M0 170 C50 150 80 180 140 150 C200 120 240 140 300 116 C360 92 400 110 460 88 C520 66 560 84 620 70 C680 56 720 74 780 56 C840 38 870 50 900 40',
  },
  '24H': {
    requests: '1,142',
    error: '0.04%',
    latency: { p50: 4.1, p95: 10.3, p99: 17.2 },
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    line: 'M0 120 C60 130 100 96 160 108 C220 120 260 84 320 96 C380 108 420 72 480 84 C540 96 580 60 640 72 C700 84 740 48 800 60 C850 70 875 46 900 54',
  },
  '7D': {
    requests: '1,088',
    error: '0.05%',
    latency: { p50: 4.8, p95: 11.7, p99: 19.4 },
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    line: 'M0 180 C70 170 110 150 180 158 C250 166 290 130 360 140 C430 150 470 112 540 122 C610 132 650 96 720 104 C790 112 840 82 900 90',
  },
};

const SERVICES = [
  { name: 'Caddy', detail: 'edge proxy', status: 'healthy', latency: '2.4 ms', uptime: '99.99%', note: 'TLS 1.3 · 12 active connections · 0 restarts', spark: 'M0 12 L8 11 L16 13 L24 9 L32 10 L40 7 L48 8 L56 5' },
  { name: 'Coraza', detail: 'WAF engine', status: 'healthy', latency: '3.1 ms', uptime: '99.98%', note: 'CRS 4.0 · block mode · 0 rules disabled', spark: 'M0 10 L8 8 L16 12 L24 7 L32 9 L40 6 L48 10 L56 7' },
  { name: 'Judge', detail: 'ML inference', status: 'degraded', latency: '6.8 ms', uptime: '99.91%', note: 'judge v2.4 onnx · 1 replica warming', spark: 'M0 9 L8 7 L16 6 L24 11 L32 5 L40 12 L48 8 L56 13' },
  { name: 'Redis', detail: 'event queue', status: 'healthy', latency: '0.6 ms', uptime: '100%', note: 'queue depth 18 · 0 dropped events', spark: 'M0 11 L8 10 L16 11 L24 9 L32 10 L40 8 L48 9 L56 8' },
];

const EVENTS = [
  { time: '13:02:41', svc: 'Coraza', text: 'rule 942100 blocked request' },
  { time: '13:02:12', svc: 'Judge', text: 'score 0.91 flagged for review' },
  { time: '13:01:48', svc: 'Caddy', text: 'throughput 1.3k req/s' },
  { time: '13:01:20', svc: 'Redis', text: 'queue drained to 18' },
  { time: '13:00:57', svc: 'Coraza', text: 'rule 930110 blocked request' },
  { time: '13:00:33', svc: 'Judge', text: 'verdict allow · 0.04 score' },
  { time: '12:59:58', svc: 'Caddy', text: 'tls handshake ok' },
  { time: '12:59:22', svc: 'Redis', text: 'snapshot committed' },
];

const MonitorPage = () => {
  const [range, setRange] = useState('1H');
  const [selected, setSelected] = useState(null);
  const [live, setLive] = useState(true);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [live]);

  const data = RANGE_DATA[range];
  const chosen = SERVICES.find((service) => service.name === selected);
  const stamp = now.toLocaleTimeString('en-GB', { hour12: false });

  return (
    <div className="px-monitor">
      <header className="px-monitor__head">
        <div className="px-monitor__head-left">
          <div className="px-monitor__titles">
            <span className="px-monitor__eyebrow">Operations</span>
            <h1 className="px-monitor__title">Monitor</h1>
          </div>
          <button
            type="button"
            className={`px-monitor__live${live ? '' : ' is-paused'}`}
            onClick={() => setLive((value) => !value)}
            aria-pressed={live}
            aria-label={live ? 'Pause live updates' : 'Resume live updates'}
          >
            <i className="px-monitor__pulse" />
            {live ? 'Live' : 'Paused'}
          </button>
          <span className="px-monitor__stamp">{stamp}</span>
        </div>
        <div className="px-monitor__head-right">
          <div className="px-monitor__ranges" role="group" aria-label="Time range">
            {['1H', '6H', '24H', '7D'].map((item) => (
              <button
                type="button"
                key={item}
                className={`px-monitor__range${range === item ? ' is-active' : ''}`}
                onClick={() => setRange(item)}
                aria-pressed={range === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="px-monitor__metrics">
        {[
          ['Requests/s', data.requests],
          ['p50 latency', `${data.latency.p50.toFixed(1)} ms`],
          ['p95 latency', `${data.latency.p95.toFixed(1)} ms`],
          ['p99 latency', `${data.latency.p99.toFixed(1)} ms`],
          ['Error rate', data.error],
        ].map(([label, value]) => (
          <div className="px-monitor__metric" key={label}>
            <span className="px-monitor__metric-label">{label}</span>
            <strong className="px-monitor__metric-value">{value}</strong>
          </div>
        ))}
      </div>

      <div className="px-monitor__body">
        <section className="px-monitor__main">
          <div className="px-monitor__panel px-monitor__chart">
            <div className="px-monitor__panel-head">
              <b>Request rate</b>
              <span className="px-monitor__panel-note">req/s · {range}</span>
            </div>
            <div className="px-monitor__chart-wrap">
              <svg viewBox="0 0 900 220" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="px-monitor-rate-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ff570a" stopOpacity=".24" />
                    <stop offset="1" stopColor="#ff570a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="px-monitor__grid">
                  <line x1="0" y1="44" x2="900" y2="44" />
                  <line x1="0" y1="88" x2="900" y2="88" />
                  <line x1="0" y1="132" x2="900" y2="132" />
                  <line x1="0" y1="176" x2="900" y2="176" />
                </g>
                <path d={`${data.line} L900 220 L0 220 Z`} fill="url(#px-monitor-rate-fill)" />
                <path className="px-monitor__rate-line" d={data.line} />
              </svg>
              <div className="px-monitor__chart-x">
                {data.labels.map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>
          </div>

          <div className="px-monitor__panel px-monitor__services">
            <div className="px-monitor__panel-head">
              <b>Service health</b>
              <span className="px-monitor__panel-note">4 services</span>
            </div>
            <div className="px-monitor__svc-table">
              <div className="px-monitor__svc-row px-monitor__svc-row--head">
                <span />
                <span>Service</span>
                <span>Latency</span>
                <span>Uptime</span>
                <span>Trend</span>
              </div>
              {SERVICES.map((service) => (
                <button
                  type="button"
                  key={service.name}
                  className={`px-monitor__svc-row${selected === service.name ? ' is-selected' : ''}`}
                  onClick={() => setSelected(service.name)}
                  aria-pressed={selected === service.name}
                  aria-label={`Select ${service.name}`}
                >
                  <i className={`px-monitor__status px-monitor__status--${service.status}`} />
                  <span className="px-monitor__svc-name">{service.name}<em>{service.detail}</em></span>
                  <span className="px-monitor__svc-val">{service.latency}</span>
                  <span className="px-monitor__svc-val">{service.uptime}</span>
                  <svg className={`px-monitor__spark px-monitor__spark--${service.status}`} viewBox="0 0 56 16" aria-hidden="true">
                    <path d={service.spark} fill="none" strokeWidth="1.6" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="px-monitor__svc-detail">
              {chosen ? (
                <><span className="px-monitor__detail-name">{chosen.name}</span><span>{chosen.note}</span></>
              ) : (
                <span className="px-monitor__detail-empty">Select a service to inspect its detail</span>
              )}
            </div>
          </div>
        </section>

        <aside className="px-monitor__side">
          <div className="px-monitor__panel px-monitor__latency">
            <div className="px-monitor__panel-head">
              <b>Latency distribution</b>
              <span className="px-monitor__panel-note">ms</span>
            </div>
            <div className="px-monitor__latency-bars">
              {[
                ['p50', data.latency.p50],
                ['p95', data.latency.p95],
                ['p99', data.latency.p99],
              ].map(([label, value]) => (
                <div className="px-monitor__latency-row" key={label}>
                  <span className="px-monitor__latency-label">{label}</span>
                  <div className="px-monitor__latency-track">
                    <i style={{ width: `${Math.round((value / 20) * 100)}%` }} />
                  </div>
                  <span className="px-monitor__latency-value">{value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-monitor__panel px-monitor__events">
            <div className="px-monitor__panel-head">
              <b>Event log</b>
              <span className="px-monitor__panel-note">most recent</span>
            </div>
            <div className="px-monitor__event-list">
              {EVENTS.map((event, index) => (
                <div className={`px-monitor__event${index === 0 ? ' is-latest' : ''}`} key={event.time}>
                  <span className="px-monitor__event-time">{event.time}</span>
                  <span className="px-monitor__event-svc">{event.svc}</span>
                  <span className="px-monitor__event-text">{event.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MonitorPage;
