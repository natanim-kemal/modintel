import { useState } from 'react';
import './DatasetsPage.css';

const ICONS = {
  plus: 'M12 5v14M5 12h14',
  upload: 'M12 16V4m0 0-4 4m4-4 4 4M4 16v3h16v-3',
  close: 'M6 6l12 12M18 6 6 18',
};

const Icon = ({ name }) => (
  <svg className="px-datasets-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
);

const BASE_COLUMNS = [
  { name: 'request_id', type: 'string', sample: 'req_8f21c4' },
  { name: 'timestamp', type: 'timestamp', sample: '2026-11-18T09:41:08Z' },
  { name: 'client_ip', type: 'string', sample: '198.51.100.7' },
  { name: 'method', type: 'category', sample: 'GET' },
  { name: 'uri', type: 'string', sample: '/search?q=%27+OR+1%3D1--' },
  { name: 'anomaly_score', type: 'int16', sample: '32' },
  { name: 'label', type: 'category', sample: 'attack' },
];

const LITE_COLUMNS = [
  { name: 'sample_id', type: 'string', sample: 'val_000412' },
  { name: 'uri', type: 'string', sample: '/api/checkout' },
  { name: 'features', type: 'vector[32]', sample: '0.18, 0.72, 0.04' },
  { name: 'label', type: 'category', sample: 'benign' },
];

const SPLITS = [
  { id: '70/15/15', train: 70, val: 15, test: 15 },
  { id: '80/10/10', train: 80, val: 10, test: 10 },
  { id: '60/20/20', train: 60, val: 20, test: 20 },
];

const DATASETS = [
  { name: 'balanced_5k_5k.parquet', rows: 10000, attacks: 50, size: '4.2 MB', state: 'Training', created: '2026-10-14', columns: BASE_COLUMNS },
  { name: 'waf_dataset_v3.parquet', rows: 128400, attacks: 47, size: '38.6 MB', state: 'Training', created: '2026-10-22', columns: BASE_COLUMNS },
  { name: 'reviewed_export_2026.parquet', rows: 1248, attacks: 61, size: '1.1 MB', state: 'Reviewed', created: '2026-11-02', columns: BASE_COLUMNS },
  { name: 'val_distill.jsonl', rows: 6000, attacks: 48, size: '2.8 MB', state: 'Validation', created: '2026-11-09', columns: LITE_COLUMNS },
  { name: 'train_100k_100k.parquet', rows: 200000, attacks: 50, size: '61.3 MB', state: 'Archived', created: '2026-09-30', columns: BASE_COLUMNS },
];

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState(DATASETS);
  const [selected, setSelected] = useState(0);
  const [splitId, setSplitId] = useState(SPLITS[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const active = datasets[selected] || datasets[0];
  const split = SPLITS.find((item) => item.id === splitId) || SPLITS[0];
  const splitRows = [
    { label: 'Train', value: split.train },
    { label: 'Validation', value: split.val },
    { label: 'Test', value: split.test },
  ];

  const closeModal = () => {
    setModalOpen(false);
    setFileName('');
  };

  const importDataset = () => {
    if (!fileName) return;
    const next = {
      name: fileName,
      rows: 2500,
      attacks: 52,
      size: '1.2 MB',
      state: 'Pending',
      created: '2026-11-18',
      columns: BASE_COLUMNS,
    };
    setDatasets([...datasets, next]);
    setSelected(datasets.length);
    closeModal();
  };

  const pickFile = (file) => {
    if (file) setFileName(file.name);
  };

  const onDrop = (event) => {
    event.preventDefault();
    pickFile(event.dataTransfer.files && event.dataTransfer.files[0]);
  };

  return (
    <div className="px-datasets">
      <header className="px-datasets-header">
        <div className="px-datasets-header-copy">
          <div className="px-datasets-eyebrow">Data Management</div>
          <h1 className="px-datasets-title">Datasets</h1>
          <p className="px-datasets-sub">Manage and generate datasets for ML model training.</p>
        </div>
        <button type="button" className="px-datasets-import" onClick={() => setModalOpen(true)} aria-label="Import dataset">
          <Icon name="plus" /> Import dataset
        </button>
      </header>

      <div className="px-datasets-body">
        <aside className="px-datasets-list" aria-label="Dataset library">
          <div className="px-datasets-list-head">
            <span>Active datasets</span>
            <span className="px-datasets-list-count">{String(datasets.length).padStart(2, '0')}</span>
          </div>
          {datasets.map((dataset, index) => (
            <button
              type="button"
              key={dataset.name}
              className={`px-datasets-item${index === selected ? ' is-active' : ''}`}
              onClick={() => setSelected(index)}
              aria-pressed={index === selected}
              aria-label={`Select dataset ${dataset.name}`}
            >
              <span className="px-datasets-item-top">
                <span className="px-datasets-item-name">{dataset.name}</span>
                <span className="px-datasets-item-state">{dataset.state}</span>
              </span>
              <span className="px-datasets-item-mid">
                <span><b>{dataset.rows.toLocaleString('en-US')}</b> rows</span>
                <span><b>{dataset.attacks}% / {100 - dataset.attacks}%</b> balance</span>
              </span>
              <span className="px-datasets-mini" aria-hidden="true"><span style={{ width: `${dataset.attacks}%` }} /></span>
            </button>
          ))}
          <div className="px-datasets-list-foot">
            Target ratio for balancing: <strong>60/40</strong> attack to benign, using reviewed 200-status traffic.
          </div>
        </aside>

        <section className="px-datasets-detail" aria-label="Dataset detail">
          <div className="px-datasets-detail-head">
            <div className="px-datasets-detail-copy">
              <div className="px-datasets-eyebrow">Dataset detail</div>
              <h2 className="px-datasets-detail-name">{active.name}</h2>
            </div>
            <span className="px-datasets-state">{active.state}</span>
          </div>

          <div className="px-datasets-summary">
            <div className="px-datasets-stat is-key"><span>Rows</span><strong>{active.rows.toLocaleString('en-US')}</strong></div>
            <div className="px-datasets-stat"><span>Columns</span><strong>{String(active.columns.length).padStart(2, '0')}</strong></div>
            <div className="px-datasets-stat"><span>Attack share</span><strong>{active.attacks}%</strong></div>
            <div className="px-datasets-stat"><span>Created</span><strong>{active.created}</strong></div>
          </div>

          <div className="px-datasets-detail-grid">
            <div className="px-datasets-panel px-datasets-balance">
              <div className="px-datasets-panel-head">
                <b>Class balance</b>
                <span>{active.size}</span>
              </div>
              <div className="px-datasets-bar" aria-hidden="true">
                <span style={{ width: `${active.attacks}%` }} />
                <em style={{ width: `${100 - active.attacks}%` }} />
              </div>
              <div className="px-datasets-legend">
                <span><i /> Attack <b>{active.attacks}%</b></span>
                <span><i /> Benign <b>{100 - active.attacks}%</b></span>
              </div>
            </div>

            <div className="px-datasets-panel px-datasets-split">
              <div className="px-datasets-panel-head">
                <b>Train / validation split</b>
                <div className="px-datasets-seg">
                  {SPLITS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      className={item.id === split.id ? 'is-on' : ''}
                      onClick={() => setSplitId(item.id)}
                      aria-pressed={item.id === split.id}
                    >
                      {item.id}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-datasets-split-rows">
                {splitRows.map((row) => (
                  <div className="px-datasets-split-row" key={row.label}>
                    <span>{row.label}</span>
                    <div className="px-datasets-split-track" aria-hidden="true"><i style={{ width: `${row.value}%` }} /></div>
                    <strong>{row.value}%</strong>
                  </div>
                ))}
              </div>
              <div className="px-datasets-split-note">
                Rows: {Math.round(active.rows * split.train / 100).toLocaleString('en-US')} / {Math.round(active.rows * split.val / 100).toLocaleString('en-US')} / {Math.round(active.rows * split.test / 100).toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <div className="px-datasets-panel px-datasets-columns">
            <div className="px-datasets-panel-head">
              <b>Column preview</b>
              <span>{active.columns.length} fields</span>
            </div>
            <table className="px-datasets-table">
              <thead>
                <tr><th>Column</th><th>Type</th><th>Sample value</th></tr>
              </thead>
              <tbody>
                {active.columns.slice(0, 6).map((column) => (
                  <tr key={column.name}>
                    <td>{column.name}</td>
                    <td>{column.type}</td>
                    <td>{column.sample}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div className="px-datasets-modal" role="dialog" aria-modal="true" aria-labelledby="px-datasets-modal-title">
          <div className="px-datasets-backdrop" onClick={closeModal} aria-hidden="true" />
          <div className="px-datasets-card">
            <div className="px-datasets-card-head">
              <div>
                <div className="px-datasets-eyebrow">New data source</div>
                <h3 className="px-datasets-card-title" id="px-datasets-modal-title">Import dataset</h3>
              </div>
              <button type="button" className="px-datasets-icon-btn" onClick={closeModal} aria-label="Close import dialog">
                <Icon name="close" />
              </button>
            </div>
            <p className="px-datasets-card-desc">Upload a file to add it to the training library. Imported files are queued for schema review.</p>
            <label
              className={`px-datasets-drop${fileName ? ' is-filled' : ''}`}
              htmlFor="px-datasets-file"
              onDragOver={(event) => event.preventDefault()}
              onDrop={onDrop}
            >
              <Icon name="upload" />
              <strong>{fileName || 'Drop a file here or click to browse'}</strong>
              <span>CSV, Parquet or JSONL, up to 200 MB</span>
              <input
                id="px-datasets-file"
                type="file"
                accept=".csv,.parquet,.jsonl"
                aria-label="Choose a dataset file"
                onChange={(event) => pickFile(event.target.files && event.target.files[0])}
              />
            </label>
            <div className="px-datasets-card-actions">
              <button type="button" className="px-datasets-btn px-datasets-btn-ghost" onClick={closeModal}>Cancel</button>
              <button type="button" className="px-datasets-btn px-datasets-btn-primary" onClick={importDataset} disabled={!fileName}>Import dataset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsPage;
