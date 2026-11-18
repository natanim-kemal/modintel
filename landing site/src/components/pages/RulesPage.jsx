import { useMemo, useState } from 'react';
import './RulesPage.css';

const CATS = ['SQLi', 'XSS', 'LFI', 'RCE', 'Protocol', 'PHP', 'Java', 'Session', 'Data', 'Generic'];

const PHASES = [
  ['1', 'Phase 1 - Request headers'],
  ['2', 'Phase 2 - Request body'],
  ['3', 'Phase 3 - Response headers'],
  ['4', 'Phase 4 - Response body'],
];

const build = (rows, custom = false) =>
  rows.map(([id, desc, cat, severity, enabled = true]) => ({
    id,
    desc,
    cat,
    severity,
    enabled,
    custom,
  }));

const INITIAL = {
  crs: build([
    [942100, 'SQL Injection Attack Detected', 'SQLi', 'CRITICAL'],
    [942110, 'SQL Injection Attack: Common Injection Testing', 'SQLi', 'CRITICAL'],
    [942120, 'SQL Injection Attack: SQL Operator Detected', 'SQLi', 'CRITICAL'],
    [942130, 'SQL Injection Attack: SQL Regex Detected', 'SQLi', 'CRITICAL'],
    [942140, 'SQL Injection Attack: Common DB Names Detected', 'SQLi', 'HIGH', false],
    [942150, 'SQL Injection Attack: Basic Injection', 'SQLi', 'CRITICAL'],
    [942160, 'Blind SQL Injection Test Detected', 'SQLi', 'CRITICAL'],
    [942170, 'SQL Benchmark Injection Detected', 'SQLi', 'CRITICAL'],
    [942180, 'SQL Basic Authentication Bypass', 'SQLi', 'CRITICAL'],
    [942190, 'MSSQL Code Execution Attempt', 'SQLi', 'CRITICAL'],
    [942200, 'MySQL Comment and Space Obfuscation', 'SQLi', 'HIGH'],
    [942210, 'SQL Login Bypass Attempt', 'SQLi', 'CRITICAL'],
    [942220, 'SQL Hex Encoding Detected', 'SQLi', 'HIGH'],
    [942230, 'Conditional SQL Statement Detected', 'SQLi', 'CRITICAL'],
    [942240, 'SQL Schema Detection Attempt', 'SQLi', 'HIGH'],
    [942250, 'SQL Modify Statement Detected', 'SQLi', 'HIGH'],
    [942260, 'SQL Basic Authentication Bypass', 'SQLi', 'CRITICAL', false],
    [942270, 'Basic SQL Injection Testing Detected', 'SQLi', 'HIGH'],
    [942280, 'SQL Sleep Injection Detected', 'SQLi', 'CRITICAL'],
    [942290, 'SQL Wildcard Injection Detected', 'SQLi', 'HIGH'],
    [930110, 'Path Traversal Attack Detected', 'LFI', 'CRITICAL'],
    [930120, 'OS File Access Attempt', 'LFI', 'HIGH'],
    [930130, 'Restricted File Access Attempt', 'LFI', 'HIGH'],
    [932160, 'Remote Command Execution Detected', 'RCE', 'CRITICAL'],
    [932170, 'Shell Command Injection Attempt', 'RCE', 'CRITICAL'],
    [933100, 'PHP Injection Attack Detected', 'PHP', 'HIGH'],
    [941100, 'XSS Attack Detected', 'XSS', 'CRITICAL'],
    [941120, 'XSS Filter: Event Handler Detected', 'XSS', 'HIGH'],
    [921110, 'HTTP Request Smuggling Detected', 'Protocol', 'CRITICAL'],
    [920350, 'Host Header Is a Numeric IP', 'Protocol', 'MEDIUM'],
  ]),
  custom: build(
    [
      [990100, 'SQL injection in GraphQL variables', 'SQLi', 'HIGH'],
      [990110, 'Path traversal in document upload', 'LFI', 'CRITICAL'],
      [990120, 'Login rate limit bypass attempt', 'Protocol', 'LOW', false],
    ],
    true,
  ),
  regex: build([
    ['RX-101', 'JWT anomaly in authorization header', 'Session', 'MEDIUM'],
    ['RX-102', 'API key leaked in query string', 'Data', 'HIGH'],
    ['RX-103', 'Suspicious base64 payload detected', 'Generic', 'MEDIUM'],
    ['RX-104', 'Prompt injection attempt detected', 'Generic', 'HIGH'],
  ]),
};

const signatureFor = (rule) =>
  `SecRule ARGS|ARGS_NAMES "@rx ${rule.cat.toLowerCase()}" "id:${rule.id},phase:2,deny,status:403,t:urlDecodeUni,t:lowercase,msg:'${rule.desc}'"`;

const emptyForm = () => ({
  id: '',
  desc: '',
  cat: 'SQLi',
  severity: 'MEDIUM',
  phase: '2',
  sig: '',
});

const PER_PAGE = 16;

const RulesPage = () => {
  const [rules, setRules] = useState(INITIAL);
  const [tab, setTab] = useState('crs');
  const [mode, setMode] = useState('write');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  const [page, setPage] = useState(1);
  const [note, setNote] = useState('');
  const [restart, setRestart] = useState(true);

  const list = rules[tab];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((rule) => {
      if (cat && rule.cat !== cat) return false;
      if (!q) return true;
      return String(rule.id).toLowerCase().includes(q) || rule.desc.toLowerCase().includes(q);
    });
  }, [list, cat, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const selected = list.find((rule) => rule.id === editing) || null;
  const readOnly = mode === 'edit' && selected !== null && !selected.custom;

  const pick = (rule) => {
    setMode('edit');
    setEditing(rule.id);
    setForm({
      id: String(rule.id),
      desc: rule.desc,
      cat: rule.cat,
      severity: rule.severity,
      phase: '2',
      sig: signatureFor(rule),
    });
    setNote('');
  };

  const startWrite = () => {
    setMode('write');
    setEditing(null);
    setForm(emptyForm());
    setNote('');
  };

  const startEdit = () => {
    const target = selected || visible[0] || list[0];
    if (target) pick(target);
  };

  const switchTab = (next) => {
    setTab(next);
    setPage(1);
    setQuery('');
    setCat('');
    startWrite();
  };

  const patch = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = () => {
    if (readOnly) return;
    if (!form.desc.trim()) {
      setNote('Add a description before saving this rule.');
      return;
    }

    if (mode === 'write') {
      const id = Number(form.id) || 990100 + rules.custom.length;
      if (rules.custom.some((rule) => String(rule.id) === String(id))) {
        setNote(`Rule ${id} already exists in custom signatures.`);
        return;
      }
      const created = {
        id,
        desc: form.desc.trim(),
        cat: form.cat,
        severity: form.severity,
        enabled: true,
        custom: true,
      };
      setRules((prev) => ({ ...prev, custom: [created, ...prev.custom] }));
      setTab('custom');
      setPage(1);
      setQuery('');
      setCat('');
      setEditing(id);
      setMode('edit');
      setForm({
        id: String(id),
        desc: created.desc,
        cat: created.cat,
        severity: created.severity,
        phase: form.phase,
        sig: signatureFor(created),
      });
      setNote(`Rule ${id} added. Restart the WAF to enforce it.`);
      setRestart(true);
      return;
    }

    setRules((prev) => ({
      ...prev,
      custom: prev.custom.map((rule) =>
        rule.id === editing
          ? { ...rule, desc: form.desc.trim(), cat: form.cat, severity: form.severity }
          : rule,
      ),
    }));
    setNote(`Rule ${editing} updated. Restart the WAF to apply.`);
    setRestart(true);
  };

  const toggle = (id) => {
    setRules((prev) => ({
      ...prev,
      [tab]: prev[tab].map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    }));
    setRestart(true);
  };

  const clearFilters = () => {
    setQuery('');
    setCat('');
    setPage(1);
  };

  const actionLabel = readOnly ? 'Read only' : mode === 'edit' ? 'Save changes' : 'Add rule';

  return (
    <section className="px-rules">
      <aside className="rl-left">
        <p className="rl-eyebrow">Policy</p>
        <h1 className="rl-title">Rule Intelligence</h1>
        <p className="rl-sub">
          Active security signatures currently enforced by the ModIntel engine.
        </p>

        <div className="rl-mode" role="group" aria-label="Rule editor mode">
          <button type="button" className={mode === 'write' ? 'is-on' : ''} onClick={startWrite}>
            Write
          </button>
          <button type="button" className={mode === 'edit' ? 'is-on' : ''} onClick={startEdit}>
            Edit
          </button>
        </div>

        <div className="rl-editor">
          <div className="rl-editor-head">
            <h2>{mode === 'write' ? 'Write custom rule' : 'Edit custom rule'}</h2>
            {readOnly ? <span className="rl-ro">Read only</span> : null}
          </div>

          <div className="rl-field">
            <label htmlFor="rl-id">Rule ID</label>
            <input
              id="rl-id"
              value={form.id}
              onChange={(event) => patch('id', event.target.value)}
              placeholder="990100"
              readOnly={readOnly}
            />
          </div>

          <div className="rl-field">
            <label htmlFor="rl-cat">Category</label>
            <select
              id="rl-cat"
              value={form.cat}
              onChange={(event) => patch('cat', event.target.value)}
              disabled={readOnly}
            >
              {CATS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="rl-field">
            <label htmlFor="rl-desc">Description</label>
            <input
              id="rl-desc"
              value={form.desc}
              onChange={(event) => patch('desc', event.target.value)}
              placeholder="Brief description of the rule"
              readOnly={readOnly}
            />
          </div>

          <div className="rl-two">
            <div className="rl-field">
              <label htmlFor="rl-sev">Severity</label>
              <select
                id="rl-sev"
                value={form.severity}
                onChange={(event) => patch('severity', event.target.value)}
                disabled={readOnly}
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="rl-field">
              <label htmlFor="rl-phase">Phase</label>
              <select
                id="rl-phase"
                value={form.phase}
                onChange={(event) => patch('phase', event.target.value)}
                disabled={readOnly}
              >
                {PHASES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rl-field">
            <label htmlFor="rl-sig">Signature (SecRule line)</label>
            <textarea
              id="rl-sig"
              value={form.sig}
              onChange={(event) => patch('sig', event.target.value)}
              placeholder='SecRule ARGS_NAMES|ARGS "@rx ..." "id:990100,phase:2,deny"'
              spellCheck={false}
              readOnly={readOnly}
            />
          </div>

          <div className="rl-actions">
            <button type="button" className="rl-primary" onClick={save} disabled={readOnly}>
              {actionLabel}
            </button>
            <button
              type="button"
              className="rl-ghost"
              onClick={() => {
                setForm(emptyForm());
                setNote('');
              }}
              disabled={readOnly}
            >
              Clear
            </button>
          </div>

          {note ? <p className="rl-note">{note}</p> : null}
        </div>

        <div className="rl-stats">
          <div>
            <span>Enabled</span>
            <b>{rules.crs.concat(rules.custom, rules.regex).filter((rule) => rule.enabled).length}</b>
          </div>
          <div>
            <span>Disabled</span>
            <b>{rules.crs.concat(rules.custom, rules.regex).filter((rule) => !rule.enabled).length}</b>
          </div>
          <div>
            <span>Custom</span>
            <b>{rules.custom.length}</b>
          </div>
        </div>

        <div className="rl-tip">
          <b>Custom rules evaluate after CRS</b>
          <p>
            A hit still passes through the model judge before it reaches the analyst queue.
          </p>
        </div>
      </aside>

      <div className="rl-right">
        <header className="rl-head">
          <div className="rl-head-top">
            <div>
              <p className="rl-label">Security signatures</p>
              <div className="rl-tools">
                <div className="rl-tabs" role="tablist" aria-label="Signature source">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'crs'}
                    className={tab === 'crs' ? 'is-on' : ''}
                    onClick={() => switchTab('crs')}
                  >
                    CRS Rules
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'custom'}
                    className={tab === 'custom' ? 'is-on' : ''}
                    onClick={() => switchTab('custom')}
                  >
                    Custom Rules
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'regex'}
                    className={tab === 'regex' ? 'is-on' : ''}
                    onClick={() => switchTab('regex')}
                  >
                    Regex Signatures
                  </button>
                </div>
                <span className="rl-count">
                  {filtered.length} {filtered.length === 1 ? 'rule' : 'rules'}
                </span>
              </div>
            </div>

            <div className="rl-restart">
              <span>
                {restart
                  ? 'Changes require WAF restart to take effect.'
                  : 'Restarted. Changes are live.'}
              </span>
              <button
                type="button"
                className={restart ? 'is-hot' : ''}
                onClick={() => {
                  setRestart(false);
                  setNote('WAF restart queued. New rules take effect in a few seconds.');
                }}
                disabled={!restart}
              >
                {restart ? 'Restart WAF' : 'Restart queued'}
              </button>
            </div>
          </div>
        </header>

        <div className="rl-filters">
          <div className="rl-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.2 16.2 4.3 4.3" />
            </svg>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search by ID or description"
              aria-label="Search rules"
            />
            {query ? (
              <button
                type="button"
                className="rl-clear"
                onClick={() => {
                  setQuery('');
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                x
              </button>
            ) : null}
          </div>

          <select
            value={cat}
            onChange={(event) => {
              setCat(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {CATS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="rl-body">
          <table className="rl-table">
            <colgroup>
              <col style={{ width: '17%' }} />
              <col style={{ width: '14%' }} />
              <col />
              <col style={{ width: '17%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Rule ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((rule) => (
                <tr
                  key={rule.id}
                  className={editing === rule.id ? 'is-sel' : ''}
                  onClick={() => pick(rule)}
                >
                  <td>
                    <span className="rl-idcell">
                      <span className="rl-chev">&#8250;</span>
                      {rule.id}
                    </span>
                  </td>
                  <td>
                    <span className="rl-cat">{rule.cat}</span>
                  </td>
                  <td className="rl-desc">{rule.desc}</td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <span className={`rl-state${rule.enabled ? ' is-on' : ''}`}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      type="button"
                      className="rl-mini"
                      onClick={() => toggle(rule.id)}
                    >
                      {rule.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td className="rl-empty" colSpan={4}>
                    No rules match this query.{' '}
                    <button type="button" className="rl-mini" onClick={clearFilters}>
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <footer className="rl-foot">
          <span>
            Showing {filtered.length ? (safePage - 1) * PER_PAGE + 1 : 0}-
            {Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div className="rl-pages">
            <button
              type="button"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              &#8249;
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                type="button"
                key={number}
                className={number === safePage ? 'is-on' : ''}
                onClick={() => setPage(number)}
                aria-label={`Page ${number}`}
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === pageCount}
              aria-label="Next page"
            >
              &#8250;
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default RulesPage;
