import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero mt-10">
            <div className="bg-grid"></div>
            <div className="hero-glow"></div>

            <div className="container hero-content">
                <h1>
                    Securing Web Apps with <br />
                    <span className="text-gradient">Intelligent Precision</span>
                </h1>

                <p className="subtitle">
                    ModIntel augments ModSecurity with real-time ML threat detection.
                    Reduce false positives and visualize attacks instantly.
                </p>

                <div className="hero-actions">
                    <button className="btn-hero">Sponsor Us</button>
                    <button className="btn-hero-secondary">View Documentation</button>
                </div>

                <div className="hero-visual">
                    <div className="code-mockup">
                        <p><span style={{ color: '#cc7832' }}>def</span> <span style={{ color: '#ffc66d' }}>analyze_request</span>(req):</p>
                        <p>&nbsp;&nbsp;confidence = model.predict(req.payload)</p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#cc7832' }}>if</span> confidence {'>'} <span style={{ color: '#6897bb' }}>0.95</span>:</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;firewall.block(req.ip)</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}># Threat neutralized in 12ms</span></p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#cc7832' }}>return</span> True <span className="cursor"></span></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
