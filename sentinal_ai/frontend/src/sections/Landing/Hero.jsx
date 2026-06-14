import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Link, Sliders, Zap, Shield, Search, AlertTriangle,
    Info, Rocket, Check, ExternalLink, Target
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import GlowButton from '../../components/common/GlowButton';
import GlassCard from '../../components/common/GlassCard';

const Hero = ({ onBegin }) => {
    const {
        targetDomain, setTargetDomain,
        deploymentLink, setDeploymentLink,
        scanProfile, setScanProfile
    } = useDashboard();

    const [domain, setDomain] = useState(targetDomain || '');
    const [link, setLink] = useState(deploymentLink || '');
    const [profile, setProfile] = useState(scanProfile || 'standard');
    const [authorized, setAuthorized] = useState(false);
    const [domainError, setDomainError] = useState('');
    const [shake, setShake] = useState(false);

    const validateDomain = (value) => {
        if (!value.trim()) {
            setDomainError('Domain is required');
            return false;
        }
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (domainRegex.test(value) || ipRegex.test(value)) {
            setDomainError('');
            return true;
        }
        setDomainError('Please enter a valid domain or IP address');
        return false;
    };

    const handleDomainChange = (e) => {
        const value = e.target.value;
        setDomain(value);
        validateDomain(value);
    };

    const handlePlatformClick = (platform) => {
        const urls = {
            Vercel: 'https://your-app.vercel.app',
            Netlify: 'https://your-app.netlify.app',
            Railway: 'https://your-app.railway.app',
            Render: 'https://your-app.onrender.com',
            AWS: 'https://your-app.aws.amazon.com'
        };
        setLink(urls[platform]);
    };

    const handleSubmit = () => {
        if (!validateDomain(domain)) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        if (!authorized) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        setTargetDomain(domain);
        setDeploymentLink(link);
        setScanProfile(profile);
        onBegin();
    };

    const isValid = domain.trim() && !domainError && authorized;

    const scanProfiles = [
        { id: 'quick', icon: Zap, label: 'Quick Scan', time: '~30 seconds', color: 'cyan' },
        { id: 'standard', icon: Shield, label: 'Standard Scan', time: '~2 minutes', color: 'red' },
        { id: 'deep', icon: Search, label: 'Deep Scan', time: '~5 minutes', color: 'purple' }
    ];

    const staggerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5 }
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl mx-auto px-4"
        >
            <motion.div
                animate={shake ? { x: [0, -10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <GlassCard glowColor="red" className="p-6 md:p-8 border-accent-red/40 shadow-glowRed">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 mb-3">
                            <Target className="w-3 h-3 text-accent-cyan" />
                            <span className="text-[10px] font-mono text-accent-cyan tracking-wider font-bold">MISSION CONFIGURATION</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                            Define Your Target
                        </h2>
                        <p className="text-text-secondary text-xs md:text-sm">
                            Enter your deployment details to begin the security audit
                        </p>
                        <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto mt-4" />
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-5">
                        {/* Field 1 - Target Domain */}
                        <motion.div custom={0} variants={staggerVariants} initial="hidden" animate="visible">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-3.5 h-3.5 text-accent-cyan" />
                                <label className="text-xs font-mono text-text-secondary tracking-wider">DOMAIN / IP ADDRESS *</label>
                            </div>
                            <input
                                type="text"
                                value={domain}
                                onChange={handleDomainChange}
                                placeholder="e.g. yourdomain.com or 192.168.1.1"
                                className={`
                  w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border font-mono text-sm
                  transition-all duration-300 focus:outline-none
                  ${domainError
                                        ? 'border-status-critical focus:border-status-critical focus:shadow-glowRed'
                                        : 'border-accent-red/30 focus:border-accent-red/60 focus:shadow-glowRed'
                                    }
                `}
                            />
                            <div className="flex items-center gap-2 mt-1">
                                {domainError ? (
                                    <span className="text-status-critical text-[10px] font-mono flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {domainError}
                                    </span>
                                ) : (
                                    <span className="text-text-dim text-[10px] font-mono">
                                        Enter the domain or IP of the site you want to audit
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* Field 2 - Deployment Link (Optional) */}
                        <motion.div custom={1} variants={staggerVariants} initial="hidden" animate="visible">
                            <div className="flex items-center gap-2 mb-2">
                                <Link className="w-3.5 h-3.5 text-accent-cyan" />
                                <label className="text-xs font-mono text-text-secondary tracking-wider">LIVE DEPLOYMENT URL (OPTIONAL)</label>
                            </div>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="e.g. https://your-app.vercel.app"
                                className="w-full px-4 py-3 rounded-xl bg-bg-secondary/50 border border-accent-red/30 font-mono text-sm focus:outline-none focus:border-accent-red/60 focus:shadow-glowRed transition-all duration-300"
                            />

                            {/* Platform Chips */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {['Vercel', 'Netlify', 'Railway', 'Render', 'AWS'].map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => handlePlatformClick(platform)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary/50 border border-accent-red/30 text-text-dim text-[10px] font-mono hover:border-accent-red/60 hover:text-accent-red transition-all duration-300"
                                        type="button"
                                    >
                                        <ExternalLink className="w-2.5 h-2.5" />
                                        {platform}
                                    </button>
                                ))}
                            </div>
                            <p className="text-text-dim text-[10px] font-mono mt-2">
                                Paste your live deployment link for a complete audit
                            </p>
                        </motion.div>

                        {/* Field 3 - Scan Profile */}
                        <motion.div custom={2} variants={staggerVariants} initial="hidden" animate="visible">
                            <div className="flex items-center gap-2 mb-2">
                                <Sliders className="w-3.5 h-3.5 text-accent-cyan" />
                                <label className="text-xs font-mono text-text-secondary tracking-wider">SCAN INTENSITY</label>
                            </div>
                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                                {scanProfiles.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setProfile(p.id)}
                                        className={`
                      relative p-2 md:p-3 rounded-xl border transition-all duration-300 text-left
                      ${profile === p.id
                                                ? `bg-gradient-to-r from-${p.color === 'red' ? 'accent-red' : p.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}/20 border-${p.color === 'red' ? 'accent-red' : p.color === 'cyan' ? 'accent-cyan' : 'accent-purple'} shadow-glow${p.color === 'red' ? 'Red' : p.color === 'cyan' ? 'Cyan' : 'Purple'}`
                                                : 'bg-bg-secondary/30 border-accent-red/20 hover:border-accent-red/40'
                                            }
                    `}
                                        type="button"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <p.icon className={`w-3.5 h-3.5 ${profile === p.id ? `text-${p.color === 'red' ? 'accent-red' : p.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}` : 'text-text-dim'}`} />
                                            <span className={`text-xs font-bold font-mono ${profile === p.id ? `text-${p.color === 'red' ? 'accent-red' : p.color === 'cyan' ? 'accent-cyan' : 'accent-purple'}` : 'text-text-primary'}`}>
                                                {p.label}
                                            </span>
                                        </div>
                                        <span className="text-[9px] md:text-[10px] font-mono text-text-dim">{p.time}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Field 4 - Authorization Confirmation */}
                        <motion.div custom={3} variants={staggerVariants} initial="hidden" animate="visible">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={authorized}
                                        onChange={(e) => setAuthorized(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div
                                        onClick={() => setAuthorized(!authorized)}
                                        className={`
                      w-5 h-5 rounded-md border-2 flex items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${authorized
                                                ? 'bg-accent-red border-accent-red shadow-glowRed'
                                                : 'bg-bg-secondary/50 border-accent-red/30 group-hover:border-accent-red/60'
                                            }
                    `}
                                    >
                                        {authorized && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs md:text-sm text-text-primary font-mono">
                                        I confirm I have authorization to scan this target
                                    </span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <AlertTriangle className="w-3 h-3 text-status-high" />
                                        <span className="text-text-dim text-[9px] md:text-[10px] font-mono">
                                            Only scan websites you own or have explicit permission to test
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </motion.div>

                        {/* Demo Mode Info */}
                        <motion.div custom={4} variants={staggerVariants} initial="hidden" animate="visible">
                            <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-accent-cyan/5 border border-accent-cyan/20">
                                <Info className="w-3 h-3 text-accent-cyan" />
                                <span className="text-[9px] md:text-[10px] font-mono text-text-dim">
                                    Demo mode: pre-authorized target is sample-domain.com
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Begin Mission Button */}
            <motion.div
                custom={5}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6"
            >
                <GlowButton
                    onClick={handleSubmit}
                    variant="primary"
                    disabled={!isValid}
                    fullWidth
                    className="py-4 text-base md:text-lg group"
                    icon={<Rocket className="w-5 h-5" />}
                >
                    LAUNCH SECURITY AUDIT
                </GlowButton>
                {!isValid && (
                    <p className="text-center text-[10px] text-text-dim mt-2 font-mono">
                        Please fill required fields and confirm authorization
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Hero;