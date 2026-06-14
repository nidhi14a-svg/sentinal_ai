import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalLog = ({ logs, typingSpeed = 50, className = '', title = 'SENTINEL_AI_TERMINAL' }) => {
    const [displayedLines, setDisplayedLines] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const terminalRef = useRef(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [displayedLines, currentCharIndex]);

    useEffect(() => {
        if (currentLineIndex >= logs.length) {
            setIsTyping(false);
            return;
        }

        const currentLog = logs[currentLineIndex];

        if (currentCharIndex < currentLog.text.length) {
            const timer = setTimeout(() => {
                setCurrentCharIndex(prev => prev + 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        } else {
            const completeTimer = setTimeout(() => {
                setDisplayedLines(prev => [...prev, {
                    ...currentLog,
                    completed: true,
                    timestamp: new Date().toLocaleTimeString()
                }]);
                setCurrentLineIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 100);
            return () => clearTimeout(completeTimer);
        }
    }, [currentLineIndex, currentCharIndex, logs, typingSpeed]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✓';
            case 'error': return '✗';
            case 'warning': return '⚠';
            case 'info': return 'ℹ';
            default: return '○';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'text-status-success';
            case 'error': return 'text-status-critical';
            case 'warning': return 'text-status-high';
            case 'info': return 'text-accent-cyan';
            default: return 'text-text-dim';
        }
    };

    return (
        <div className={`bg-gradient-to-br from-bg-primary/95 to-bg-secondary/95 rounded-xl border border-accent-red/20 backdrop-blur-sm ${className}`}>
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-accent-red/20 bg-black/30 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-status-critical animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-status-high" />
                        <div className="w-3 h-3 rounded-full bg-status-low" />
                    </div>
                    <span className="text-xs font-mono text-accent-red ml-2">{title}</span>
                </div>
                <div className="text-xs font-mono text-text-dim flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                    <span>ACTIVE</span>
                </div>
            </div>

            {/* Terminal Content */}
            <div ref={terminalRef} className="p-4 font-mono text-sm h-64 overflow-y-auto custom-scroll">
                <div className="space-y-1">
                    <AnimatePresence>
                        {displayedLines.map((line, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-2 group"
                            >
                                <span className="text-text-dim text-xs select-none">{line.timestamp}</span>
                                <span className={`${getStatusColor(line.status)} mt-0.5 font-bold`}>
                                    {getStatusIcon(line.status)}
                                </span>
                                <span className="text-text-primary flex-1 break-all">
                                    {line.text}
                                </span>
                                {line.status === 'error' && (
                                    <span className="text-status-critical text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        [FAIL]
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && currentLineIndex < logs.length && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-start gap-2"
                        >
                            <span className="text-text-dim text-xs">
                                {new Date().toLocaleTimeString()}
                            </span>
                            <span className="text-accent-cyan animate-pulse mt-0.5 font-bold">❯</span>
                            <span className="text-text-primary">
                                {logs[currentLineIndex]?.text.substring(0, currentCharIndex)}
                                <span className="inline-block w-2 h-4 bg-accent-red ml-0.5 animate-blink" />
                            </span>
                        </motion.div>
                    )}
                </div>

                {!isTyping && currentLineIndex >= logs.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 pt-3 border-t border-accent-red/30"
                    >
                        <div className="flex items-center gap-2 text-status-success text-xs font-mono">
                            <span className="text-lg">✓</span>
                            <span>All processes completed successfully — System secure</span>
                            <span className="flex gap-1 ml-auto">
                                {['■', '■', '■'].map((dot, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                                    >
                                        {dot}
                                    </motion.span>
                                ))}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TerminalLog;