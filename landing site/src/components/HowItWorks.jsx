import React from 'react';
import { FaServer, FaBrain, FaFilter, FaChartPie } from 'react-icons/fa';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaServer />,
            title: "Traffic Ingestion",
            desc: "ModSecurity intercepts incoming web requests at the ingress layer. No changes to your DNS or infrastructure required."
        },
        {
            icon: <FaBrain />,
            title: "Parallel Analysis",
            desc: "Request payloads are asynchronously sent to ModIntel's local ML engine for deep-learning inspection in under 5ms."
        },
        {
            icon: <FaFilter />,
            title: "Smart Decision",
            desc: "The model distinguishes between true attacks and benign anomalies, reducing false positives by up to 66%."
        },
        {
            icon: <FaChartPie />,
            title: "Visual Triage",
            desc: "Admins receive real-time alerts in a visual dashboard, replacing tedious log file analysis."
        }
    ];

    return (
        <section className="how-it-works" id="how-it-works">
            <div className="container">
                <div className="how-header">
                    <h2>The <span className="text-gradient">Intelligent Pipeline</span></h2>
                    <p>Designed for performance. ModIntel processes traffic alongside your WAF without introducing latency bottlenecks.</p>
                </div>

                <div className="pipeline-container">
                    {steps.map((step, index) => (
                        <div className="step-card" key={index}>
                            <div className="step-icon-wrapper">
                                {step.icon}
                                <div className="step-number">{index + 1}</div>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
