
import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-green-400 text-white shadow-lg shadow-green-200 hover:bg-green-500",
        secondary: "bg-white text-green-800 shadow-md hover:bg-green-50",
        icon: "p-3 rounded-full bg-white text-green-600 shadow-md hover:bg-green-50 aspect-square flex items-center justify-center"
    };

    // Note: We are using inline styles or standard CSS classes defined in index.css
    // But here I'm using Tailwind-like class names. 
    // Since I didn't install Tailwind, I should stick to standard CSS or inline styles for simplicity 
    // OR I should have added Tailwind. The user didn't explicitly ask for Tailwind, but I used it in my thought process.
    // I will use standard CSS classes defined in a module or inline styles to be safe, 
    // or just rely on the global CSS I wrote.

    // Actually, to make it "cute" and "premium" without Tailwind, I'll use inline styles or a CSS file.
    // Let's use a CSS module approach or just a simple CSS file for components.
    // For simplicity in this environment, I'll use inline styles combined with the global classes.

    const getStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-white)',
                    boxShadow: 'var(--shadow-soft)',
                };
            case 'secondary':
                return {
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-text)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                };
            case 'icon':
                return {
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-primary)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    padding: '12px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                };
            default:
                return {};
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                ...baseStyleObj,
                ...getStyle(),
            }}
            className={className}
        >
            {children}
        </button>
    );
};

const baseStyleObj = {
    padding: '12px 32px',
    borderRadius: '999px',
    fontWeight: '700',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
};

export default Button;
