import { useState } from 'react';
import { FileText, Clock, LayoutTemplate, Plus, ChevronRight, Sparkles } from 'lucide-react';

const NAV = [
  { id: 'new', label: 'New PRD', icon: Plus },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
];

export default function Sidebar({ view, setView, history, onNewPRD, onLoadFromHistory, currentPRD }) {
  const [historyExpanded, setHistoryExpanded] = useState(true);

  function handleNav(id) {
    if (id === 'new') {
      onNewPRD();
    } else {
      setView(id);
    }
  }

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-surface-primary border-r border-surface-border">
      <div className="px-5 py-5 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-sm flex-shrink-0">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-ink-primary leading-none">PRD Studio</p>
            <p className="text-2xs text-ink-muted mt-0.5">AI Product Manager</p>
          </div>
        </div>
      </div>

      <nav className="p-3 flex flex-col gap-0.5">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive =
            id === 'new'
              ? view === 'new' || view === 'workspace'
              : view === id;

          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-hover border border-transparent'
                }
              `}
            >
              <Icon size={15} className={isActive ? 'text-brand-400' : 'text-ink-muted'} />
              {label}
            </button>
          );
        })}
      </nav>

      {history.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col px-3 pb-3 min-h-0">
          <div className="mt-4 mb-2 px-1">
            <button
              onClick={() => setHistoryExpanded(v => !v)}
              className="flex items-center justify-between w-full group"
            >
              <span className="section-label">Recent</span>
              <ChevronRight
                size={12}
                className={`text-ink-muted transition-transform duration-200 ${historyExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          </div>

          {historyExpanded && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 min-h-0">
              {history.slice(0, 12).map(item => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  isActive={currentPRD?.title === item.prd?.title}
                  onClick={() => {
                    onLoadFromHistory(item);
                    setView('workspace');
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </aside>
  );
}

function HistoryItem({ item, isActive, onClick }) {
  const date = new Date(item.date);
  const timeAgo = getTimeAgo(date);

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group
        ${isActive
          ? 'bg-brand-500/10 border border-brand-500/20'
          : 'hover:bg-surface-hover border border-transparent'
        }
      `}
    >
      <div className="flex items-start gap-2">
        <FileText size={12} className="text-ink-muted mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium truncate leading-tight ${isActive ? 'text-brand-400' : 'text-ink-secondary group-hover:text-ink-primary'}`}>
            {item.title || item.idea?.slice(0, 40)}
          </p>
          <p className="text-2xs text-ink-muted mt-0.5">{timeAgo}</p>
        </div>
      </div>
    </button>
  );
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
