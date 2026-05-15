import { useState } from 'react';
import { X, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, XCircle, Lightbulb, ChevronDown, Wand2 } from 'lucide-react';
import { Tag, SeverityTag } from './PRDSection';

const VERDICT_CONFIG = {
  APPROVE: {
    label: 'Approved',
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  },
  REVISE: {
    label: 'Needs Revision',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.15)]',
  },
  REJECT: {
    label: 'Rejected',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/15',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
};

export default function CritiquePanel({ critique, onClose, onImprove, isImproving }) {
  const verdict = VERDICT_CONFIG[critique.verdict] || VERDICT_CONFIG.REVISE;
  const VerdictIcon = verdict.icon;
  const score = critique.overall_score || 0;

  return (
    <div className="w-96 flex-shrink-0 flex flex-col bg-surface-primary border-l border-surface-border animate-slide-in-right overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border flex-shrink-0">
        <div>
          <p className="font-bold text-ink-primary text-sm">PM Critique</p>
          <p className="text-2xs text-ink-muted mt-0.5">Senior VP Review</p>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 flex flex-col gap-4">
          <div className={`rounded-2xl p-4 ${verdict.bg} border ${verdict.border} ${verdict.glow}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-2 font-bold text-sm ${verdict.color}`}>
                <VerdictIcon size={16} />
                {verdict.label}
              </div>
              <ScoreRing score={score} verdict={critique.verdict} />
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">{critique.verdict_reason}</p>
          </div>

          {critique.summary && (
            <div className="glass-card p-4">
              <p className="section-label mb-2">Summary</p>
              <p className="text-sm text-ink-secondary leading-relaxed">{critique.summary}</p>
            </div>
          )}

          {critique.strengths?.length > 0 && (
            <CritiqueSection
              title="Strengths"
              icon={ThumbsUp}
              iconColor="text-emerald-400"
              defaultOpen={false}
            >
              <ul className="flex flex-col gap-2">
                {critique.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                    <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CritiqueSection>
          )}

          {critique.assumptions_critique?.length > 0 && (
            <CritiqueSection title="Assumption Risks" icon={AlertTriangle} iconColor="text-amber-400">
              <div className="flex flex-col gap-3">
                {critique.assumptions_critique.map((a, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <p className="text-xs font-semibold text-ink-primary mb-1">{a.assumption}</p>
                    <p className="text-xs text-amber-400/80 mb-2">{a.concern}</p>
                    <p className="text-xs text-ink-muted">{a.recommendation}</p>
                  </div>
                ))}
              </div>
            </CritiqueSection>
          )}

          {critique.missing_requirements?.length > 0 && (
            <CritiqueSection title="Missing Requirements" icon={XCircle} iconColor="text-red-400">
              <div className="flex flex-col gap-3">
                {critique.missing_requirements.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-ink-primary">{m.area}</p>
                      <SeverityTag severity={m.importance} />
                    </div>
                    <p className="text-xs text-red-400/80 mb-1.5">{m.gap}</p>
                    <p className="text-xs text-ink-muted">{m.suggestion}</p>
                  </div>
                ))}
              </div>
            </CritiqueSection>
          )}

          {critique.ux_risks?.length > 0 && (
            <CritiqueSection title="UX Risks" icon={ThumbsDown} iconColor="text-violet-400" defaultOpen={false}>
              <div className="flex flex-col gap-3">
                {critique.ux_risks.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <p className="text-xs font-semibold text-ink-primary mb-1">{r.risk}</p>
                    <p className="text-xs text-violet-400/80 mb-2">{r.impact}</p>
                    <p className="text-xs text-ink-muted">{r.mitigation}</p>
                  </div>
                ))}
              </div>
            </CritiqueSection>
          )}

          {critique.engineering_risks?.length > 0 && (
            <CritiqueSection title="Engineering Risks" icon={AlertTriangle} iconColor="text-orange-400" defaultOpen={false}>
              <div className="flex flex-col gap-3">
                {critique.engineering_risks.map((r, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <p className="text-xs font-semibold text-ink-primary mb-1">{r.risk}</p>
                    <p className="text-xs text-orange-400/80 mb-2">{r.impact}</p>
                    <p className="text-xs text-ink-muted">{r.mitigation}</p>
                  </div>
                ))}
              </div>
            </CritiqueSection>
          )}

          {critique.improvements?.length > 0 && (
            <CritiqueSection title="Improvements" icon={Lightbulb} iconColor="text-sky-400" defaultOpen={false}>
              <div className="flex flex-col gap-2">
                {critique.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <SeverityTag severity={imp.priority} />
                    <div>
                      <p className="text-xs font-semibold text-ink-primary">{imp.area}</p>
                      <p className="text-xs text-ink-secondary mt-1">{imp.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CritiqueSection>
          )}

          {critique.next_steps?.length > 0 && (
            <div className="glass-card p-4">
              <p className="section-label mb-3">Next Steps</p>
              <ol className="flex flex-col gap-2">
                {critique.next_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-ink-secondary">
                    <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 text-2xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {critique.verdict !== 'APPROVE' && (
        <div className="p-4 border-t border-surface-border flex-shrink-0">
          <button
            onClick={onImprove}
            disabled={isImproving}
            className="btn-primary w-full justify-center"
          >
            {isImproving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Improving PRD...
              </>
            ) : (
              <>
                <Wand2 size={14} />
                Improve PRD
              </>
            )}
          </button>
          <p className="text-center text-2xs text-ink-muted mt-2">
            AI will address all high-priority issues
          </p>
        </div>
      )}
    </div>
  );
}

function CritiqueSection({ title, icon: Icon, iconColor, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={13} className={iconColor} />
          <span className="text-xs font-semibold text-ink-primary">{title}</span>
        </div>
        <ChevronDown size={13} className={`text-ink-muted transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-surface-border/50 pt-3">{children}</div>
      )}
    </div>
  );
}

function ScoreRing({ score, verdict }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = verdict === 'APPROVE' ? '#34d399' : verdict === 'REJECT' ? '#f87171' : '#fbbf24';

  return (
    <div className="relative w-14 h-14">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={radius} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-ink-primary">{score}</span>
      </div>
    </div>
  );
}
