import React from 'react';
import { FaShieldAlt, FaChartLine, FaCode, FaLock } from 'react-icons/fa';
import './Features.css';

const Features = () => {
    return (
        <section className="features-section" id="features">
            <div className="container">
                <div className="features-header">
                    <h2>Engineered for <span className="text-gradient">Security Excellence</span></h2>
                    <p>Upgrade your legacy WAF with state-of-the-art machine learning models that detect what rule-sets miss.</p>
                </div>

                <div className="bento-grid">
                    {/* Feature 1: Main Highlight (Span 2) */}
                    <div className="bento-card span-2">
                        <div className="card-glow"></div>
                        <div className="card-icon"><FaShieldAlt /></div>
                        <h3>Adaptive Threat Detection</h3>
                        <p>Signature WAFs fire on patterns, not intent. ModIntel scores each request with a model trained on WAF audit data, so benign traffic that trips a rule can be cleared while missed variants still reach a reviewer.</p>
                    </div>

                    {/* Feature 2: Analytics (Moved here, Span 1) */}
                    <div className="bento-card span-1">
                        <div className="card-icon"><FaChartLine /></div>
                        <h3>Visual Analytics</h3>
                        <p>
                            See the attacks you stopped. Every alert, its triggered rules, and the model's score land in one dashboard.
                        </p>
                    </div>

                    {/* Feature 3: Privacy (Moved here, Span 1) */}
                    <div className="bento-card span-1">
                        <div className="card-icon"><FaLock /></div>
                        <h3>Privacy First</h3>
                        <p>
                            Data stays on your premise. Models run locally without sending sensitive payloads to the cloud.
                        </p>
                    </div>

                    {/* Feature 4: Integration (Span 2) */}
                    <div className="bento-card span-2">
                        <div className="card-glow" style={{ left: 0, right: 'auto', background: 'radial-gradient(circle, rgba(255, 87, 10, 0.2) 0%, transparent 70%)' }}></div>
                        <div className="card-icon"><FaCode /></div>
                        <h3>Drop-in Reverse Proxy</h3>
                        <p>
                            ModIntel sits in front of your existing stack and mirrors each request to the ML service.
                            Your application and rule set stay as they are.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
