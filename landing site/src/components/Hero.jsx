import React from 'react';
import RequestFlow from './RequestFlow';
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
                    <RequestFlow />
                </div>
            </div>
        </section>
    );
};

export default Hero;
