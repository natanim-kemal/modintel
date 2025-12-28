import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />

      {/* Coming Soon Section */}
      <div style={{
        padding: '100px 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '-1px',
        background: 'var(--bg-dark-accent)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '16px',
          fontWeight: '600'
        }}> More to come </h2>
        <p style={{ color: 'var(--text-gray)' }}>We are building the future of WAF intelligence.</p>
      </div>
    </div>
  );
}

export default App;
