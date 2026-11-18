import { useEffect, useRef, useState } from 'react';
import './SettingsPage.css';

const API_KEY = 'mi_live_9f2c7a1d84b34e6ba91c5f0d2e47a13b';
const API_KEY_MASK = 'mi_live_************************a13b';

const SECTIONS = [
  { id: 'detection', label: 'Detection', keys: ['block', 'autoClear', 'l2Miss', 'payloads'] },
  { id: 'model', label: 'Model', keys: ['rollback', 'shadow'] },
  { id: 'integrations', label: 'Integrations', keys: ['slack'] },
  { id: 'notifications', label: 'Notifications', keys: ['emailP1', 'emailP2', 'slackP1', 'digest'] },
  { id: 'team', label: 'Team', keys: ['twofa', 'sso'] },
  { id: 'audit', label: 'Audit', keys: ['tamper', 'adminLog'] },
];

const MEMBERS = [
  { initials: 'MC', name: 'Maya Chen', email: 'maya@modintel.dev', role: 'Admin', tone: 'admin', active: true },
  { initials: 'JB', name: 'Jonas Berg', email: 'jonas@modintel.dev', role: 'Analyst', tone: 'analyst', active: true },
  { initials: 'PR', name: 'Priya Raman', email: 'priya@modintel.dev', role: 'Analyst', tone: 'analyst', active: true },
  { initials: 'TO', name: 'Tom Okafor', email: 'tom@modintel.dev', role: 'Viewer', tone: 'viewer', active: false },
];

const ICONS = {
  detection: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2.5v3.5M12 18v3.5M2.5 12H6M18 12h3.5" />
    </>
  ),
  model: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <rect x="10.5" y="10.5" width="3" height="3" />
      <path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3" />
    </>
  ),
  integrations: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />,
  notifications: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />,
  team: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  audit: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
};

const Ico = ({ name, className = 'px-settings__ico' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {ICONS[name]}
  </svg>
);

const Toggle = ({ on, onClick, label }) => (
  <button type="button" className={`px-settings__switch${on ? ' is-on' : ''}`} onClick={onClick} aria-pressed={on} aria-label={label}>
    <i />
  </button>
);

const Group = ({ title, desc, children }) => (
  <div className="px-settings__group">
    <div className="px-settings__group-head">
      <b>{title}</b>
      <p>{desc}</p>
    </div>
    {children}
  </div>
);

const Row = ({ label, hint, control }) => (
  <div className="px-settings__row">
    <div className="px-settings__row-copy">
      <span className="px-settings__row-label">{label}</span>
      <em className="px-settings__row-hint">{hint}</em>
    </div>
    <div className="px-settings__row-control">{control}</div>
  </div>
);

const Select = ({ id, value, onChange, options, ariaLabel }) => (
  <select id={id} className="px-settings__select" value={value} onChange={onChange} aria-label={ariaLabel}>
    {options.map(([value_, label]) => (
      <option key={value_} value={value_}>{label}</option>
    ))}
  </select>
);

const SettingsPage = () => {
  const [section, setSection] = useState('detection');
  const [toggles, setToggles] = useState({
    block: true, autoClear: true, l2Miss: true, payloads: false,
    rollback: true, shadow: false,
    slack: true,
    emailP1: true, emailP2: false, slackP1: true, digest: false,
    twofa: true, sso: true,
    tamper: true, adminLog: true,
  });
  const [selects, setSelects] = useState({
    blockAction: '403', threshold: '94', paranoia: 'p4',
    judge: 'v2.4', deployment: 'rolling', notifyOn: 'p1', scope: 'readwrite',
    escalation: 'page', retention: '30',
  });
  const [webhook, setWebhook] = useState('https://hooks.slack.com/services/T04MODINTEL/B08SECUR/x9fj2kq0vm');
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [purgeStep, setPurgeStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef(null);
  const copiedTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(savedTimer.current);
    clearTimeout(copiedTimer.current);
  }, []);

  const touch = () => {
    setDirty(true);
    setSaved(false);
  };

  const toggle = (key) => () => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
    touch();
  };

  const choose = (key) => (event) => {
    setSelects((current) => ({ ...current, [key]: event.target.value }));
    touch();
  };

  const editWebhook = (event) => {
    setWebhook(event.target.value);
    setTestSent(false);
    touch();
  };

  const onSave = () => {
    setDirty(false);
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 2600);
  };

  const copyKey = async () => {
    try {
      await navigator.clipboard.writeText(API_KEY);
    } catch {
      // clipboard can be unavailable without a secure context; the key stays visible either way
    }
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1600);
  };

  const sendTest = () => {
    setTestSent(true);
  };

  const purge = () => {
    setPurgeStep((step) => (step === 0 ? 1 : 2));
  };

  const counts = Object.fromEntries(
    SECTIONS.map(({ id, keys }) => [id, keys.filter((key) => toggles[key]).length + '/' + keys.length]),
  );

  const active = SECTIONS.find((item) => item.id === section);

  return (
    <div className="px-settings">
      <header className="px-settings__head">
        <div className="px-settings__head-left">
          <div className="px-settings__titles">
            <span className="px-settings__eyebrow">Configuration</span>
            <h1 className="px-settings__title">Settings</h1>
          </div>
          <span className="px-settings__instance">proxy-waf · production</span>
        </div>
        <div className="px-settings__head-right">
          <div className="px-settings__status" aria-live="polite">
            {dirty ? (
              <><span className="px-settings__dot" />Unsaved changes</>
            ) : saved ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__status-check" aria-hidden="true"><path d="m4 12 5 5L20 6" /></svg>
                Settings saved
              </>
            ) : (
              <><span className="px-settings__dot px-settings__dot--idle" />Up to date</>
            )}
          </div>
          <button type="button" className="px-settings__save" onClick={onSave}>
            {saved ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true"><path d="m4 12 5 5L20 6" /></svg>
            ) : null}
            {saved ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </header>

      <div className="px-settings__body">
        <aside className="px-settings__rail" aria-label="Settings sections">
          <p className="px-settings__rail-label">Sections</p>
          <nav className="px-settings__rail-nav">
            {SECTIONS.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`px-settings__rail-item${section === item.id ? ' is-active' : ''}`}
                onClick={() => setSection(item.id)}
                aria-pressed={section === item.id}
              >
                <Ico name={item.id} />
                <span className="px-settings__rail-text">{item.label}</span>
                <span className="px-settings__rail-badge">{counts[item.id]}</span>
              </button>
            ))}
          </nav>
          <div className="px-settings__rail-foot">
            <span className="px-settings__rail-foot-dot" />
            Changes apply to the next request. No restart, no dropped connections.
          </div>
        </aside>

        <section className="px-settings__panel" aria-label={`${active.label} settings`}>
          <div className="px-settings__panel-head">
            <div className="px-settings__panel-titles">
              <h2>{active.label}</h2>
              <p>
                {section === 'detection' && 'How the edge decides between blocking, flagging, and letting traffic through.'}
                {section === 'model' && 'The judge that scores every request after Coraza rules run.'}
                {section === 'integrations' && 'Where verdicts go and how machines authenticate to ModIntel.'}
                {section === 'notifications' && 'Who gets paged, on which channel, and at what severity.'}
                {section === 'team' && 'Who can open this dashboard and what they are allowed to do.'}
                {section === 'audit' && 'What is recorded, how long it is kept, and who can read it.'}
              </p>
            </div>
            <span className="px-settings__panel-note">config versioned in /etc/modintel</span>
          </div>

          <div className="px-settings__groups">
            {section === 'detection' && (
              <>
                <Group title="Blocking" desc="When Coraza and the judge agree, ModIntel can drop the request at the edge.">
                  <Row
                    label="Blocking mode"
                    hint="Return an error when both layers mark a request as an attack"
                    control={<Toggle on={toggles.block} onClick={toggle('block')} label="Blocking mode" />}
                  />
                  <Row
                    label="Block action"
                    hint="What the client sees when a request is dropped"
                    control={(
                      <Select
                        id="block-action"
                        value={selects.blockAction}
                        onChange={choose('blockAction')}
                        ariaLabel="Block action"
                        options={[['403', '403 · Reject'], ['429', '429 · Rate limit'], ['challenge', 'Challenge · JS']]}
                      />
                    )}
                  />
                  <Row
                    label="Layer 2 miss detection"
                    hint="Score requests that trip no Coraza rule at all"
                    control={<Toggle on={toggles.l2Miss} onClick={toggle('l2Miss')} label="Layer 2 miss detection" />}
                  />
                </Group>
                <Group title="Confidence" desc="How certain the judge must be before Layer 2 acts on a verdict.">
                  <Row
                    label="Confidence threshold"
                    hint="Requests below this score fall back to Coraza only"
                    control={(
                      <Select
                        id="confidence-threshold"
                        value={selects.threshold}
                        onChange={choose('threshold')}
                        ariaLabel="Confidence threshold"
                        options={[['85', '85%'], ['90', '90%'], ['94', '94%'], ['97', '97%']]}
                      />
                    )}
                  />
                  <Row
                    label="Auto-clear benign rule hits"
                    hint="Clear without analyst review above 90% confidence"
                    control={<Toggle on={toggles.autoClear} onClick={toggle('autoClear')} label="Auto-clear benign rule hits" />}
                  />
                  <Row
                    label="Paranoia level"
                    hint="CRS v4 anomaly scoring applied by Coraza"
                    control={(
                      <Select
                        id="paranoia"
                        value={selects.paranoia}
                        onChange={choose('paranoia')}
                        ariaLabel="Paranoia level"
                        options={[['p1', 'P1 · Minimal'], ['p2', 'P2 · Moderate'], ['p3', 'P3 · Strict'], ['p4', 'P4 · Paranoid']]}
                      />
                    )}
                  />
                  <Row
                    label="Store request payloads"
                    hint="Retained for analyst review and model training"
                    control={<Toggle on={toggles.payloads} onClick={toggle('payloads')} label="Store request payloads" />}
                  />
                </Group>
              </>
            )}

            {section === 'model' && (
              <>
                <Group title="Judge" desc="The model that scores every request after the Coraza verdict lands.">
                  <Row
                    label="Judge version"
                    hint="Challenger stays behind the current judge until validated"
                    control={(
                      <Select
                        id="judge-version"
                        value={selects.judge}
                        onChange={choose('judge')}
                        ariaLabel="Judge version"
                        options={[['v2.4', 'v2.4 · current'], ['v2.3', 'v2.3 · previous'], ['v2.5', 'v2.5 · challenger']]}
                      />
                    )}
                  />
                  <Row
                    label="Deployment"
                    hint="How a new judge reaches the edge"
                    control={(
                      <Select
                        id="deployment"
                        value={selects.deployment}
                        onChange={choose('deployment')}
                        ariaLabel="Deployment strategy"
                        options={[['rolling', 'Rolling · no downtime'], ['canary', 'Canary · 10% of traffic'], ['bluegreen', 'Blue green · instant cutover']]}
                      />
                    )}
                  />
                  <Row
                    label="Automatic rollback"
                    hint="Roll back if false positives regress on live traffic"
                    control={<Toggle on={toggles.rollback} onClick={toggle('rollback')} label="Automatic rollback" />}
                  />
                  <Row
                    label="Shadow mode"
                    hint="Score and log verdicts, never block"
                    control={<Toggle on={toggles.shadow} onClick={toggle('shadow')} label="Shadow mode" />}
                  />
                </Group>
                <Group title="Evaluation" desc="Held out validation split from the last reviewed export.">
                  <div className="px-settings__eval">
                    <div className="px-settings__eval-cell"><span>Accuracy</span><b>98.4%</b></div>
                    <div className="px-settings__eval-cell"><span>AUC</span><b>0.994</b></div>
                    <div className="px-settings__eval-cell"><span>False positives</span><b>0.8%</b></div>
                    <div className="px-settings__eval-cell"><span>Status</span><b className="px-settings__eval-good">Deployed</b></div>
                  </div>
                </Group>
              </>
            )}

            {section === 'integrations' && (
              <>
                <Group title="Slack" desc="Verdicts and P1 alerts are posted to this workspace channel.">
                  <Row
                    label="Slack integration"
                    hint="Post Layer 2 verdicts to #security-alerts"
                    control={<Toggle on={toggles.slack} onClick={toggle('slack')} label="Slack integration" />}
                  />
                  <div className="px-settings__row px-settings__row--stack">
                    <div className="px-settings__row-copy">
                      <span className="px-settings__row-label">Incoming webhook URL</span>
                      <em className="px-settings__row-hint">Created in Slack under Apps · Incoming Webhooks</em>
                    </div>
                    <input
                      type="text"
                      className="px-settings__input"
                      value={webhook}
                      onChange={editWebhook}
                      spellCheck="false"
                      autoComplete="off"
                      aria-label="Slack webhook URL"
                    />
                    <div className="px-settings__inline-foot">
                      <Select
                        id="notify-on"
                        value={selects.notifyOn}
                        onChange={choose('notifyOn')}
                        ariaLabel="Notify on"
                        options={[['p1', 'Notify on P1 only'], ['p12', 'Notify on P1 and P2'], ['all', 'Notify on all verdicts']]}
                      />
                      <button type="button" className="px-settings__btn" onClick={sendTest}>Send test</button>
                      {testSent && <span className="px-settings__test-note" role="status">Test posted to #security-alerts</span>}
                    </div>
                  </div>
                </Group>
                <Group title="API access" desc="Machine to machine access to the events and review API.">
                  <Row
                    label="Live API key"
                    hint="Scope the key before sharing it with a collector"
                    control={(
                      <Select
                        id="key-scope"
                        value={selects.scope}
                        onChange={choose('scope')}
                        ariaLabel="API key scope"
                        options={[['read', 'Read only'], ['readwrite', 'Read and write']]}
                      />
                    )}
                  />
                  <div className="px-settings__key-row">
                    <code className="px-settings__key">{revealed ? API_KEY : API_KEY_MASK}</code>
                    <button
                      type="button"
                      className="px-settings__icon-btn"
                      onClick={() => setRevealed((value) => !value)}
                      aria-label={revealed ? 'Hide API key' : 'Reveal API key'}
                      aria-pressed={revealed}
                    >
                      {revealed ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true">
                          <path d="M2 2l20 20" />
                          <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c7 0 11 7 11 7a17.6 17.6 0 0 1-3.2 4.1M6.6 6.6A17.3 17.3 0 0 0 1 12s4 7 11 7a10.8 10.8 0 0 0 5-1.2" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      className={`px-settings__icon-btn${copied ? ' is-done' : ''}`}
                      onClick={copyKey}
                      aria-label={copied ? 'API key copied' : 'Copy API key'}
                    >
                      {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true"><path d="m4 12 5 5L20 6" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true">
                          <rect x="9" y="9" width="12" height="12" rx="2" />
                          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                      )}
                    </button>
                  </div>
                </Group>
              </>
            )}

            {section === 'notifications' && (
              <>
                <Group title="Email" desc="SMTP is configured. Alert mail leaves from security@modintel.dev.">
                  <Row
                    label="Email on P1 alerts"
                    hint="security@modintel.dev · immediate"
                    control={<Toggle on={toggles.emailP1} onClick={toggle('emailP1')} label="Email on P1 alerts" />}
                  />
                  <Row
                    label="Email on P2 alerts"
                    hint="Batched and sent every 15 minutes"
                    control={<Toggle on={toggles.emailP2} onClick={toggle('emailP2')} label="Email on P2 alerts" />}
                  />
                </Group>
                <Group title="Slack" desc="Quiet by default. Only what needs a human answer is posted.">
                  <Row
                    label="Slack on P1 alerts"
                    hint="#security-alerts · with the verdict and the rule hit"
                    control={<Toggle on={toggles.slackP1} onClick={toggle('slackP1')} label="Slack on P1 alerts" />}
                  />
                  <Row
                    label="Weekly digest"
                    hint="Mondays · 09:00 UTC · detection and false positive summary"
                    control={<Toggle on={toggles.digest} onClick={toggle('digest')} label="Weekly digest" />}
                  />
                  <Row
                    label="Escalation"
                    hint="If nobody acknowledges a page within the window"
                    control={(
                      <Select
                        id="escalation"
                        value={selects.escalation}
                        onChange={choose('escalation')}
                        ariaLabel="Escalation window"
                        options={[['page', 'Page after 5 min'], ['page15', 'Page after 15 min'], ['never', 'Never escalate']]}
                      />
                    )}
                  />
                </Group>
              </>
            )}

            {section === 'team' && (
              <>
                <Group title="Members" desc="4 people can open this instance. Roles are enforced at the edge.">
                  {MEMBERS.map((member) => (
                    <div className="px-settings__member" key={member.email}>
                      <span className={`px-settings__avatar px-settings__avatar--${member.tone}`}>{member.initials}</span>
                      <span className="px-settings__member-copy">
                        <b>{member.name}</b>
                        <em>{member.email}</em>
                      </span>
                      <span className={`px-settings__presence${member.active ? ' is-active' : ''}`} aria-hidden="true" />
                      <span className="px-settings__role">{member.role}</span>
                    </div>
                  ))}
                </Group>
                <Group title="Access policy" desc="Applies to every member of this instance, including admins.">
                  <Row
                    label="Require 2FA for all members"
                    hint="TOTP or WebAuthn, enforced at sign in"
                    control={<Toggle on={toggles.twofa} onClick={toggle('twofa')} label="Require 2FA for all members" />}
                  />
                  <Row
                    label="Enforce SSO"
                    hint="Password sign in is disabled for everyone"
                    control={<Toggle on={toggles.sso} onClick={toggle('sso')} label="Enforce SSO" />}
                  />
                </Group>
              </>
            )}

            {section === 'audit' && (
              <>
                <Group title="Retention" desc="Events, verdicts, and admin actions are kept for this long.">
                  <Row
                    label="Audit log retention"
                    hint="Older entries are purged on a nightly job"
                    control={(
                      <Select
                        id="retention"
                        value={selects.retention}
                        onChange={choose('retention')}
                        ariaLabel="Audit log retention"
                        options={[['30', '30 days'], ['90', '90 days'], ['365', '365 days']]}
                      />
                    )}
                  />
                  <Row
                    label="Tamper-evident log"
                    hint="Hash chained entries, sealed every hour"
                    control={<Toggle on={toggles.tamper} onClick={toggle('tamper')} label="Tamper-evident log" />}
                  />
                  <Row
                    label="Record admin actions"
                    hint="Rule edits, settings changes, key rotation, purges"
                    control={<Toggle on={toggles.adminLog} onClick={toggle('adminLog')} label="Record admin actions" />}
                  />
                </Group>
                <div className="px-settings__danger">
                  <div className="px-settings__danger-head">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="px-settings__ico" aria-hidden="true">
                      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                      <path d="M12 9v4M12 17h.01" />
                    </svg>
                    <b>Danger zone</b>
                  </div>
                  <div className="px-settings__row px-settings__row--danger">
                    <div className="px-settings__row-copy">
                      <span className="px-settings__row-label">Purge audit log</span>
                      <em className="px-settings__row-hint">Deletes entries older than {selects.retention} days. Model training data is unaffected.</em>
                    </div>
                    <button
                      type="button"
                      className={`px-settings__btn-danger${purgeStep === 1 ? ' is-armed' : ''}`}
                      onClick={purge}
                      disabled={purgeStep === 2}
                    >
                      {purgeStep === 0 && 'Purge log'}
                      {purgeStep === 1 && 'Confirm purge'}
                      {purgeStep === 2 && 'Purged'}
                    </button>
                  </div>
                  {purgeStep === 2 && (
                    <p className="px-settings__danger-note" role="status">Audit log purged. 0 entries older than {selects.retention} days remain.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
