import { useEffect, useRef, useState } from 'react';
import './ReportsPage.css';

const RANGES = [
  { id: '24h', label: '24H', full: 'Last 24 hours', updated: 'Today 12:41 UTC', window: 'Nov 17 12:00 to Nov 18 12:00' },
  { id: '7d', label: '7D', full: 'Last 7 days', updated: 'Today 06:00 UTC', window: 'Nov 11 to Nov 17' },
  { id: '30d', label: '30D', full: 'Last 30 days', updated: 'Nov 17 06:00 UTC', window: 'Oct 19 to Nov 17' },
  { id: '90d', label: '90D', full: 'Last 90 days', updated: 'Nov 1 06:00 UTC', window: 'Aug 19 to Nov 17' },
];

const REPORTS = [
  {
    id: 'weekly',
    name: 'Weekly threat summary',
    cadence: 'Weekly',
    slot: 'Mon 06:00 UTC',
    format: 'PDF',
    lastRun: 'Nov 17 06:00',
    code: 'RPT-2411-W46',
    title: 'Weekly Threat Summary',
    subtitle: 'Attack volume, top vectors and rule performance',
    chartTitle: 'Attacks per day',
    chartUnit: 'COUNT',
    chartType: 'bars',
    chartValues: [1482, 1204, 1861, 1733, 2402, 2311, 2489],
    chartLabels: ['Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16', 'Nov 17'],
    kpis: [
      { label: 'Total attacks', value: '12,482', delta: '+8.2% vs prior week', dir: 'up', tone: 'bad' },
      { label: 'Block rate', value: '98.1%', delta: '+0.4 pts', dir: 'up', tone: 'good' },
      { label: 'P1 incidents', value: '17', delta: '-3 vs prior week', dir: 'down', tone: 'good' },
      { label: 'False positives', value: '43', delta: '-12 vs prior week', dir: 'down', tone: 'good' },
    ],
    findings: [
      { sev: 'critical', text: 'SQLi probes up 34% against /api/checkout', tag: '942100' },
      { sev: 'high', text: 'Path traversal cluster from 198.51.100.0/24', tag: 'Layer 2' },
      { sev: 'medium', text: 'Scanner surge on /wp-login.php, 188 hits', tag: '913100' },
      { sev: 'low', text: 'Anomaly-score drift near the Layer 2 threshold', tag: 'v2.4' },
    ],
  },
  {
    id: 'rules',
    name: 'Rule coverage',
    cadence: 'Weekly',
    slot: 'Tue 06:00 UTC',
    format: 'CSV',
    lastRun: 'Nov 16 06:00',
    code: 'RPT-2411-RC',
    title: 'Rule Coverage',
    subtitle: 'Which CRS 4.0 rules fire, and where they stay silent',
    chartTitle: 'Hits by rule category',
    chartUnit: 'HITS',
    chartType: 'bars',
    chartValues: [1284, 418, 377, 254, 188, 1641],
    chartLabels: ['Generic', 'Injection', 'File', 'Protocol', 'Scanner', 'Anomaly'],
    kpis: [
      { label: 'Active rules', value: '214', delta: '+2 this cycle', dir: 'up', tone: 'flat' },
      { label: 'Fire rate', value: '96.4%', delta: '+1.1 pts', dir: 'up', tone: 'good' },
      { label: 'Coverage gaps', value: '6', delta: '-2 vs prior', dir: 'down', tone: 'good' },
      { label: 'Silent 90d', value: '9', delta: 'review advised', dir: 'flat', tone: 'bad' },
    ],
    findings: [
      { sev: 'high', text: '9 rules with zero hits across 90 days', tag: 'CRS 4.0' },
      { sev: 'medium', text: '949110 accounts for 61% of anomaly alerts', tag: 'Generic' },
      { sev: 'medium', text: '930130 disabled after 38% FP rate', tag: '930130' },
      { sev: 'low', text: '920350 may tighten to Paranoia 2 cleanly', tag: 'Protocol' },
    ],
  },
  {
    id: 'model',
    name: 'Model quality',
    cadence: 'Biweekly',
    slot: 'Wed 06:00 UTC',
    format: 'PDF',
    lastRun: 'Nov 12 06:00',
    code: 'RPT-2411-MQ',
    title: 'Model Quality',
    subtitle: 'Judge model accuracy, calibration and drift',
    chartTitle: 'Judge accuracy by version',
    chartUnit: 'ACCURACY',
    chartType: 'line',
    chartValues: [91.2, 94.1, 96.7, 97.5, 98.4],
    chartLabels: ['v2.0', 'v2.1', 'v2.2', 'v2.3', 'v2.4'],
    kpis: [
      { label: 'Accuracy', value: '98.4%', delta: '+0.9 pts', dir: 'up', tone: 'good' },
      { label: 'Recall', value: '96.8%', delta: '+1.7 pts', dir: 'up', tone: 'good' },
      { label: 'FPR', value: '0.8%', delta: '-0.8 pts', dir: 'down', tone: 'good' },
      { label: 'AUC', value: '0.994', delta: '+0.003', dir: 'up', tone: 'good' },
    ],
    findings: [
      { sev: 'high', text: 'Recall dipped on /api/session traffic', tag: 'Layer 2' },
      { sev: 'medium', text: '14 reviewed misses queued since Nov 3', tag: 'Queue' },
      { sev: 'low', text: 'Drift within tolerance on Layer 2 scores', tag: 'v2.4' },
      { sev: 'low', text: 'Calibration holds across 5 score buckets', tag: 'Judge' },
    ],
  },
  {
    id: 'digest',
    name: 'Incident digest',
    cadence: 'Daily',
    slot: 'Daily 06:00 UTC',
    format: 'PDF',
    lastRun: 'Today 06:00',
    code: 'RPT-241118-D',
    title: 'Incident Digest',
    subtitle: 'P1 and P2 incidents, grouped and deduplicated',
    chartTitle: 'P1 + P2 incidents per day',
    chartUnit: 'COUNT',
    chartType: 'bars',
    chartValues: [4, 6, 2, 8, 5, 3, 7],
    chartLabels: ['Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16', 'Nov 17'],
    kpis: [
      { label: 'P1 incidents', value: '3', delta: '-2 vs prior day', dir: 'down', tone: 'good' },
      { label: 'P2 incidents', value: '11', delta: '+4 vs prior day', dir: 'up', tone: 'bad' },
      { label: 'Mean review time', value: '14m', delta: '-6m', dir: 'down', tone: 'good' },
      { label: 'Deduped away', value: '38', delta: '61% reduction', dir: 'flat', tone: 'flat' },
    ],
    findings: [
      { sev: 'critical', text: 'A-92419 config.php probe, auto-blocked', tag: 'P1 12:36' },
      { sev: 'critical', text: 'A-92425 UNION SELECT wave, 214 hits', tag: 'P1 12:39' },
      { sev: 'high', text: 'Refund endpoint abuse pattern, Layer 2', tag: 'P2 12:40' },
      { sev: 'medium', text: 'Geo anomaly: traffic from 3 new ASNs', tag: 'P2 09:12' },
    ],
  },
];

const SEV_CLASS = { critical: 'is-crit', high: 'is-high', medium: 'is-med', low: 'is-low' };

const Icon = ({ name, size = 13 }) => {
  const paths = {
    download: 'M12 4v10m0 0 4-4m-4 4-4-4M5 19h14',
    chevron: 'M6 9l6 6 6-6',
    check: 'm4 12.5 5 5L20 6.5',
    doc: 'M7 3h7l4 4v14H7zM14 3v4h4',
    clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    arrowUp: 'M7 14l5-5 5 5',
    arrowDown: 'M7 10l5 5 5-5',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
};

const Bars = ({ values }) => {
  const max = Math.max(...values);
  const top = 8;
  const base = 92;
  const slot = 320 / values.length;
  return (
    <g>
      <line x1="0" y1="32" x2="320" y2="32" className="px-grid" />
      <line x1="0" y1="60" x2="320" y2="60" className="px-grid" />
      <line x1="0" y1="92" x2="320" y2="92" className="px-grid is-base" />
      {values.map((v, i) => {
        const h = Math.max(3, ((v / max) * (base - top)));
        return (
          <rect key={i} x={i * slot + slot * 0.22} y={base - h} width={slot * 0.56} height={h}
            rx="1.5" className="px-bar" />
        );
      })}
    </g>
  );
};

const Line = ({ values }) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(0.001, max - min);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 304 + 8;
    const y = 84 - ((v - min) / span) * 62;
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} 96 L${pts[0][0].toFixed(1)} 96 Z`;
  return (
    <g>
      <line x1="0" y1="32" x2="320" y2="32" className="px-grid" />
      <line x1="0" y1="60" x2="320" y2="60" className="px-grid" />
      <line x1="0" y1="96" x2="320" y2="96" className="px-grid is-base" />
      <path d={area} className="px-area" />
      <path d={line} className="px-line" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" className="px-dotc" />)}
    </g>
  );
};

const ReportsPage = () => {
  const [reportId, setReportId] = useState('weekly');
  const [range, setRange] = useState('7d');
  const [busy, setBusy] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [queued, setQueued] = useState(null);
  const timer = useRef(null);
  const queuedTimer = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
    window.clearTimeout(queuedTimer.current);
  }, []);

  const kick = () => {
    setBusy(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setBusy(false), 650);
  };

  const pickReport = (id) => {
    if (id === reportId) return;
    setReportId(id);
    kick();
  };

  const pickRange = (id) => {
    if (id === range) return;
    setRange(id);
    kick();
  };

  const queueExport = (format) => {
    setExportOpen(false);
    setQueued(format);
    window.clearTimeout(queuedTimer.current);
    queuedTimer.current = window.setTimeout(() => setQueued(null), 4000);
  };

  const report = REPORTS.find((item) => item.id === reportId);
  const activeRange = RANGES.find((item) => item.id === range);

  return (
    <div className="px-reports">
      <header className="px-head">
        <div className="px-head-left">
          <span className="px-eyebrow">Analytics / Reports</span>
          <h1 className="px-title">Reports</h1>
          <p className="px-desc">Scheduled attack intelligence, rule coverage and model calibration for this ModIntel instance.</p>
        </div>
        <div className="px-head-right">
          <div className="px-head-controls">
            <div className="px-seg" role="group" aria-label="Date range">
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={range === item.id ? 'is-on' : ''}
                  aria-pressed={range === item.id}
                  aria-label={item.full}
                  onClick={() => pickRange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {queued && (
              <span className="px-queued" role="status">
                <Icon name="check" size={11} />
                Report queued · {queued}
              </span>
            )}
            <div className="px-export">
              <button type="button" className="px-export-main" onClick={() => queueExport('PDF')}>
                <Icon name="download" size={13} />
                Export
              </button>
              <button
                type="button"
                className="px-export-toggle"
                aria-label="Choose export format"
                aria-haspopup="menu"
                aria-expanded={exportOpen}
                onClick={() => setExportOpen((open) => !open)}
              >
                <Icon name="chevron" size={12} />
              </button>
              {exportOpen && (
                <div className="px-menu" role="menu" aria-label="Export format">
                  {['PDF', 'CSV', 'JSON'].map((format) => (
                    <button key={format} type="button" role="menuitem" onClick={() => queueExport(format)}>
                      <Icon name="doc" size={12} />
                      {format} document
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <span className="px-updated">Updated {activeRange.updated} · Instance prod-fra1</span>
        </div>
      </header>

      <div className="px-body">
        <aside className="px-side" aria-label="Report definitions">
          <div className="px-side-head">
            <span className="px-overline">Report definitions</span>
            <span className="px-count">4</span>
          </div>
          <div className="px-list">
            {REPORTS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`px-item${item.id === reportId ? ' is-on' : ''}`}
                aria-pressed={item.id === reportId}
                onClick={() => pickReport(item.id)}
              >
                <span className="px-item-top">
                  <span className="px-item-name">{item.name}</span>
                  <span className="px-item-format">{item.format}</span>
                </span>
                <span className="px-item-meta">{item.cadence} · {item.slot}</span>
                <span className="px-item-run">Last run {item.lastRun}</span>
              </button>
            ))}
          </div>
          <div className="px-side-foot">
            <Icon name="clock" size={12} />
            <span>Next run · Incident digest · Today 18:00 UTC</span>
          </div>
        </aside>

        <main className="px-main">
          <div className="px-main-head">
            <span className="px-overline">Preview · {report.format}</span>
            <span className={`px-state${busy ? ' is-busy' : ''}`}>
              <i />
              {busy ? 'Generating' : 'Ready'}
            </span>
          </div>

          <div className="px-sheet-wrap">
            <article className="px-sheet" aria-label={`${report.title} preview`} aria-busy={busy}>
              <div className="px-sheet-head">
                <div className="px-sheet-head-left">
                  <span className="px-overline is-accent">ModIntel · Confidential</span>
                  <h2 className="px-sheet-title">{report.title}</h2>
                  <p className="px-sheet-sub">{report.subtitle}</p>
                </div>
                <div className="px-sheet-head-right">
                  <span className="px-wordmark">MODINTEL</span>
                  <span className="px-sheet-meta">{report.code}</span>
                  <span className="px-sheet-meta">Window · {activeRange.window}</span>
                </div>
              </div>

              <div className="px-kpis">
                {report.kpis.map((kpi) => (
                  <div className="px-kpi" key={kpi.label}>
                    <span className="px-kpi-label">{kpi.label}</span>
                    <span className="px-kpi-value">{kpi.value}</span>
                    <span className={`px-kpi-delta is-${kpi.tone}`}>
                      {kpi.dir === 'up' && <Icon name="arrowUp" size={9} />}
                      {kpi.dir === 'down' && <Icon name="arrowDown" size={9} />}
                      {kpi.delta}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-lower">
                <section className="px-chart-block" aria-label={report.chartTitle}>
                  <div className="px-block-head">
                    <span className="px-overline">{report.chartTitle}</span>
                    <span className="px-unit">{report.chartUnit}</span>
                  </div>
                  <svg viewBox="0 0 320 104" className="px-chart" preserveAspectRatio="none" aria-hidden="true">
                    {report.chartType === 'bars'
                      ? <Bars values={report.chartValues} />
                      : <Line values={report.chartValues} />}
                  </svg>
                  <div className="px-chart-x">
                    {report.chartLabels.map((label) => <span key={label}>{label}</span>)}
                  </div>
                </section>

                <section className="px-findings" aria-label="Findings">
                  <div className="px-block-head">
                    <span className="px-overline">Findings</span>
                    <span className="px-unit">{report.findings.length} FLAGGED</span>
                  </div>
                  <ul className="px-finding-list">
                    {report.findings.map((finding, i) => (
                      <li key={i} className="px-finding">
                        <i className={`px-sev ${SEV_CLASS[finding.sev]}`} aria-hidden="true" />
                        <span className="px-finding-text">{finding.text}</span>
                        <span className="px-finding-tag">{finding.tag}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <footer className="px-sheet-foot">
                <span>Generated {activeRange.updated} · Instance prod-fra1</span>
                <span>{report.code} · Retention 30 days</span>
              </footer>

              {busy && (
                <div className="px-busy" role="status">
                  <span className="px-spinner" aria-hidden="true" />
                  <span className="px-busy-text">Generating preview</span>
                  <span className="px-busy-sub">{report.code} · {activeRange.full}</span>
                </div>
              )}
            </article>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
