import { useState, useCallback } from 'react';
import { ChevronDown, Copy, Check } from 'lucide-react';

export function PRDSection({ title, icon: Icon, children, defaultOpen = true, delay = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e) => {
    e.stopPropagation();
    const text = document.getElementById(`section-${title}`)?.innerText || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [title]);

  return (
    <div
      className="glass-card overflow-hidden animate-fade-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'backwards' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover/50 transition-colors duration-150 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-brand-gradient-subtle border border-brand-500/15 flex items-center justify-center flex-shrink-0">
            <Icon size={13} className="text-brand-400" />
          </div>
          <span className="font-semibold text-sm text-ink-primary">{title}</span>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={handleCopy}
            className="btn-ghost"
            title="Copy section"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <ChevronDown
            size={15}
            className={`text-ink-muted transition-transform duration-200 ${open ? '' : '-rotate-90'}`}
          />
        </div>
        <ChevronDown
          size={15}
          className={`text-ink-muted transition-transform duration-200 group-hover:opacity-0 opacity-100 absolute right-5 ${open ? '' : '-rotate-90'}`}
        />
      </button>

      {open && (
        <div id={`section-${title}`} className="px-5 pb-5 border-t border-surface-border/50">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

export function Tag({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-surface-elevated border-surface-border text-ink-secondary',
    brand: 'bg-brand-500/10 border-brand-500/20 text-brand-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    danger: 'bg-red-500/10 border-red-500/20 text-red-400',
    sky: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function PriorityTag({ priority }) {
  if (priority === 'P0') return <Tag variant="danger">P0 Critical</Tag>;
  if (priority === 'P1') return <Tag variant="warning">P1 High</Tag>;
  return <Tag variant="sky">P2 Medium</Tag>;
}

export function SeverityTag({ severity }) {
  if (!severity) return null;
  const s = severity.toLowerCase();
  if (s === 'high') return <Tag variant="danger">High</Tag>;
  if (s === 'medium') return <Tag variant="warning">Medium</Tag>;
  return <Tag variant="success">Low</Tag>;
}

export function EffortTag({ effort }) {
  if (!effort) return null;
  const variants = { S: 'success', M: 'sky', L: 'warning', XL: 'danger' };
  return <Tag variant={variants[effort] || 'default'}>{effort}</Tag>;
}

export function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-surface-border/40 last:border-0">
      <span className="text-2xs text-ink-muted font-medium uppercase tracking-wide min-w-24 pt-0.5">{label}</span>
      <span className="text-sm text-ink-secondary flex-1">{value}</span>
    </div>
  );
}
