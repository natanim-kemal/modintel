import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './Console.css';
import RulesPage from './pages/RulesPage';
import TrainingPage from './pages/TrainingPage';
import DatasetsPage from './pages/DatasetsPage';
import ReportsPage from './pages/ReportsPage';
import MonitorPage from './pages/MonitorPage';
import SettingsPage from './pages/SettingsPage';

const Mark = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const icons = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'm4 12 5 5L20 6',
  x: 'M6 6l12 12M18 6 6 18',
  chevron: 'M6 9l6 6 6-6',
  arrow: 'M7 17 17 7M9 7h8v8',
  download: 'M12 4v10m0 0 4-4m-4 4-4-4M5 19h14',
  play: 'M7 4l12 8-12 8z',
  cursor: 'M5 3l14 8-6 1.5L10 19z',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
};

const Icon = ({ name, className = 'c-ico' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d={icons[name]} />
  </svg>
);

const NAV = [
  { id: 'events', label: 'Events' },
  { id: 'rules', label: 'Rules' },
  { id: 'training', label: 'Training' },
  { id: 'datasets', label: 'Datasets' },
  { id: 'reports', label: 'Reports' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'settings', label: 'Settings' },
];

const RULE_NAMES = {
  942100: 'SQL injection',
  942430: 'Restricted SQL characters',
  920350: 'Numeric host header',
  913100: 'User-agent bypass',
  930110: 'Path traversal',
  949110: 'Anomaly score exceeded',
  941100: 'XSS attack',
  930130: 'Restricted file access',
};

const EVENTS = [
  { id: 'A-92431', time: '12:41:08', ip: '198.51.100.7', uri: '/search?q=%27+OR+1%3D1--', score: 32, rules: [942100, 942430], ai: 96, conf: 94, pri: 'P1', method: 'GET', source: 'Layer 1' },
  { id: 'A-92430', time: '12:40:54', ip: '203.0.113.42', uri: '/api/checkout', score: 5, rules: [942100], ai: 3, conf: 98, pri: 'P3', method: 'POST', source: 'Layer 1' },
  { id: 'A-92429', time: '12:40:41', ip: '192.0.2.18', uri: '/login', score: 8, rules: [920350], ai: 27, conf: 91, pri: 'P2', method: 'POST', source: 'Layer 1' },
  { id: 'A-92428', time: '12:40:22', ip: '198.51.100.61', uri: '/api/refund', score: 12, rules: [942430], ai: 44, conf: 88, pri: 'P2', method: 'POST', source: 'Layer 1' },
  { id: 'A-92427', time: '12:40:03', ip: '203.0.113.9', uri: '/assets/app.js', score: 0, rules: [], ai: 1, conf: 99, pri: 'P3', method: 'GET', source: 'Layer 1' },
  { id: 'A-92426', time: '12:39:47', ip: '198.51.100.22', uri: '/../../etc/passwd', score: 24, rules: [930110, 949110], ai: 92, conf: 96, pri: 'P1', method: 'GET', source: 'Layer 1' },
  { id: 'A-92425', time: '12:39:12', ip: '203.0.113.77', uri: '/api/users?id=8+UNION+SELECT', score: 28, rules: [942100], ai: 89, conf: 93, pri: 'P1', method: 'GET', source: 'Layer 2' },
  { id: 'A-92424', time: '12:38:56', ip: '192.0.2.90', uri: '/wp-login.php', score: 3, rules: [913100], ai: 36, conf: 84, pri: 'P2', method: 'POST', source: 'Layer 1' },
  { id: 'A-92423', time: '12:38:31', ip: '203.0.113.5', uri: '/api/orders/1042', score: 0, rules: [], ai: 2, conf: 97, pri: 'P3', method: 'GET', source: 'Layer 1' },
  { id: 'A-92422', time: '12:38:02', ip: '198.51.100.44', uri: '/contact?message=%3Cscript%3E', score: 21, rules: [941100], ai: 84, conf: 92, pri: 'P1', method: 'POST', source: 'Layer 2' },
  { id: 'A-92421', time: '12:37:44', ip: '192.0.2.31', uri: '/.env', score: 18, rules: [930130], ai: 78, conf: 90, pri: 'P2', method: 'GET', source: 'Layer 1' },
  { id: 'A-92420', time: '12:37:20', ip: '203.0.113.66', uri: '/api/session/refresh', score: 1, rules: [], ai: 4, conf: 96, pri: 'P3', method: 'POST', source: 'Layer 1' },
  { id: 'A-92419', time: '12:36:58', ip: '192.0.2.140', uri: '/admin/config.php', score: 26, rules: [930130, 949110], ai: 91, conf: 95, pri: 'P1', method: 'GET', source: 'Layer 1' },
  { id: 'A-92418', time: '12:36:31', ip: '198.51.100.19', uri: '/api/orders?sort=price%3B--', score: 22, rules: [942430], ai: 81, conf: 89, pri: 'P2', method: 'GET', source: 'Layer 2' },
  { id: 'A-92417', time: '12:36:02', ip: '203.0.113.101', uri: '/health', score: 0, rules: [], ai: 0, conf: 99, pri: 'P3', method: 'GET', source: 'Layer 1' },
  { id: 'A-92416', time: '12:35:44', ip: '192.0.2.55', uri: '/api/login?user=admin%27', score: 19, rules: [942100], ai: 67, conf: 87, pri: 'P2', method: 'POST', source: 'Layer 1' },
  { id: 'A-92415', time: '12:35:19', ip: '198.51.100.83', uri: '/products?cat=1%20AND%201%3D1', score: 30, rules: [942100, 949110], ai: 94, conf: 97, pri: 'P1', method: 'GET', source: 'Layer 1' },
  { id: 'A-92414', time: '12:34:57', ip: '203.0.113.12', uri: '/api/cart', score: 0, rules: [], ai: 2, conf: 98, pri: 'P3', method: 'POST', source: 'Layer 1' },
  { id: 'A-92413', time: '12:34:33', ip: '192.0.2.201', uri: '/static/js/chunk.91f2.js', score: 0, rules: [], ai: 1, conf: 99, pri: 'P3', method: 'GET', source: 'Layer 1' },
  { id: 'A-92412', time: '12:34:08', ip: '198.51.100.36', uri: '/api/profile?bio=%3Cimg+src%3Dx%3E', score: 23, rules: [941100], ai: 86, conf: 91, pri: 'P1', method: 'PUT', source: 'Layer 2' },
];

const TRENDS = {
  Day: {
    line: 'M0 78 C24 70 40 74 64 66 C88 58 104 62 128 52 C152 42 168 50 192 44 C216 38 232 46 256 36 C280 26 296 30 320 22 C336 17 344 14 352 12',
    area: 'M0 78 C24 70 40 74 64 66 C88 58 104 62 128 52 C152 42 168 50 192 44 C216 38 232 46 256 36 C280 26 296 30 320 22 C336 17 344 14 352 12 L352 96 L0 96 Z',
    labels: ['00', '04', '08', '12', '16', '20', '24'],
  },
  Week: {
    line: 'M0 62 C24 58 40 68 64 60 C88 52 104 44 128 48 C152 52 168 38 192 32 C216 26 232 36 256 30 C280 24 296 34 320 26 C336 21 344 18 352 16',
    area: 'M0 62 C24 58 40 68 64 60 C88 52 104 44 128 48 C152 52 168 38 192 32 C216 26 232 36 256 30 C280 24 296 34 320 26 C336 21 344 18 352 16 L352 96 L0 96 Z',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  Month: {
    line: 'M0 84 C24 80 40 68 64 70 C88 72 104 56 128 58 C152 60 168 46 192 42 C216 38 232 48 256 40 C280 32 296 24 320 28 C336 31 344 20 352 18',
    area: 'M0 84 C24 80 40 68 64 70 C88 72 104 56 128 58 C152 60 168 46 192 42 C216 38 232 48 256 40 C280 32 296 24 320 28 C336 31 344 20 352 18 L352 96 L0 96 Z',
    labels: ['W1', 'W2', 'W3', 'W4'],
  },
};

const QUEUE = [
  { id: 'Q-501', time: '12:39:12', method: 'GET', uri: '/api/users?id=8+UNION+SELECT', ai: 89, conf: 93, pri: 'P1', source: 'Layer 1' },
  { id: 'Q-500', time: '12:36:48', method: 'POST', uri: '/contact?message=%3Cscript%3E', ai: 84, conf: 92, pri: 'P1', source: 'Layer 2' },
  { id: 'Q-499', time: '12:34:03', method: 'GET', uri: '/../../etc/passwd', ai: 92, conf: 96, pri: 'P1', source: 'Layer 1' },
  { id: 'Q-498', time: '12:31:26', method: 'POST', uri: '/api/refund', ai: 44, conf: 88, pri: 'P2', source: 'Layer 1' },
  { id: 'Q-497', time: '12:28:57', method: 'POST', uri: '/wp-login.php', ai: 36, conf: 84, pri: 'P2', source: 'Layer 2' },
];

const RULES = [
  { id: 942100, name: 'SQL Injection Attack Detected', cat: 'Injection', sev: 'Critical', hits: 1284, on: true },
  { id: 942430, name: 'Restricted SQL Character Anomaly', cat: 'Injection', sev: 'Critical', hits: 962, on: true },
  { id: 930110, name: 'Path Traversal Attack', cat: 'File', sev: 'Critical', hits: 418, on: true },
  { id: 941100, name: 'XSS Attack Detected', cat: 'Scripting', sev: 'High', hits: 377, on: true },
  { id: 920350, name: 'Host Header is a Numeric IP', cat: 'Protocol', sev: 'Medium', hits: 254, on: true },
  { id: 913100, name: 'User-Agent Security Bypass', cat: 'Scanner', sev: 'Medium', hits: 188, on: true },
  { id: 949110, name: 'Inbound Anomaly Score Exceeded', cat: 'Generic', sev: 'Critical', hits: 1641, on: true },
  { id: 930130, name: 'Restricted File Access Attempt', cat: 'File', sev: 'High', hits: 96, on: false },
];

const RUNS = [
  { id: 'v2.4', when: '12 min ago', acc: '98.4%', auc: '0.994', state: 'Deployed' },
  { id: 'v2.3', when: '3 days ago', acc: '97.9%', auc: '0.991', state: 'Archived' },
  { id: 'v2.2', when: '9 days ago', acc: '97.1%', auc: '0.987', state: 'Archived' },
  { id: 'v2.1', when: '18 days ago', acc: '96.4%', auc: '0.981', state: 'Archived' },
];

const IMPORTANCE = [
  { label: 'URI length', value: 92 },
  { label: 'Query entropy', value: 84 },
  { label: 'Special char ratio', value: 76 },
  { label: 'Method', value: 58 },
  { label: 'Header anomalies', value: 42 },
];

const DATASETS = [
  { name: 'balanced_5k_5k.parquet', rows: '10,000', attacks: '50%', size: '4.2 MB', state: 'Training' },
  { name: 'waf_dataset_v3.parquet', rows: '128,400', attacks: '47%', size: '38.6 MB', state: 'Training' },
  { name: 'reviewed_export_2026.parquet', rows: '1,248', attacks: '61%', size: '1.1 MB', state: 'Reviewed' },
  { name: 'val_distill.jsonl', rows: '6,000', attacks: '48%', size: '2.8 MB', state: 'Validation' },
  { name: 'train_100k_100k.parquet', rows: '200,000', attacks: '50%', size: '61.3 MB', state: 'Archived' },
];

const REPORTS = [
  { id: 'v1', name: 'model_evaluation_v1', acc: 91.2, recall: 88.4, fpr: 3.1 },
  { id: 'v2', name: 'model_evaluation_v2', acc: 96.7, recall: 95.1, fpr: 1.6 },
  { id: 'v3', name: 'model_evaluation_v3', acc: 98.4, recall: 96.8, fpr: 0.8 },
];

const SERVICES = [
  { name: 'proxy-waf', detail: 'Caddy + Coraza', latency: '3.2 ms', up: '99.99%' },
  { name: 'inference-engine', detail: 'ML inference', latency: '2.1 ms', up: '99.98%' },
  { name: 'log-collector', detail: 'Log processor', latency: '1.4 ms', up: '100%' },
  { name: 'review-api', detail: 'API server', latency: '4.8 ms', up: '99.97%' },
  { name: 'auth-service', detail: 'Auth service', latency: '2.9 ms', up: '99.99%' },
];

const METRICS = {
  '1H': { latency: '8.4 ms', rpm: '1,284', rate: '0.02%' },
  '6H': { latency: '8.9 ms', rpm: '1,196', rate: '0.03%' },
  '24H': { latency: '9.3 ms', rpm: '1,142', rate: '0.04%' },
  '7D': { latency: '10.1 ms', rpm: '1,088', rate: '0.05%' },
};

const SETTINGS = [
  {
    title: 'Detection',
    rows: [
      { key: 'block', label: 'Block mode', hint: 'Weapons out when Coraza and the model agree', on: true },
      { key: 'clear', label: 'Auto-clear benign rule hits', hint: 'Clear without analyst review above 90% confidence', on: true },
      { key: 'miss', label: 'Layer 2 miss detector', hint: 'Score requests that trip no rule at all', on: true },
    ],
  },
  {
    title: 'Data',
    rows: [
      { key: 'payload', label: 'Store request payloads', hint: 'Retained for review and model training', on: false },
      { key: 'retention', label: 'Audit log retention', hint: '30 days on this instance', on: true },
    ],
  },
  {
    title: 'Notifications',
    rows: [
      { key: 'email', label: 'Email on P1 alerts', hint: 'security@modintel.dev', on: true },
      { key: 'slack', label: 'Slack integration', hint: 'Not configured', on: false },
    ],
  },
];

const Stat = ({ label, value, tone }) => (
  <div className="cv-stat">
    <span>{label}</span>
    <strong className={tone ? `is-${tone}` : ''}>{value}</strong>
  </div>
);

const SideHead = ({ eyebrow, title, desc, children }) => (
  <div className="cv-hero">
    <p className="cv-eyebrow">{eyebrow}</p>
    <p className="cv-title">{title}</p>
    <p className="cv-desc">{desc}</p>
    {children}
  </div>
);

const Pri = ({ level }) => <span className={`c-pri is-${level.toLowerCase()}`}>{level}</span>;

const Toggle = ({ on, onClick, label }) => (
  <button type="button" className={`c-toggle${on ? ' is-on' : ''}`} onClick={onClick} aria-pressed={on} aria-label={label}>
    <i />
  </button>
);

const EventsView = ({ live, setLive, query, setQuery, priorities, togglePriority, onSelect, trend, setTrend }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const rows = EVENTS.filter((event) => {
    if (!priorities.includes(event.pri)) return false;
    if (!query.trim()) return true;
    const haystack = `${event.ip} ${event.uri} ${event.rules.join(' ')} ${event.method}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  return (
    <div className="cv cv-events">
      <aside className="cv-side">
        <SideHead
          eyebrow="Intelligence"
          title={<>Hybrid WAF<br />Detection Stream</>}
          desc="Real time threat monitoring and ML driven alert scoring for the ModIntel engine. Monitor Caddy and Coraza audit logs."
        >
          <button type="button" className={`c-conn${live ? '' : ' is-paused'}`} onClick={() => setLive(!live)}>
            <i />{live ? 'Connected · SSE' : 'Stream paused'}
          </button>
        </SideHead>

        <div className="cv-stats">
          <Stat label="Total alerts" value="12,482" />
          <Stat label="Layer 1 (Coraza + AI)" value="8,914" />
          <Stat label="Latest priority" value="P1" tone="danger" />
          <Stat label="Layer 2 (misses)" value="218" />
        </div>

        <div className="cv-rules-mini">
          <div className="cv-rules-mini-head">
            <b>Top triggered rules</b>
            <span>24h</span>
          </div>
          {RULES.slice(0, 6).map((rule) => (
            <div className="cv-rules-mini-row" key={rule.id}>
              <span className="c-mono">{rule.id}</span>
              <span>{rule.name}</span>
              <em>{rule.hits.toLocaleString()}</em>
            </div>
          ))}
        </div>

        <div className="c-trend">
          <div className="c-panel-head">
            <b>Attack trend</b>
            <div className="c-seg">
              {['Day', 'Week', 'Month'].map((item) => (
                <button type="button" key={item} className={trend === item ? 'is-on' : ''} onClick={() => setTrend(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="c-chart">
            <svg viewBox="0 0 352 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ff570a" stopOpacity=".24" />
                  <stop offset="1" stopColor="#ff570a" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="c-gridlines">
                <line x1="0" y1="24" x2="352" y2="24" />
                <line x1="0" y1="48" x2="352" y2="48" />
                <line x1="0" y1="72" x2="352" y2="72" />
                <line x1="0" y1="96" x2="352" y2="96" />
              </g>
              <path d={TRENDS[trend].area} fill="url(#trendFill)" />
              <path d={TRENDS[trend].line} fill="none" stroke="#ff570a" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div className="c-chart-x">
              {TRENDS[trend].labels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>
      </aside>

      <section className="c-main">
        <div className="c-main-head">
          <div className="c-head-left">
            <b className="c-overline">Real time detection stream</b>
            <div className="c-seg">
              <button type="button" className="is-on">All alerts</button>
              <button type="button">Layer 2</button>
            </div>
          </div>
          <div className="c-head-right">
            <div className={`c-search${searchOpen ? ' is-open' : ''}`}>
              <button type="button" className="c-search-btn" onClick={openSearch} aria-label="Search alerts">
                <Icon name="search" className="c-ico c-ico-xs" />
              </button>
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => { if (!query) setSearchOpen(false); }}
                placeholder="Search logs..."
                aria-label="Search alerts"
              />
            </div>
            <div className="c-pri-filter">
              {['P1', 'P2', 'P3'].map((level) => (
                <button
                  type="button"
                  key={level}
                  className={`c-pri-btn is-${level.toLowerCase()}${priorities.includes(level) ? ' is-on' : ''}`}
                  onClick={() => togglePriority(level)}
                  aria-pressed={priorities.includes(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="c-table-wrap">
          <div className="c-table c-events-table">
            <div className="c-tr is-head">
              <span>Timestamp</span><span>Client IP</span><span>URI</span><span>Score</span>
              <span>Triggered rules</span><span>AI prob</span><span>Conf</span><span>Priority</span>
            </div>
            {rows.map((event) => (
              <button type="button" className="c-tr" key={event.id} onClick={() => onSelect(event)}>
                <span className="c-mono c-dim">{event.time}</span>
                <span className="c-mono">{event.ip}</span>
                <span className="c-uri" title={event.uri}>{event.uri}</span>
                <span className={`c-score${event.score >= 20 ? ' is-high' : ''}`}>{event.score}</span>
                <span className="c-rules-cell">
                  {event.rules.length ? event.rules.map((rule) => <i key={rule}>{rule}</i>) : <em>none</em>}
                </span>
                <span className={`c-prob${event.ai >= 70 ? ' is-high' : ''}`}>{event.ai}%</span>
                <span className="c-dim">{event.conf}%</span>
                <Pri level={event.pri} />
              </button>
            ))}
            {!rows.length && <p className="c-empty">No events match this filter.</p>}
          </div>
          <div className="c-foot-note">
            <span><i className="c-dot is-green" />Streaming from Caddy to Coraza to the judge</span>
            <span>UTC · last sync just now</span>
          </div>
        </div>
      </section>
    </div>
  );
};

const ReviewView = ({ queue, review, resolve }) => (
  <div className="cv">
    <aside className="cv-side">
      <SideHead eyebrow="Analysis" title="Alert Review" desc="Review AI labeled alerts and provide ground truth labels." />
      <div className="cv-stats">
        <Stat label="Reviewed" value={review.reviewed.toLocaleString()} />
        <Stat label="Pending" value={queue.length} tone="warn" />
        <Stat label="True positives" value={review.tp.toLocaleString()} />
        <Stat label="False positives" value={review.fp.toLocaleString()} />
      </div>
      <div className="c-panel">
        <div className="c-panel-head"><b>Quick filters</b><span className="c-chip">Pending</span></div>
        <div className="c-filter-row">
          <button type="button" className="c-chip-btn is-on">Pending</button>
          <button type="button" className="c-chip-btn">Reviewed</button>
          <button type="button" className="c-chip-btn">All</button>
        </div>
        <div className="c-filter-row">
          {['P1', 'P2', 'P3'].map((level) => <button type="button" key={level} className={`c-chip-btn is-${level.toLowerCase()}`}>{level}</button>)}
        </div>
        <div className="c-filter-row">
          <button type="button" className="c-chip-btn is-on">Layer 1</button>
          <button type="button" className="c-chip-btn">Layer 2</button>
        </div>
      </div>
      <p className="c-note">Every label feeds the next training run. Confirming an attack becomes a positive sample; marking one benign becomes a negative.</p>
    </aside>

    <section className="c-main">
      <div className="c-main-head">
        <div className="c-head-row">
          <b className="c-overline">Review queue</b>
          <div className="c-head-right">
            <span className="c-count-note">{queue.length} pending</span>
            <button type="button" className="c-btn is-ghost">Export</button>
          </div>
        </div>
      </div>
      <div className="c-queue">
        {queue.map((item) => (
          <div className="c-qcard" key={item.id}>
            <div className="c-qcard-top">
              <span className="c-mono c-dim">{item.time}</span>
              <b className={`c-method is-${item.method.toLowerCase()}`}>{item.method}</b>
              <span className="c-uri">{item.uri}</span>
              <Pri level={item.pri} />
            </div>
            <div className="c-qcard-bot">
              <span className="c-ai"><span className="c-ai-track"><i style={{ width: `${item.ai}%` }} /></span>AI {item.ai}%</span>
              <span className="c-dim">confidence {item.conf}%</span>
              <span className="c-chip">{item.source}</span>
              <div className="c-qactions">
                <button type="button" onClick={() => resolve(item, 'benign')}>Mark benign</button>
                <button type="button" className="is-dark" onClick={() => resolve(item, 'attack')}>Confirm attack</button>
              </div>
            </div>
          </div>
        ))}
        {!queue.length && (
          <div className="c-empty-state">
            <span className="c-empty-icon"><Icon name="check" /></span>
            <b>Queue clear</b>
            <p>Every pending alert has been labeled. New alerts arrive from the live stream.</p>
          </div>
        )}
        <div className="c-exports">
          <b>Recent exports</b>
          {['reviewed_export_2026.parquet', 'ground_truth_v3.parquet', 'benign_sample_5k.parquet'].map((name) => (
            <div key={name}><span className="c-mono">{name}</span><em>ready</em></div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const RulesView = ({ ruleState, toggleRule, mode, setMode }) => (
  <div className="cv">
    <aside className="cv-side">
      <SideHead eyebrow="Policy" title="Rule Intelligence" desc="Active signatures currently enforced by the ModIntel engine." />
      <div className="c-seg c-seg-wide">
        {['Write', 'Edit'].map((item) => (
          <button type="button" key={item} className={mode === item ? 'is-on' : ''} onClick={() => setMode(item)}>{item}</button>
        ))}
      </div>
      <div className="c-panel">
        <div className="c-panel-head"><b>Write custom rule</b><span className="c-chip">Read only</span></div>
        <div className="c-field"><label>Rule ID</label><span className="c-mono">990100</span></div>
        <div className="c-field"><label>Category</label><span>{mode === 'Write' ? 'SQL Injection' : 'Path Traversal'}</span></div>
        <div className="c-field"><label>Severity</label><span className="c-chip is-warn">{mode === 'Write' ? 'Critical' : 'High'}</span></div>
        <p className="c-field-note">This instance is read only. Point MODINTEL_RULE_SYNC at a writable volume to edit signatures.</p>
      </div>
      <p className="c-note">Rules stay in Coraza. ModIntel only adds a second opinion on top of the verdict they produce.</p>
    </aside>

    <section className="c-main">
      <div className="c-main-head">
        <div className="c-head-row">
          <b className="c-overline">Active signatures</b>
          <div className="c-head-right">
            <span className="c-count-note">{ruleState.filter((rule) => rule.on).length} of {ruleState.length} enabled</span>
            <button type="button" className="c-btn">New rule</button>
          </div>
        </div>
      </div>
      <div className="c-list">
        {ruleState.map((rule) => (
          <div className={`c-rule-row${rule.on ? '' : ' is-off'}`} key={rule.id}>
            <span className="c-rule-id">{rule.id}</span>
            <span className="c-rule-name">{rule.name}<em>{rule.cat} · {rule.sev}</em></span>
            <span className="c-rule-hits">{rule.hits.toLocaleString()}<em>hits</em></span>
            <Toggle on={rule.on} onClick={() => toggleRule(rule.id)} label={`${rule.on ? 'Disable' : 'Enable'} rule ${rule.id}`} />
          </div>
        ))}
      </div>
      <div className="c-foot-note"><span>CRS 4.0 · synced 4 minutes ago</span><span>942100 is the top offender this week</span></div>
    </section>
  </div>
);

const TrainingView = ({ trainState, startTraining, runs }) => (
  <div className="cv">
    <aside className="cv-side">
      <SideHead eyebrow="Model" title="Training Runs" desc="Retrain the judge on reviewed traffic without leaving the dashboard." />
      <div className="cv-stats">
        <Stat label="Accuracy" value="98.4%" />
        <Stat label="Precision" value="97.1%" />
        <Stat label="Recall" value="96.8%" />
        <Stat label="AUC" value="0.994" />
      </div>
      <div className="c-panel">
        <div className="c-panel-head"><b>Next run</b><span className={`c-chip${trainState === 'running' ? ' is-warn' : trainState === 'done' ? ' is-good' : ''}`}>{trainState === 'idle' ? 'Ready' : trainState === 'running' ? 'Training' : 'Complete'}</span></div>
        <div className={`c-progress is-${trainState}`}><i /></div>
        <p className="c-under-note">{trainState === 'done' ? 'v2.5 finished · 98.6% validation accuracy' : 'balanced_5k_5k.parquet · 10,000 samples'}</p>
        <button type="button" className="c-btn is-dark c-btn-block" onClick={startTraining} disabled={trainState === 'running'}>
          {trainState === 'running' ? 'Training...' : trainState === 'done' ? 'Run complete' : 'Start training'}
        </button>
      </div>
      <p className="c-note">The judge runs locally. Training reads labeled parquet files and never uploads a payload.</p>
    </aside>

    <section className="c-main">
      <div className="c-main-head">
        <div className="c-head-row">
          <b className="c-overline">Run history</b>
          <span className="c-count-note">4 versions</span>
        </div>
      </div>
      <div className="c-list">
        {runs.map((run) => (
          <div className="c-run-row" key={`${run.id}-${run.when}`}>
            <span className="c-run-id">{run.id}</span>
            <span className="c-run-when">{run.when}</span>
            <span className="c-run-metric">{run.acc}<em>accuracy</em></span>
            <span className="c-run-metric">{run.auc}<em>AUC</em></span>
            <span className={`c-chip${run.state === 'Deployed' ? ' is-good' : ''}`}>{run.state}</span>
          </div>
        ))}
      </div>
      <div className="c-subpanel">
        <div className="c-panel-head"><b>Feature importance</b><span className="c-chip">v2.4</span></div>
        {IMPORTANCE.map((item) => (
          <div className="c-imp" key={item.label}>
            <span>{item.label}</span>
            <div className="c-imp-bar"><i style={{ width: `${item.value}%` }} /></div>
            <b>{(item.value / 100).toFixed(2)}</b>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const DatasetsView = ({ active, setActive }) => (
  <div className="cv">
    <aside className="cv-side">
      <SideHead eyebrow="Data" title="Datasets" desc="Curated traffic used for training, validation, and replay." />
      <div className="cv-stats">
        <Stat label="Files" value="6" />
        <Stat label="Rows" value="250k" />
        <Stat label="Attack ratio" value="48%" />
        <Stat label="Reviewed" value="1,248" />
      </div>
      <div className="c-panel">
        <div className="c-panel-head"><b>Selected</b><span className="c-chip is-good">Ready</span></div>
        <p className="c-mono c-selected">{active.name}</p>
        <div className="c-field"><label>Rows</label><span>{active.rows}</span></div>
        <div className="c-field"><label>Size</label><span>{active.size}</span></div>
        <div className="c-field"><label>Usage</label><span>{active.state}</span></div>
        <button type="button" className="c-btn c-btn-block">Export reviewed slice</button>
      </div>
    </aside>

    <section className="c-main">
      <div className="c-main-head">
        <div className="c-head-row">
          <b className="c-overline">Dataset inventory</b>
          <span className="c-count-note">parquet + jsonl</span>
        </div>
      </div>
      <div className="c-list">
        {DATASETS.map((item) => (
          <button
            type="button"
            key={item.name}
            className={`c-data-row${active.name === item.name ? ' is-active' : ''}`}
            onClick={() => setActive(item)}
          >
            <span className="c-data-icon"><Icon name="grid" /></span>
            <span className="c-data-name">{item.name}<em>{item.size}</em></span>
            <span className="c-data-val">{item.rows}<em>rows</em></span>
            <span className="c-data-val">{item.attacks}<em>attacks</em></span>
            <span className="c-chip">{item.state}</span>
          </button>
        ))}
      </div>
      <div className="c-foot-note"><span>Stored on this instance</span><span>No payloads leave the network</span></div>
    </section>
  </div>
);

const ReportsView = ({ active, setActive }) => {
  const current = REPORTS.find((report) => report.id === active) || REPORTS[2];
  return (
    <div className="cv">
      <aside className="cv-side">
        <SideHead eyebrow="Evaluation" title="Model Reports" desc="Held out evaluation for every judge version we shipped." />
        <div className="cv-stats">
          <Stat label="Accuracy" value={`${current.acc}%`} />
          <Stat label="Recall" value={`${current.recall}%`} />
          <Stat label="False positive" value={`${current.fpr}%`} tone="good" />
          <Stat label="Test rows" value="21k" />
        </div>
        <div className="c-panel">
          <div className="c-panel-head"><b>Confusion matrix</b><span className="c-chip">{current.name}</span></div>
          <div className="c-matrix">
            <span className="c-matrix-cell is-good"><b>10,164</b><em>true positive</em></span>
            <span className="c-matrix-cell is-bad"><b>84</b><em>false positive</em></span>
            <span className="c-matrix-cell is-bad"><b>336</b><em>false negative</em></span>
            <span className="c-matrix-cell is-good"><b>10,416</b><em>true negative</em></span>
          </div>
        </div>
        <button type="button" className="c-btn c-btn-block"><Icon name="download" className="c-ico c-ico-xs" />Download v3 report</button>
      </aside>

      <section className="c-main">
        <div className="c-main-head">
          <div className="c-head-row">
            <b className="c-overline">Evaluation runs</b>
            <span className="c-count-note">HTML reports</span>
          </div>
        </div>
        <div className="c-report-list">
          {REPORTS.map((report) => (
            <button
              type="button"
              key={report.id}
              className={`c-report${active === report.id ? ' is-active' : ''}`}
              onClick={() => setActive(report.id)}
            >
              <div className="c-report-top">
                <span className="c-report-name">{report.name}<em>21,000 requests · open report</em></span>
                <span className={`c-chip${report.id === 'v3' ? ' is-good' : ''}`}>{report.id === 'v3' ? 'Current' : 'Archived'}</span>
              </div>
              <div className="c-report-metrics">
                <span><b>{report.acc}%</b><em>accuracy</em></span>
                <span><b>{report.recall}%</b><em>recall</em></span>
                <span><b>{report.fpr}%</b><em>false positive</em></span>
              </div>
              <div className="c-report-bar"><i style={{ width: `${report.acc}%` }} /></div>
            </button>
          ))}
        </div>
        <div className="c-foot-note"><span>Evaluated with the same balanced split across versions</span><span>v3 added reviewed traffic from the queue</span></div>
      </section>
    </div>
  );
};

const MonitorView = ({ range, setRange }) => {
  const metric = METRICS[range];
  return (
    <div className="cv">
      <aside className="cv-side">
        <SideHead eyebrow="Operations" title="System Monitor" desc="Real time metrics and service health for the whole edge.">
          <span className="c-conn"><i />All services nominal</span>
        </SideHead>
        <div className="cv-stats">
          <Stat label="Avg latency" value={metric.latency} />
          <Stat label="Requests / min" value={metric.rpm} />
          <Stat label="Error rate" value={metric.rate} tone="good" />
          <Stat label="Uptime" value="99.98%" />
        </div>
        <div className="c-panel">
          <div className="c-panel-head"><b>Time range</b><span className="c-chip">{range}</span></div>
          <div className="c-filter-row">
            {['1H', '6H', '24H', '7D'].map((item) => (
              <button type="button" key={item} className={`c-chip-btn${range === item ? ' is-on' : ''}`} onClick={() => setRange(item)}>{item}</button>
            ))}
          </div>
          <div className="c-mini-chart">
            <svg viewBox="0 0 300 90" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="monFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2e8a58" stopOpacity=".2" />
                  <stop offset="1" stopColor="#2e8a58" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 70 C30 66 50 72 75 60 C100 48 120 54 145 46 C170 38 190 42 215 34 C240 26 260 30 285 18 L300 14 L300 90 L0 90 Z" fill="url(#monFill)" />
              <path d="M0 70 C30 66 50 72 75 60 C100 48 120 54 145 46 C170 38 190 42 215 34 C240 26 260 30 285 18 L300 14" fill="none" stroke="#2e8a58" strokeWidth="1.6" />
            </svg>
          </div>
          <p className="c-under-note">Judge latency stays under 3 ms at p95.</p>
        </div>
      </aside>

      <section className="c-main">
        <div className="c-main-head">
          <div className="c-head-row">
            <b className="c-overline">Service status</b>
            <span className="c-count-note">5 services</span>
          </div>
        </div>
        <div className="c-list">
          {SERVICES.map((service) => (
            <div className="c-service" key={service.name}>
              <span className="c-dot is-green" />
              <span className="c-service-name">{service.name}<em>{service.detail}</em></span>
              <span className="c-service-val">{service.latency}<em>latency</em></span>
              <span className="c-service-val">{service.up}<em>uptime</em></span>
              <span className="c-chip is-good">Online</span>
            </div>
          ))}
        </div>
        <div className="c-subpanel">
          <div className="c-panel-head"><b>Recent deploys</b><span className="c-chip">4h ago</span></div>
          <div className="c-deploy"><span className="c-mono">proxy-waf</span><span>v3.1.4 · rolling restart</span><em>healthy</em></div>
          <div className="c-deploy"><span className="c-mono">inference-engine</span><span>judge v2.4 · onnx</span><em>healthy</em></div>
        </div>
      </section>
    </div>
  );
};

const SettingsView = ({ settings, toggleSetting, onSave, saved }) => (
  <div className="cv">
    <aside className="cv-side">
      <SideHead eyebrow="Configuration" title="Settings" desc="Tune the hybrid verdict for this instance." />
      <div className="c-panel">
        <div className="c-panel-head"><b>Instance</b><span className="c-chip is-good">Online</span></div>
        <div className="c-field"><label>Host</label><span className="c-mono">proxy-waf</span></div>
        <div className="c-field"><label>Coraza</label><span>3.1</span></div>
        <div className="c-field"><label>CRS</label><span>4.0</span></div>
        <div className="c-field"><label>Judge</label><span>v2.4 · onnx</span></div>
        <button type="button" className="c-btn is-dark c-btn-block" onClick={onSave}>{saved ? 'Saved' : 'Save changes'}</button>
      </div>
      <p className="c-note">Changes apply to the next request. No restart, no dropped connections.</p>
    </aside>

    <section className="c-main">
      <div className="c-main-head">
        <div className="c-head-row">
          <b className="c-overline">Preferences</b>
          <span className="c-count-note">applies to production</span>
        </div>
      </div>
      <div className="c-settings">
        {SETTINGS.map((group) => (
          <div className="c-settings-group" key={group.title}>
            <b>{group.title}</b>
            {group.rows.map((row) => (
              <div className="c-setting" key={row.key}>
                <span className="c-setting-copy">{row.label}<em>{row.hint}</em></span>
                <Toggle on={settings[row.key]} onClick={() => toggleSetting(row.key)} label={row.label} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="c-foot-note"><span>Config is versioned in /etc/modintel</span><span>Rollback available for 30 days</span></div>
    </section>
  </div>
);

const AlertDrawer = ({ alert, onClose, onAction }) => (
  <div className="c-drawer" role="dialog" aria-label="Alert detail">
    <div className="c-drawer-head">
      <span className="c-overline">Alert {alert.id}</span>
      <div className="c-head-right">
        <Pri level={alert.pri} />
        <button type="button" className="c-icon-btn" onClick={onClose} aria-label="Close alert"><Icon name="close" /></button>
      </div>
    </div>
    <div className="c-drawer-body">
      <div className="c-drawer-meta">
        <span>{alert.time} UTC</span><span>{alert.ip}</span><span>{alert.source}</span>
      </div>
      <code className="c-drawer-uri">{alert.method} {alert.uri}</code>
      <div className="c-drawer-scores">
        <div><span>Coraza score</span><b>{alert.score}</b><em>anomaly total</em></div>
        <div><span>AI probability</span><b className={alert.ai >= 70 ? 'is-bad' : ''}>{alert.ai}%</b><em>attack likelihood</em></div>
        <div><span>Confidence</span><b>{alert.conf}%</b><em>model certainty</em></div>
      </div>
      <p className="c-drawer-label">Triggered rules</p>
      <div className="c-rule-list">
        {alert.rules.length ? alert.rules.map((rule) => (
          <div key={rule}><span className="c-rule-id">{rule}</span><span>{RULE_NAMES[rule] || 'Custom signature'}</span></div>
        )) : <p className="c-dim">No Coraza rule fired. This request came from the Layer 2 miss detector.</p>}
      </div>
      <p className="c-drawer-label">Why the model flagged it</p>
      <p className="c-drawer-explain">
        Union based SQL injection in the query string, three encoding layers, and a long URI with high
        entropy. The model rates this 96% likely to be an attack while Coraza scored it 32.
      </p>
      <div className="c-drawer-tags">
        <span>SQLi</span><span>URL encoded</span><span>GET</span><span>query string</span>
      </div>
    </div>
    <div className="c-drawer-actions">
      <button type="button" onClick={() => onAction('benign')}>Mark benign</button>
      <button type="button" className="is-dark" onClick={() => onAction('block')}>Block client</button>
    </div>
  </div>
);

const Console = () => {
  const screenRef = useRef(null);
  const [scale, setScale] = useState(0.8);
  const [view, setView] = useState('events');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [live, setLive] = useState(true);
  const [query, setQuery] = useState('');
  const [priorities, setPriorities] = useState(['P1', 'P2', 'P3']);
  const [trend, setTrend] = useState('Day');
  const [queue, setQueue] = useState(QUEUE);
  const [review, setReview] = useState({ reviewed: 1248, tp: 986, fp: 218 });
  const [ruleState, setRuleState] = useState(RULES);
  const [mode, setMode] = useState('Write');
  const [trainState, setTrainState] = useState('idle');
  const [runs, setRuns] = useState(RUNS);
  const [activeDataset, setActiveDataset] = useState(DATASETS[0]);
  const [activeReport, setActiveReport] = useState('v3');
  const [range, setRange] = useState('1H');
  const [settings, setSettings] = useState({ block: true, clear: true, miss: true, payload: false, retention: true, email: true, slack: false });
  const [saved, setSaved] = useState(false);
  const toastTimer = useRef(null);
  const trainTimer = useRef(null);

  useLayoutEffect(() => {
    const node = screenRef.current;
    if (!node) return undefined;
    const update = () => setScale(node.clientWidth / 1440);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    clearTimeout(toastTimer.current);
    clearTimeout(trainTimer.current);
  }, []);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  };

  const resolve = (item, verdict) => {
    setQueue((current) => current.filter((entry) => entry.id !== item.id));
    setReview((current) => ({
      ...current,
      reviewed: current.reviewed + 1,
      tp: verdict === 'attack' ? current.tp + 1 : current.tp,
      fp: verdict === 'benign' ? current.fp + 1 : current.fp,
    }));
    notify(verdict === 'attack' ? 'Attack confirmed. Added as a positive sample.' : 'Marked benign. Added as a negative sample.');
  };

  const handleDrawerAction = (action) => {
    if (!selected) return;
    notify(action === 'block' ? `Blocked ${selected.ip} at the edge.` : `Marked ${selected.id} benign. The model will learn from it.`);
    setSelected(null);
  };

  const startTraining = () => {
    if (trainState === 'running' || trainState === 'done') return;
    setTrainState('running');
    trainTimer.current = setTimeout(() => {
      setTrainState('done');
      setRuns((current) => [{ id: 'v2.5', when: 'just now', acc: '98.6%', auc: '0.995', state: 'Deployed' }, ...current].slice(0, 4));
      notify('Training complete. Judge v2.5 is ready to deploy.');
    }, 2500);
  };

  const saveSettings = () => {
    setSaved(true);
    notify('Settings saved. Applied to the next request.');
    setTimeout(() => setSaved(false), 2200);
  };

  const togglePriority = (level) => {
    setPriorities((current) => current.includes(level) ? current.filter((item) => item !== level) : [...current, level]);
  };

  const toggleRule = (id) => {
    setRuleState((current) => current.map((rule) => rule.id === id ? { ...rule, on: !rule.on } : rule));
  };

  const toggleSetting = (key) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  };

  const activeNav = view === 'review' ? 'events' : view;

  return (
    <section className="console-stage" aria-label="Interactive console demo">
      <div className="device">
        <div className="device-lid">
          <div className="device-screen" ref={screenRef}>
            <div className="device-notch" />
            <div className="console" style={{ transform: `scale(${scale})` }}>
              <header className="c-nav">
                <span className="c-brand">
                  <Mark className="c-brand-mark" />
                  <span>MODINTEL</span>
                </span>
                <nav className="c-nav-links" aria-label="Console">
                  {NAV.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={activeNav === item.id ? 'is-active' : ''}
                      onClick={() => { setView(item.id); setSelected(null); }}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="c-nav-actions">
                  <button type="button" className="c-review-btn" onClick={() => setView('review')}>
                    <Icon name="play" className="c-ico c-ico-xs" />
                    Review
                    <b>{queue.length}</b>
                  </button>
                  <button type="button" className="c-lock-btn" aria-label="Lock dashboard"><Icon name="lock" /></button>
                </div>
              </header>

              <div className={`c-scene${view !== 'review' ? ' is-flush' : ''}`}>
                {view === 'events' && (
                  <EventsView
                    live={live}
                    setLive={setLive}
                    query={query}
                    setQuery={setQuery}
                    priorities={priorities}
                    togglePriority={togglePriority}
                    onSelect={setSelected}
                    trend={trend}
                    setTrend={setTrend}
                  />
                )}
                {view === 'review' && <ReviewView queue={queue} review={review} resolve={resolve} />}
                {view === 'rules' && <RulesPage />}
                {view === 'training' && <TrainingPage />}
                {view === 'datasets' && <DatasetsPage />}
                {view === 'reports' && <ReportsPage />}
                {view === 'monitor' && <MonitorPage />}
                {view === 'settings' && <SettingsPage />}
              </div>

              {selected && <AlertDrawer alert={selected} onClose={() => setSelected(null)} onAction={handleDrawerAction} />}
              {toast && <div className="c-toast">{toast}</div>}
            </div>
          </div>
        </div>
        <div className="device-base" aria-hidden="true" />
      </div>
      <p className="device-hint">
        <Icon name="cursor" className="hint-ico" />
        Live demo. Switch views, open an alert, label the review queue.
      </p>
    </section>
  );
};

export default Console;

