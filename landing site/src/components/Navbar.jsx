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
                    <a href="#pricing" className="nav-link">GitHub</a>
                    <a href="#docs" className="nav-link">Documentation</a>
                </div>

                <div className="nav-actions">
                    <button className="btn-primary">Get Started</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
