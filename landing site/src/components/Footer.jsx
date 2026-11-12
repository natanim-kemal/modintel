import React from 'react';
import './Footer.css';
import { FaGithub } from 'react-icons/fa';

const repoUrl = 'https://github.com/modintel/modintel';
const blogUrl = 'https://natanim.dev/blog';
const sponsorUrl = 'https://github.com/sponsors/modintel';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Mod<span>Intel</span></h3>
                        <p>
                            An open-source hybrid WAF: Coraza and the OWASP Core Rule Set detect,
                            a machine learning model judges, and analysts review the edge cases.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how-it-works">How it Works</a></li>
                            <li><a href={repoUrl} target="_blank" rel="noreferrer">GitHub</a></li>
                            <li><a href={sponsorUrl} target="_blank" rel="noreferrer">Sponsor</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href={blogUrl} target="_blank" rel="noreferrer">Documentation</a></li>
                            <li><a href={blogUrl} target="_blank" rel="noreferrer">Blog</a></li>
                            <li><a href={`${repoUrl}/tree/main/dashboard`} target="_blank" rel="noreferrer">Dashboard</a></li>
                            <li><a href={`${repoUrl}/tree/main/ml-pipeline`} target="_blank" rel="noreferrer">ML Pipeline</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Project</h4>
                        <ul className="footer-links">
                            <li><a href={repoUrl} target="_blank" rel="noreferrer">Source Code</a></li>
                            <li><a href={`${repoUrl}/issues`} target="_blank" rel="noreferrer">Issues</a></li>
                            <li><a href={`${repoUrl}/commits/main`} target="_blank" rel="noreferrer">Changelog</a></li>
                            <li><a href={`${repoUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">License</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ModIntel. All rights reserved.</p>
                    <div className="social-links">
                        <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="ModIntel on GitHub">
                            <FaGithub size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
