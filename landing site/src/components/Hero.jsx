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
                    ModIntel augments Coraza with machine learning, cutting false positives
                    and surfacing the attacks rules miss.
                </p>

                <div className="hero-actions">
                    <a href="https://github.com/sponsors/modintel" className="btn-hero" target="_blank" rel="noreferrer">Sponsor Us</a>
                    <a href="https://natanim.dev/blog" className="btn-hero-secondary" target="_blank" rel="noreferrer">View Documentation</a>
                </div>

                <div className="hero-visual">
                    <div className="code-mockup">
                        <p><span style={{ color: '#cc7832' }}>def</span> <span style={{ color: '#ffc66d' }}>analyze_request</span>(req):</p>
                        <p>&nbsp;&nbsp;confidence = model.predict(req.payload)</p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#cc7832' }}>if</span> confidence {'>'} <span style={{ color: '#6897bb' }}>0.95</span>:</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;review.queue(req.id)</p>
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#808080' }}># flagged for a human, never auto-blocked</span></p>
                        <p>&nbsp;&nbsp;<span style={{ color: '#cc7832' }}>return</span> True <span className="cursor"></span></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
