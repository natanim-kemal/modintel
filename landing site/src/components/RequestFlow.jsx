import { useEffect, useRef, useState } from 'react';
import './RequestFlow.css';

const STEP_MS = 900;
const HOLD_MS = 2800;
const LAST_PHASE = 4;

const DASHBOARD_TABS = ['Events', 'Rules', 'Training', 'Datasets', 'Reports', 'Monitor', 'Settings'];

const SCENARIOS = [
    {
        id: 'sqli',
        label: 'SQL injection',
        shortLabel: 'SQLi',
        method: 'GET',
        path: "/products?q=' OR 1=1--",
        score: '42',
        rules: ['942100', '942110'],
        extraRules: 2,
        ai: '90.6%',
        confidence: '55%',
        priority: 'P1',
        verdict: 'blocked',
        verdictLabel: 'Blocked',
        decidedBy: 'Layer 1',
        verdictMeta: 'request rejected',
        verdictDetail: 'Blocked at Layer 1 · request never reached the application',
        mlSkipped: true,
        srSummary: 'Rules matched and blocked the request at Layer 1.',
    },
    {
        id: 'xss',
        label: 'Double-encoded XSS',
        shortLabel: 'XSS',
        method: 'GET',
        path: '/rest/products/search?q=%253Cscript%253Ealert(1)%253C%2Fscript%253E',
        score: '—',
        rules: [],
        extraRules: 0,
        ai: '94.4%',
        confidence: '69%',
        priority: 'P1',
        verdict: 'review',
        verdictLabel: 'Review',
        decidedBy: 'Human review',
        verdictMeta: 'analyst queue · 33 pending',
        verdictDetail: 'Queued for analyst review · 33 pending',
        mlSkipped: false,
        srSummary: 'No rule matched. Layer 2 flagged the request for analyst review.',
    },
    {
        id: 'benign',
        label: 'Benign quote',
        shortLabel: 'Benign',
        method: 'GET',
        path: '/search?q="smart" tv',
        score: '12',
        rules: ['942100'],
        extraRules: 0,
        ai: '8.0%',
        confidence: '91%',
        priority: 'P3',
        verdict: 'allowed',
        verdictLabel: 'Allowed',
        decidedBy: 'Layer 2',
        verdictMeta: 'false positive cleared',
        verdictDetail: 'False positive cleared · request forwarded to the application',
        mlSkipped: false,
        srSummary: 'A rule fired, Layer 2 cleared it as benign, and the request was allowed.',
    },
];

const EVENT_ROWS = [
    {
        id: 'cart',
        path: '/api/cart?item=42',
        score: '3',
        rules: [],
        ai: '4.1%',
        confidence: '96%',
        priority: 'P3',
        verdict: 'allowed',
        verdictLabel: 'Allowed',
    },
    {
        id: 'traversal',
        path: '/api/users/../../etc/passwd',
        score: '15',
        rules: ['930100'],
        ai: '71.3%',
        confidence: '62%',
        priority: 'P2',
        verdict: 'review',
        verdictLabel: 'Review',
    },
    {
        id: 'config',
        path: '/admin/config.php?cmd=cat%20%2Fetc%2Fpasswd',
        score: '38',
        rules: ['930120'],
        ai: '97.2%',
        confidence: '84%',
        priority: 'P1',
        verdict: 'blocked',
        verdictLabel: 'Blocked',
    },
];

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function stageState(index, phase) {
    if (phase > index) return 'is-done';
    if (phase === index) return 'is-active';
    return 'is-pending';
}

function VerdictIcon({ verdict }) {
    if (verdict === 'allowed') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 12.2l3 3 6-6.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    if (verdict === 'review') {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7.2v6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16.8" r="1" fill="currentColor" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function FlowLink({ state }) {
    return (
        <span className={`rf-link${state ? ` is-${state}` : ''}`} aria-hidden="true">
            <svg viewBox="0 0 32 12" preserveAspectRatio="none">
                <path className="rf-link-line" d="M0 6h25" vectorEffect="non-scaling-stroke" />
                <path className="rf-link-arrow" d="M22 1.5 27 6l-5 4.5" vectorEffect="non-scaling-stroke" />
            </svg>
        </span>
    );
}

const RequestFlow = () => {
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [phase, setPhase] = useState(0);
    const [pinned, setPinned] = useState(false);
    const [hoverStage, setHoverStage] = useState(null);
    const [hoverPaused, setHoverPaused] = useState(false);
    const [focusPaused, setFocusPaused] = useState(false);
    const [inView, setInView] = useState(true);
    const [docHidden, setDocHidden] = useState(() => typeof document !== 'undefined' && document.hidden);
    const [reduced, setReduced] = useState(prefersReducedMotion);

    const figureRef = useRef(null);
    const tabRefs = useRef([]);

    const scenario = SCENARIOS[scenarioIndex];
    const shownPhase = reduced ? LAST_PHASE : phase;
    const paused = (hoverPaused || focusPaused) && !pinned;

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event) => setReduced(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        const node = figureRef.current;
        if (!node || typeof IntersectionObserver === 'undefined') return undefined;

        const observer = new IntersectionObserver(
            (entries) => setInView(entries[0]?.isIntersecting ?? true),
            { threshold: 0.2 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onVisibilityChange = () => setDocHidden(document.hidden);
        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    }, []);

    useEffect(() => {
        if (reduced || paused || !inView || docHidden) return undefined;

        const settled = phase >= LAST_PHASE;
        if (settled && pinned) return undefined;

        const delay = settled ? HOLD_MS : STEP_MS;
        const timer = window.setTimeout(() => {
            if (settled) {
                setPinned(false);
                setScenarioIndex((current) => (current + 1) % SCENARIOS.length);
                setPhase(0);
            } else {
                setPhase((current) => (current === 1 && scenario.mlSkipped ? 3 : current + 1));
            }
        }, delay);

        return () => window.clearTimeout(timer);
    }, [phase, pinned, paused, inView, docHidden, reduced, scenario.mlSkipped]);

    const selectScenario = (index) => {
        setScenarioIndex(index);
        setPhase(0);
        setPinned(true);
        setHoverStage(null);
    };

    const handleTabKeyDown = (event, index) => {
        let nextIndex;

        if (event.key === 'ArrowRight') nextIndex = (index + 1) % SCENARIOS.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + SCENARIOS.length) % SCENARIOS.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = SCENARIOS.length - 1;
        else return;

        event.preventDefault();
        tabRefs.current[nextIndex]?.focus();
        selectScenario(nextIndex);
    };

    const handlePointerEnter = (event) => {
        if (event.pointerType === 'mouse') setHoverPaused(true);
    };

    const handlePointerLeave = () => setHoverPaused(false);

    const handleFocus = () => setFocusPaused(true);

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
    };

    const stageHoverProps = (index) => ({
        onPointerEnter: (event) => {
            if (event.pointerType !== 'touch') setHoverStage(index);
        },
        onPointerLeave: (event) => {
            if (event.pointerType !== 'touch') {
                setHoverStage((current) => (current === index ? null : current));
            }
        },
    });

    const rulesMatched = scenario.rules.length + scenario.extraRules;
    const layer1Detail = scenario.rules.length
        ? `${rulesMatched > 1 ? 'Rules' : 'Rule'} ${scenario.rules.join(', ')}${scenario.extraRules ? ` +${scenario.extraRules} more` : ''} matched · anomaly score ${scenario.score}`
        : 'No CRS signature matched · anomaly score under the blocking threshold';

    const stageDetails = [
        {
            key: 'Request',
            text: `${scenario.method} ${scenario.path}`,
        },
        {
            key: 'Layer 1',
            text: layer1Detail,
        },
        {
            key: 'Layer 2',
            text: scenario.mlSkipped
                ? 'Skipped · request already resolved at Layer 1'
                : `Attack probability ${scenario.ai} · confidence ${scenario.confidence}`,
        },
        {
            key: 'Verdict',
            text: scenario.verdictDetail,
        },
    ];

    const detail = hoverStage !== null
        ? stageDetails[hoverStage]
        : shownPhase >= LAST_PHASE
            ? { key: 'Event appended', text: `${scenario.verdictLabel} · ${scenario.path}` }
            : stageDetails[shownPhase];

    const scoreShown = shownPhase >= 1 ? scenario.score : '—';
    const aiShown = shownPhase >= 2 ? scenario.ai : '—';
    const confidenceShown = shownPhase >= 2 ? scenario.confidence : '—';
    const priorityShown = shownPhase >= 1 ? scenario.priority : '—';
    const statusShown = shownPhase >= 3
        ? scenario.verdictLabel
        : shownPhase >= 2
            ? (scenario.mlSkipped ? 'Blocked' : 'Judging')
            : shownPhase >= 1
                ? 'Layer 1'
                : 'Received';

    const firstLinkState = shownPhase > 1 ? 'done' : shownPhase === 1 ? 'active' : '';
    const secondLinkState = shownPhase > 2 ? 'done' : shownPhase === 2 ? 'active' : '';
    const thirdLinkState = shownPhase > 3 ? 'done' : shownPhase === 3 ? 'active' : '';

    const mlState = scenario.mlSkipped
        ? (shownPhase > 2 ? 'is-done is-skipped' : 'is-pending is-skipped')
        : stageState(2, shownPhase);

    return (
        <figure
            ref={figureRef}
            className={`request-flow verdict-${scenario.verdict}`}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocusCapture={handleFocus}
            onBlurCapture={handleBlur}
            aria-label="Interactive diagram of a request moving through the ModIntel detection pipeline"
        >
            <header className="rf-chrome">
                <div className="rf-brand">
                    <svg className="rf-mark" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="rf-brand-name">MODINTEL</span>
                </div>

                <nav className="rf-tabs" aria-hidden="true">
                    {DASHBOARD_TABS.map((tab) => (
                        <span key={tab} className={`rf-tab${tab === 'Events' ? ' is-active' : ''}`}>
                            {tab}
                        </span>
                    ))}
                </nav>
            </header>

            <div className="rf-body">
                <div className="rf-toolbar">
                    <div className="rf-stats" role="group" aria-label="Detection totals">
                        <span className="rf-stat">
                            <span>Total alerts</span>
                            <b>4,024</b>
                        </span>
                        <span className="rf-stat">
                            <span>Layer 1</span>
                            <b>3,991</b>
                        </span>
                        <span className="rf-stat">
                            <span>Layer 2</span>
                            <b>33</b>
                        </span>
                    </div>

                    <div className="rf-scenarios" role="tablist" aria-label="Example requests">
                        {SCENARIOS.map((item, index) => (
                            <button
                                key={item.id}
                                ref={(node) => { tabRefs.current[index] = node; }}
                                type="button"
                                role="tab"
                                id={`rf-tab-${item.id}`}
                                aria-selected={index === scenarioIndex}
                                aria-controls="rf-flow-panel"
                                aria-label={`${item.label}: ${item.verdictLabel.toLowerCase()}`}
                                tabIndex={index === scenarioIndex ? 0 : -1}
                                className={`rf-scenario verdict-${item.verdict}${index === scenarioIndex ? ' is-active' : ''}`}
                                onClick={() => selectScenario(index)}
                                onKeyDown={(event) => handleTabKeyDown(event, index)}
                            >
                                <span className="rf-scenario-label">{item.label}</span>
                                <span className="rf-scenario-short">{item.shortLabel}</span>
                                <span className="rf-scenario-verdict">{item.verdictLabel}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div
                    className="rf-flow"
                    id="rf-flow-panel"
                    role="tabpanel"
                    aria-labelledby={`rf-tab-${scenario.id}`}
                    tabIndex={0}
                >
                    <div className="rf-stages">
                        <div className={`rf-stage rf-request ${stageState(0, shownPhase)}`} {...stageHoverProps(0)}>
                            <div className="rf-stage-head">
                                <span className="rf-stage-kicker">Request</span>
                            </div>
                            <div className="rf-request-line">
                                <span className="rf-method">{scenario.method}</span>
                                <span className="rf-path" title={scenario.path}>{scenario.path}</span>
                            </div>
                        </div>

                        <FlowLink state={firstLinkState} />

                        <div className={`rf-stage rf-rules ${stageState(1, shownPhase)}`} {...stageHoverProps(1)}>
                            <div className="rf-stage-head">
                                <span className="rf-stage-kicker">Layer 1</span>
                            </div>
                            <span className="rf-stage-title">Coraza + CRS</span>
                            <div className="rf-rules">
                                {scenario.rules.length ? (
                                    <>
                                        {scenario.rules.map((rule) => (
                                            <span className="rf-rule" key={rule}>{rule}</span>
                                        ))}
                                        {scenario.extraRules > 0 && (
                                            <span className="rf-rule rf-rule-more">+{scenario.extraRules}</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="rf-no-match">no match</span>
                                )}
                            </div>
                            <div className="rf-stage-foot">
                                <span>Anomaly score</span>
                                <b>{scenario.score}</b>
                            </div>
                        </div>

                        <FlowLink state={secondLinkState} />

                        <div className={`rf-stage rf-ml ${mlState}`} {...stageHoverProps(2)}>
                            <div className="rf-stage-head">
                                <span className="rf-stage-kicker">Layer 2</span>
                            </div>
                            {scenario.mlSkipped ? (
                                <div className="rf-skip">
                                    <b>SKIPPED</b>
                                    <small>Resolved at Layer 1</small>
                                </div>
                            ) : (
                                <>
                                    <div className="rf-ml-top">
                                        <b className="rf-ml-prob">{scenario.ai}</b>
                                        <span className="rf-ml-label">attack prob</span>
                                    </div>
                                    <div className="rf-meter">
                                        <span style={{ width: shownPhase >= 2 ? scenario.ai : '0%' }} />
                                    </div>
                                    <div className="rf-stage-foot">
                                        <span>Confidence</span>
                                        <b>{scenario.confidence}</b>
                                    </div>
                                </>
                            )}
                        </div>

                        <FlowLink state={thirdLinkState} />

                        <div className={`rf-stage rf-outcome ${stageState(3, shownPhase)}`} {...stageHoverProps(3)}>
                            <div className="rf-stage-head">
                                <span className="rf-stage-kicker">Verdict</span>
                            </div>
                            <div className="rf-verdict">
                                <VerdictIcon verdict={scenario.verdict} />
                                <b>{scenario.verdictLabel}</b>
                            </div>
                            <div className="rf-stage-foot">
                                <span>{scenario.verdictMeta}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rf-detail">
                        <span className="rf-detail-key">{detail.key}</span>
                        <span className="rf-detail-text">{detail.text}</span>
                    </div>
                </div>

                <div className="rf-feed">
                    <div className="rf-feed-head">
                        <span className="rf-feed-title">Event stream</span>
                    </div>

                    <div className="rf-table" role="table" aria-label="Detection stream event">
                        <div className="rf-row rf-row-head" role="row">
                            <span role="columnheader">URI</span>
                            <span role="columnheader">Score</span>
                            <span role="columnheader">Triggered rules</span>
                            <span role="columnheader">AI prob</span>
                            <span role="columnheader">Conf</span>
                            <span role="columnheader">Priority</span>
                            <span role="columnheader">Status</span>
                        </div>

                        {EVENT_ROWS.map((event) => (
                            <div key={event.id} className={`rf-row rf-row-event verdict-${event.verdict}`} role="row">
                                <span className="rf-cell rf-cell-uri" role="cell">
                                    <span className="rf-uri-text" title={event.path}>{event.path}</span>
                                    <span className="rf-uri-pop">{event.path}</span>
                                </span>
                                <span className="rf-cell rf-cell-score" role="cell">{event.score}</span>
                                <span className="rf-cell rf-cell-rules" role="cell">
                                    {event.rules.length ? (
                                        event.rules.map((rule) => (
                                            <span className="rf-rule" key={rule}>{rule}</span>
                                        ))
                                    ) : (
                                        <span className="rf-dim">none</span>
                                    )}
                                </span>
                                <span className="rf-cell rf-cell-ai" role="cell">{event.ai}</span>
                                <span className="rf-cell rf-cell-conf" role="cell">{event.confidence}</span>
                                <span className={`rf-cell rf-cell-priority rf-${event.priority.toLowerCase()}`} role="cell">{event.priority}</span>
                                <span className="rf-cell" role="cell">
                                    <span className="rf-status is-final">{event.verdictLabel}</span>
                                </span>
                            </div>
                        ))}

                        <div
                            key={scenario.id}
                            className={`rf-row rf-row-event${shownPhase >= LAST_PHASE ? ' is-settled' : ''}`}
                            role="row"
                        >
                            <span className="rf-cell rf-cell-uri" role="cell">
                                <span className="rf-uri-text" title={scenario.path}>{scenario.path}</span>
                                <span className="rf-uri-pop">{scenario.path}</span>
                            </span>
                            <span className="rf-cell rf-cell-score" role="cell">{scoreShown}</span>
                            <span className="rf-cell rf-cell-rules" role="cell">
                                {shownPhase < 1 ? (
                                    <span className="rf-dim">—</span>
                                ) : scenario.rules.length ? (
                                    <>
                                        {scenario.rules.map((rule) => (
                                            <span className="rf-rule" key={rule}>{rule}</span>
                                        ))}
                                        {scenario.extraRules > 0 && (
                                            <span className="rf-rule rf-rule-more">+{scenario.extraRules}</span>
                                        )}
                                    </>
                                ) : (
                                    <span className="rf-dim">none</span>
                                )}
                            </span>
                            <span className="rf-cell rf-cell-ai" role="cell">{aiShown}</span>
                            <span className="rf-cell rf-cell-conf" role="cell">{confidenceShown}</span>
                            <span className={`rf-cell rf-cell-priority${priorityShown === '—' ? '' : ` rf-${priorityShown.toLowerCase()}`}`} role="cell">{priorityShown}</span>
                            <span className="rf-cell" role="cell">
                                <span className={`rf-status${shownPhase >= 3 ? ' is-final' : ' is-pending'}`}>{statusShown}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="rf-sr-only" role="status" aria-live="polite" aria-atomic="true">
                {`${scenario.label}: ${scenario.srSummary}`}
            </p>
        </figure>
    );
};

export default RequestFlow;
