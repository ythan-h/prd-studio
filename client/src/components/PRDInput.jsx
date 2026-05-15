import { useState } from 'react';
import { ArrowRight, Zap, FileText, Users, BarChart2, Clock } from 'lucide-react';

const TEMPLATES = [
  {
    label: 'B2B SaaS Tool',
    icon: '🏢',
    idea: 'A project management tool for remote engineering teams that automatically tracks sprint velocity, identifies blockers from standup notes using AI, and generates weekly progress reports for stakeholders.',
  },
  {
    label: 'Consumer App',
    icon: '📱',
    idea: 'A habit tracking app that uses behavioral science to help people build consistent exercise habits. It adapts difficulty based on life events, integrates with wearables, and creates accountability through social challenges.',
  },
  {
    label: 'Developer Tool',
    icon: '⚡',
    idea: 'An AI-powered code review tool that integrates with GitHub PRs and provides contextual feedback on security vulnerabilities, performance issues, and architectural patterns specific to the team\'s codebase.',
  },
  {
    label: 'Marketplace',
    icon: '🛒',
    idea: 'A two-sided marketplace connecting independent UX researchers with product teams at early-stage startups. Teams post research tasks, researchers bid and deliver insights, with AI-assisted synthesis of findings.',
  },
  {
    label: 'Internal Tool',
    icon: '🔧',
    idea: 'An internal vendor management platform for mid-size companies to consolidate contract renewals, track software spend, benchmark pricing against market rates, and automate renewal negotiation workflows.',
  },
];

const FEATURE_PILLS = [
  { icon: FileText, label: '12-section PRD' },
  { icon: Users, label: 'Persona mapping' },
  { icon: BarChart2, label: 'KPI framework' },
  { icon: Zap, label: 'PM critique mode' },
];

export default function PRDInput({ onGenerate, error, view, history, onLoadFromHistory }) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  if (view === 'history') {
    return <HistoryView history={history} onLoadFromHistory={onLoadFromHistory} />;
  }

  if (view === 'templates') {
    return <TemplatesView onSelect={(t) => setIdea(t.idea)} />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idea.trim() || idea.trim().length < 10) return;
    setIsLoading(true);
    try {
      await onGenerate(idea);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e) {
    setIdea(e.target.value);
    setCharCount(e.target.value.length);
  }

  function handleTemplate(template) {
    setIdea(template.idea);
    setCharCount(template.idea.length);
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 overflow-y-auto">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            AI Senior PM — Ready
          </div>
          <h1 className="text-4xl font-bold text-ink-primary mb-4 text-balance leading-tight">
            Turn any idea into a<br />
            <span className="gradient-text">production-ready PRD</span>
          </h1>
          <p className="text-ink-secondary text-base max-w-md mx-auto text-balance">
            Describe your product idea. Our AI PM generates a structured, critique-ready PRD in seconds.
          </p>
        </div>

        <div
          className="flex gap-4 justify-center mb-10 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
          {FEATURE_PILLS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Icon size={13} className="text-brand-500" />
              {label}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-up"
          style={{ animationDelay: '0.15s', animationFillMode: 'backwards' }}
        >
          <div className="relative group">
            <div className="absolute -inset-px rounded-2xl bg-brand-gradient opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
            <div className="relative glass-card p-1">
              <textarea
                value={idea}
                onChange={handleChange}
                placeholder="Describe your product idea in detail... e.g. 'A B2B SaaS tool that helps remote teams automate their weekly standup reports using AI, integrates with Slack and Jira, and generates insights for engineering managers.'"
                rows={6}
                maxLength={2000}
                className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-ink-primary placeholder-ink-muted resize-none focus:outline-none leading-relaxed"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-surface-border/50">
                <span className="text-2xs text-ink-muted">
                  {charCount > 0 ? `${charCount}/2000 characters` : 'Min 10 characters'}
                </span>
                <button
                  type="submit"
                  disabled={idea.trim().length < 10 || isLoading}
                  className="btn-primary"
                >
                  <span>Generate PRD</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}
        </form>

        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: '0.25s', animationFillMode: 'backwards' }}
        >
          <p className="section-label text-center mb-4">or start with a template</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {TEMPLATES.map((t) => (
              <button
                key={t.label}
                onClick={() => handleTemplate(t)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-surface-border text-xs text-ink-secondary hover:text-ink-primary hover:border-brand-500/30 hover:bg-surface-elevated transition-all duration-150"
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryView({ history, onLoadFromHistory }) {
  if (!history.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <Clock size={40} className="text-ink-muted" />
        <div>
          <p className="text-ink-primary font-semibold">No history yet</p>
          <p className="text-ink-muted text-sm mt-1">Generated PRDs will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-ink-primary mb-6">PRD History</h2>
        <div className="flex flex-col gap-3">
          {history.map((item, i) => (
            <button
              key={item.id}
              onClick={() => onLoadFromHistory(item)}
              className="glass-card-hover w-full text-left p-5 animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink-primary truncate">{item.title}</p>
                  <p className="text-sm text-ink-secondary mt-1 line-clamp-2">{item.idea}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-2xs text-ink-muted">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                  <ArrowRight size={14} className="text-ink-muted" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplatesView({ onSelect }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-ink-primary mb-2">Templates</h2>
        <p className="text-ink-secondary text-sm mb-6">
          Start with a pre-built product idea and customize it to your needs.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {TEMPLATES.map((t, i) => (
            <button
              key={t.label}
              onClick={() => onSelect(t)}
              className="glass-card-hover w-full text-left p-5 animate-fade-up"
              style={{ animationDelay: `${i * 0.07}s`, animationFillMode: 'backwards' }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink-primary">{t.label}</p>
                    <span className="text-xs text-brand-400 font-medium">Use template →</span>
                  </div>
                  <p className="text-sm text-ink-secondary mt-1.5 line-clamp-2">{t.idea}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
