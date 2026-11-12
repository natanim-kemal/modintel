import React from 'react';
import './CTA.css';

const CTA = () => {
    return (
        <section className="cta-section">
            <div className="container">
                <div className="cta-container">
                    <div className="cta-glow"></div>
                    <h2>Ready to Secure Your Infrastructure?</h2>
                    <p>
                        Reduce false positives and see every alert in one place.
                    </p>
                    <div className="cta-buttons">
                        <a href="https://github.com/modintel/modintel" className="btn-hero" target="_blank" rel="noreferrer">Get Started Now</a>
                        <a href="https://natanim.dev/blog" className="btn-hero-secondary" target="_blank" rel="noreferrer">Read the Docs</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
