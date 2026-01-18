import React from 'react';
import './Footer.css';
import { FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Mod<span>Intel</span></h3>
                        <p>
                            Next-generation WAF intelligence that adapts to threats in real-time, reducing false positives and simplifying triage.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul className="footer-links">
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Integrations</a></li>
                            <li><a href="#">GitHub</a></li>
                            <li><a href="#">Changelog</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#">Documentation</a></li>
                            <li><a href="#">API Reference</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Community</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Legal</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ModIntel. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#"><FaGithub size={20} /></a>
                        <a href="#"><FaXTwitter size={20} /></a>
                        <a href="#"><FaLinkedin size={20} /></a>
                        <a href="#"><FaDiscord size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
