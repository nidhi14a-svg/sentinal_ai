import re

def modify_ai_analysis():
    path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\AIAnalysis\AIAnalysis.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Add Shield to imports
    if "Shield," not in content and "Shield " not in content:
        content = content.replace("ShieldCheck } from 'lucide-react';", "ShieldCheck, Shield } from 'lucide-react';")

    # The exact block from Remediation.jsx to inject
    ready_to_remediate_card = """<GlassCard glowColor="red" className="text-center max-w-2xl mx-auto p-12">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-accent-red/20 to-accent-purple/20 flex items-center justify-center border-2 border-accent-red/50">
                                <Shield className="w-12 h-12 text-accent-red" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-text-primary mb-3">Ready to Remediate</h3>
                        <p className="text-text-secondary mb-6">
                            The AI agent will autonomously patch all {displayVulnerabilities.length} vulnerabilities found during the scan.
                            No manual intervention required.
                        </p>

                        <div className="flex items-center justify-center gap-4 mb-6 text-sm font-mono">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-status-success" />
                                <span className="text-text-dim">Auto-Fixable: 100%</span>
                            </div>
                            <div className="w-px h-4 bg-border-subtle" />
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                                <span className="text-text-dim">Est. Time: 15s</span>
                            </div>
                        </div>

                        <GlowButton
                            onClick={handleRemediate}
                            variant="primary"
                            icon={<Zap className="w-5 h-5" />}
                            className="px-8 py-3 text-lg group"
                        >
                            FIX ALL VULNERABILITIES
                            <Sparkles className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                        </GlowButton>
                    </GlassCard>"""

    # Replace the existing Action Section GlassCard
    action_section_pattern = re.compile(
        r'<GlassCard glowColor="red" className="p-6 max-w-2xl w-full text-center">.*?</GlassCard>',
        re.DOTALL
    )

    content = action_section_pattern.sub(ready_to_remediate_card, content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def modify_remediation():
    path = r"c:\Users\nidhi\Desktop\sential-ai\sentinal_ai\frontend\src\sections\Remediation\Remediation.jsx"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    auto_start_effect = """
    // Auto-start remediation to skip the "Ready to Remediate" screen
    useEffect(() => {
        if (!isActive && taskId) {
            startRemediation();
        }
    }, [taskId, isActive]);
"""
    
    # Insert right after startRemediation is defined
    if "Auto-start remediation" not in content:
        content = content.replace("console.error(\"Remediation failed:\", error);\n        }\n    };", 
                                  "console.error(\"Remediation failed:\", error);\n        }\n    };\n" + auto_start_effect)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    modify_ai_analysis()
    modify_remediation()
