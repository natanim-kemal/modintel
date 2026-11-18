import { useEffect, useState } from 'react';
import './TrainingPage.css';

const DATASETS = [
  { id: 'balanced', name: 'balanced_5k_5k.parquet', rows: '10,000', attacks: '50%', size: '4.2 MB', epochs: 12, lr: '3e-4', batch: 256, split: '80 / 10 / 10', eta: '~6 min', f1: '95.5%' },
  { id: 'v3', name: 'waf_dataset_v3.parquet', rows: '128,400', attacks: '47%', size: '38.6 MB', epochs: 8, lr: '2e-4', batch: 512, split: '85 / 7.5 / 7.5', eta: '~48 min', f1: '97.8%' },
  { id: 'reviewed', name: 'reviewed_export_2026.parquet', rows: '1,248', attacks: '61%', size: '1.1 MB', epochs: 20, lr: '5e-4', batch: 64, split: '70 / 15 / 15', eta: '~2 min', f1: '93.1%' },
  { id: 'distill', name: 'val_distill.jsonl', rows: '6,000', attacks: '48%', size: '2.8 MB', epochs: 10, lr: '4e-4', batch: 128, split: '80 / 10 / 10', eta: '~4 min', f1: '94.2%' },
  { id: 'full200', name: 'train_100k_100k.parquet', rows: '200,000', attacks: '50%', size: '61.3 MB', epochs: 6, lr: '1e-4', batch: 1024, split: '90 / 5 / 5', eta: '~74 min', f1: '98.1%' },
];

const INITIAL_RUNS = [
  { id: 'v2.4', date: 'Nov 16, 2026', acc: '98.4%', auc: '0.994', precision: '97.1%', recall: '96.8%', fpr: '0.8%', f1: '96.9%', state: 'Deployed', tp: 10164, fp: 84, fn: 336, tn: 10416, loss: [0.62, 0.48, 0.37, 0.29, 0.23, 0.19, 0.155, 0.128, 0.108, 0.094, 0.083, 0.074, 0.068, 0.063] },
  { id: 'v2.3', date: 'Nov 13, 2026', acc: '97.9%', auc: '0.991', precision: '96.4%', recall: '95.9%', fpr: '1.1%', f1: '96.1%', state: 'Archived', tp: 10012, fp: 121, fn: 402, tn: 10465, loss: [0.68, 0.53, 0.41, 0.33, 0.27, 0.225, 0.19, 0.164, 0.143, 0.126, 0.112, 0.101, 0.092, 0.086] },
  { id: 'v2.2', date: 'Nov 7, 2026', acc: '97.1%', auc: '0.987', precision: '95.2%', recall: '94.7%', fpr: '1.6%', f1: '95.0%', state: 'Archived', tp: 9890, fp: 158, fn: 470, tn: 10482, loss: [0.74, 0.59, 0.46, 0.375, 0.31, 0.262, 0.224, 0.195, 0.171, 0.152, 0.137, 0.124, 0.114, 0.105] },
  { id: 'v2.1', date: 'Oct 29, 2026', acc: '96.4%', auc: '0.981', precision: '94.0%', recall: '93.2%', fpr: '2.3%', f1: '93.6%', state: 'Archived', tp: 9754, fp: 193, fn: 528, tn: 10525, loss: [0.81, 0.66, 0.52, 0.425, 0.355, 0.302, 0.26, 0.228, 0.201, 0.179, 0.161, 0.146, 0.133, 0.122] },
];

const NEW_RUN_LOSS = [0.58, 0.44, 0.335, 0.26, 0.205, 0.165, 0.135, 0.112, 0.093, 0.079, 0.067, 0.058, 0.051, 0.045];

const ICON_PATHS = {
  play: 'M8 5l11 7-11 7z',
  database: 'M12 3c-4.97 0-9 1.34-9 3v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6c0-1.66-4.03-3-9-3zM3 12c0 1.66 4.03 3 9 3s9-1.34 9-3M3 6c0 1.66 4.03 3 9 3s9-1.34 9-3',
  layers: 'M4 7l8-4 8 4-8 4zM4 12l8 4 8-4M4 17l8 4 8-4',
  chart: 'M4 19h16M7 15l4-5 4 3 5-8',
  check: 'M4 12.5l5 5L20 6.5',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
};

const Icon = ({ name, size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const lossPoints = (loss) => {
  const max = Math.max(...loss);
  return loss.map((value, index) => {
    const x = (index / (loss.length - 1)) * 300;
    const y = 80 - (value / max) * 68;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
};

const TrainingPage = () => {
  const [datasetId, setDatasetId] = useState('balanced');
  const [runs, setRuns] = useState(INITIAL_RUNS);
  const [selectedId, setSelectedId] = useState('v2.4');
  const [trainState, setTrainState] = useState('idle');
  const [progress, setProgress] = useState(0);

  const dataset = DATASETS.find((item) => item.id === datasetId) || DATASETS[0];
  const selected = runs.find((run) => run.id === selectedId) || runs[runs.length - 1];
  const deployed = runs.find((run) => run.state === 'Deployed') || runs[0];
  const percent = Math.floor(Math.min(100, progress));
  const epoch = Math.min(dataset.epochs, Math.floor((progress / 100) * dataset.epochs) + 1);

  useEffect(() => {
    if (trainState !== 'running') return undefined;
    const timer = setInterval(() => {
      setProgress((value) => Math.min(100, value + 2.5 + Math.random() * 3.5));
    }, 90);
    return () => clearInterval(timer);
  }, [trainState]);

  useEffect(() => {
    if (trainState !== 'running' || progress < 100) return;
    const next = (runs.reduce((max, run) => Math.max(max, parseFloat(run.id.slice(1))), 0) + 0.1).toFixed(1);
    const fresh = {
      id: `v${next}`,
      date: 'Nov 18, 2026',
      acc: '98.6%',
      auc: '0.995',
      precision: '97.4%',
      recall: '97.1%',
      fpr: '0.7%',
      f1: '97.2%',
      state: 'Candidate',
      tp: 10203,
      fp: 71,
      fn: 298,
      tn: 10428,
      loss: NEW_RUN_LOSS,
    };
    setRuns((current) => (current.some((run) => run.id === fresh.id) ? current : [...current, fresh]));
    setSelectedId(fresh.id);
    setTrainState('done');
  }, [progress, trainState, runs]);

  const startTraining = () => {
    setProgress(0);
    setTrainState('running');
  };

  const selectRun = (id) => setSelectedId(id);
  const onRowKeyDown = (event, id) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectRun(id);
    }
  };

  const line = lossPoints(selected.loss);
  const area = `M0,84 L${line.replaceAll(' ', ' L')} L300,84 Z`;

  return (
    <div className="px-training">
      <header className="px-training-head">
        <div className="px-training-head-copy">
          <span className="px-training-eyebrow">Machine Learning</span>
          <h1 className="px-training-title">Training</h1>
          <p className="px-training-sub">Train and evaluate ML models for hybrid WAF detection. Runs stay local and read labeled parquet files only.</p>
        </div>
        <div className="px-training-head-actions">
          <div className="px-training-head-note">
            <span>Judge in production</span>
            <b>{deployed.id} · Deployed</b>
          </div>
          <button
            type="button"
            className="px-training-start"
            onClick={startTraining}
            disabled={trainState === 'running'}
            aria-label={trainState === 'running' ? `Training in progress, ${percent} percent` : trainState === 'done' ? 'Run training again' : 'Start training'}
          >
            <Icon name={trainState === 'done' ? 'check' : 'play'} size={13} />
            {trainState === 'running' ? `Training ${percent}%` : trainState === 'done' ? 'Run again' : 'Start training'}
          </button>
        </div>
      </header>

      <div className="px-training-body">
        <aside className="px-training-side">
          <section className="px-training-section">
            <div className="px-training-section-head">
              <Icon name="database" size={13} />
              <h2>Training dataset</h2>
            </div>
            <p className="px-training-section-desc">Layer 2 miss-detection model, trained on reviewed alerts from the review queue.</p>
            <label className="px-training-label" htmlFor="px-training-dataset">Dataset</label>
            <select
              id="px-training-dataset"
              className="px-training-select"
              value={datasetId}
              onChange={(event) => setDatasetId(event.target.value)}
              disabled={trainState === 'running'}
            >
              {DATASETS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <div className="px-training-dataset-meta">
              <div><span>Samples</span><b>{dataset.rows}</b></div>
              <div><span>Attacks</span><b>{dataset.attacks}</b></div>
              <div><span>Size</span><b>{dataset.size}</b></div>
            </div>
          </section>

          <section className="px-training-section">
            <div className="px-training-section-head">
              <Icon name="layers" size={13} />
              <h2>Hyperparameters</h2>
            </div>
            <div className="px-training-fields">
              <div className="px-training-field">
                <label htmlFor="px-training-epochs">Epochs</label>
                <input id="px-training-epochs" type="text" value={dataset.epochs} readOnly className="px-training-input" />
              </div>
              <div className="px-training-field">
                <label htmlFor="px-training-lr">Learning rate</label>
                <input id="px-training-lr" type="text" value={dataset.lr} readOnly className="px-training-input" />
              </div>
              <div className="px-training-field">
                <label htmlFor="px-training-batch">Batch size</label>
                <input id="px-training-batch" type="text" value={dataset.batch} readOnly className="px-training-input" />
              </div>
              <div className="px-training-field">
                <label htmlFor="px-training-split">Train / val / test</label>
                <input id="px-training-split" type="text" value={dataset.split} readOnly className="px-training-input" />
              </div>
            </div>
            <div className="px-training-estimate">
              <div><Icon name="clock" size={12} /><span>Est. duration</span><b>{dataset.eta}</b></div>
              <div><Icon name="chart" size={12} /><span>Expected F1</span><b>{dataset.f1}</b></div>
            </div>
          </section>

          <section className="px-training-section px-training-status" aria-live="polite">
            <div className="px-training-status-head">
              <span className="px-training-label">Run status</span>
              <span className={`px-training-state${trainState === 'running' ? ' is-running' : trainState === 'done' ? ' is-done' : ''}`}>
                {trainState === 'idle' ? 'Ready' : trainState === 'running' ? 'Training' : 'Complete'}
              </span>
            </div>
            <div
              className="px-training-progress"
              role="progressbar"
              aria-label="Training progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <i style={{ width: `${percent}%` }} />
            </div>
            <p className="px-training-status-note">
              {trainState === 'idle' && `Idle. Next run will train on ${dataset.name}.`}
              {trainState === 'running' && `Epoch ${epoch} of ${dataset.epochs} · ${percent}% · held out loss falling`}
              {trainState === 'done' && `v${(runs.reduce((max, run) => Math.max(max, parseFloat(run.id.slice(1))), 0)).toFixed(1)} finished · 98.6% validation accuracy · added to history`}
            </p>
          </section>

          <p className="px-training-foot-note">The judge runs locally. Training reads labeled parquet files and never uploads a payload.</p>
        </aside>

        <section className="px-training-main">
          <div className="px-training-quality">
            <div className="px-training-quality-head">
              <span className="px-training-overline">Model quality</span>
              <span className="px-training-run-chip">{selected.id} · Held out evaluation</span>
            </div>
            <div className="px-training-metrics">
              <div className="px-training-metric"><span>Accuracy</span><b>{selected.acc}</b></div>
              <div className="px-training-metric"><span>AUC</span><b>{selected.auc}</b></div>
              <div className="px-training-metric"><span>Precision</span><b>{selected.precision}</b></div>
              <div className="px-training-metric"><span>Recall</span><b>{selected.recall}</b></div>
              <div className="px-training-metric"><span>FPR</span><b className="is-key">{selected.fpr}</b></div>
              <div className="px-training-metric"><span>F1</span><b>{selected.f1}</b></div>
            </div>
            <div className="px-training-quality-bottom">
              <div className="px-training-matrix" aria-label={`Confusion matrix for ${selected.id}`}>
                <div className="px-training-matrix-cell is-good"><b>{selected.tp.toLocaleString()}</b><em>True positive</em></div>
                <div className="px-training-matrix-cell is-bad"><b>{selected.fp.toLocaleString()}</b><em>False positive</em></div>
                <div className="px-training-matrix-cell is-bad"><b>{selected.fn.toLocaleString()}</b><em>False negative</em></div>
                <div className="px-training-matrix-cell is-good"><b>{selected.tn.toLocaleString()}</b><em>True negative</em></div>
              </div>
              <div className="px-training-curve">
                <div className="px-training-curve-head">
                  <span>Training loss</span>
                  <b>{selected.loss[selected.loss.length - 1].toFixed(3)} final</b>
                </div>
                <svg className="px-training-curve-svg" viewBox="0 0 300 84" preserveAspectRatio="none" role="img" aria-label={`Loss curve for ${selected.id}, final loss ${selected.loss[selected.loss.length - 1].toFixed(3)}`}>
                  <line x1="0" y1="21" x2="300" y2="21" className="px-training-gridline" />
                  <line x1="0" y1="42" x2="300" y2="42" className="px-training-gridline" />
                  <line x1="0" y1="63" x2="300" y2="63" className="px-training-gridline" />
                  <path d={area} className="px-training-curve-area" />
                  <polyline points={line} className="px-training-curve-line" />
                </svg>
                <div className="px-training-curve-x"><span>Epoch 1</span><span>Epoch {Math.round(selected.loss.length / 2)}</span><span>Epoch {selected.loss.length}</span></div>
              </div>
            </div>
          </div>

          <div className="px-training-history">
            <div className="px-training-history-head">
              <span className="px-training-overline">Training runs</span>
              <span className="px-training-count">{runs.length} versions</span>
            </div>
            <table className="px-training-table">
              <thead>
                <tr>
                  <th scope="col">Version</th>
                  <th scope="col">Date</th>
                  <th scope="col">Accuracy</th>
                  <th scope="col">AUC</th>
                  <th scope="col">F1</th>
                  <th scope="col">State</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    className={selectedId === run.id ? 'is-selected' : ''}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selectedId === run.id}
                    aria-label={`Inspect run ${run.id}`}
                    onClick={() => selectRun(run.id)}
                    onKeyDown={(event) => onRowKeyDown(event, run.id)}
                  >
                    <td className="px-training-version">{run.id}</td>
                    <td className="px-training-date">{run.date}</td>
                    <td className="px-training-num">{run.acc}</td>
                    <td className="px-training-num">{run.auc}</td>
                    <td className="px-training-num">{run.f1}</td>
                    <td><span className={`px-training-chip${run.state === 'Deployed' ? ' is-deployed' : run.state === 'Candidate' ? ' is-candidate' : ''}`}>{run.state}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-training-history-foot">
              <span>Held out evaluation · 21,000 requests · balanced split</span>
              <span>Select a row to inspect that run</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainingPage;
