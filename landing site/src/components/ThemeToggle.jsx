import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './ThemeToggle.css';

const STORAGE_KEY = 'modintel-theme';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() =>
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem(STORAGE_KEY, theme); } catch { return; }
    }, [theme]);

    const next = theme === 'light' ? 'dark' : 'light';

    return (
        <button
            type="button"
            className={`theme-toggle ${theme}`}
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} theme`}
            title={`Switch to ${next} theme`}
        >
            <span className="theme-toggle-thumb">
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </span>
        </button>
    );
};

export default ThemeToggle;
