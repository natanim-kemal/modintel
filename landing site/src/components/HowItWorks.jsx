import React from 'react';
import { FaServer, FaBrain, FaFilter, FaChartPie } from 'react-icons/fa';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            icon: <FaServer />,
            title: "Traffic Ingestion",
            desc: "Coraza intercepts incoming web requests at the ingress layer. No changes to your DNS required."
        },
        {
            icon: <FaBrain />,
            title: "Parallel Analysis",
            desc: "A copy of each request goes to ModIntel's local ML service for scoring, next to the WAF decision."
        },
        {
            icon: <FaFilter />,
            title: "Smart Decision",
            desc: "The model separates true attacks from benign anomalies, so rule hits that are harmless can be cleared."
        },
        {
            icon: <FaChartPie />,
            title: "Visual Triage",
            desc: "Alerts land in a review dashboard with the payload, the rules that fired, and the model's score."
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
