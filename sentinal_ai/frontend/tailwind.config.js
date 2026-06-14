/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#05050a',
          secondary: '#0a0a12',
          panel: '#0f0f1a',
        },
        accent: {
          red: '#ff1a3c',
          redDim: '#a3122a',
          cyan: '#00e5ff',
          purple: '#9d4dff',
        },
        status: {
          critical: '#ff1a3c',
          high: '#ff6b35',
          medium: '#ffb84d',
          low: '#3dd9b3',
          success: '#39ff8a',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#8a8a9e',
          dim: '#5a5a6e',
        },
        border: {
          glow: 'rgba(255,26,60,0.35)',
          subtle: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glowRed: '0 0 20px rgba(255,26,60,0.35)',
        glowRedStrong: '0 0 40px rgba(255,26,60,0.55)',
        glowCyan: '0 0 20px rgba(0,229,255,0.3)',
        glowPurple: '0 0 20px rgba(157,77,255,0.3)',
        glowSuccess: '0 0 20px rgba(57,255,138,0.3)',
      },
      backdropBlur: {
        glass: '12px',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(255,26,60,0.35)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px rgba(255,26,60,0.6)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        scanline: 'scanline 3s linear infinite',
        flicker: 'flicker 4s ease-in-out infinite',
        gridMove: 'gridMove 4s linear infinite',
        fadeUp: 'fadeUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};