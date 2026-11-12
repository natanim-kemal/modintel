import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <a href="/" className="logo">
                    Mod<span className="pr-3">Intel</span>
                </a>

                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#how-it-works" className="nav-link">How it Works</a>
                    <a href="https://github.com/modintel/modintel" className="nav-link" target="_blank" rel="noreferrer">GitHub</a>
                    <a href="https://natanim.dev/blog" className="nav-link" target="_blank" rel="noreferrer">Documentation</a>
                </div>

                <div className="nav-actions">
                    <a href="https://github.com/modintel/modintel" className="btn-primary" target="_blank" rel="noreferrer">Get Started</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
