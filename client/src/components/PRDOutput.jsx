import { useState, useCallback } from 'react';
import {
  AlertCircle, Users, Target, BookOpen, Zap, Shield, BarChart2,
  GitBranch, AlertTriangle, Rocket, Map, HelpCircle, Download,
  MessageSquare, Wand2, Plus, Copy, Check,
} from 'lucide-react';
import { PRDSection, Tag, PriorityTag, SeverityTag, EffortTag, InfoRow } from './PRDSection';

export default function PRDOutput({
  prd, critique, isCritiquing, isImproving, showCritique,
  onCritique, onImprove, onNewPRD, error,
}) {
  const [copied, setCopied] = useState(false);

  const handleExport = useCallback(async () => {
    const md = prdToMarkdown(prd);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [prd]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-8 py-4 border-b border-surface-border flex-shrink-0 bg-surface-primary/50 backdrop-blur-sm">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-2xs font-medium text-brand-400 uppercase tracking-wider">PRD</span>
            <span className="text-2xs text-ink-muted">v{prd.version}</span>
            <span className="text-2xs text-ink-muted">·</span>
            <span className="text-2xs text-ink-muted">{prd.date}</span>
          </div>
          <h1 className="text-lg font-bold text-ink-primary truncate">{prd.title}</h1>
          {prd.tagline && (
            <p className="text-sm text-ink-secondary truncate mt-0.5">{prd.tagline}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-6">
          <button onClick={handleExport} className="btn-secondary">
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy MD'}
          </button>

          {!showCritique && (
            <button
              onClick={onCritique}
              disabled={isCritiquing}
              className="btn-secondary"
            >
              {isCritiquing ? (
                <div className="w-3 h-3 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
              ) : (
                <MessageSquare size={13} />
              )}
              {isCritiquing ? 'Critiquing...' : 'PM Critique'}
            </button>
          )}

          {critique && !showCritique && (
            <button
              onClick={onImprove}
              disabled={isImproving}
              className="btn-primary"
            >
              {isImproving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wand2 size={13} />
              )}
              Improve PRD
            </button>
          )}

          <button onClick={onNewPRD} className="btn-ghost">
            <Plus size={13} />
            New
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-8 mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">

          {prd.problem_statement && (
            <PRDSection title="Problem Statement" icon={AlertCircle} delay={0}>
              <p className="text-sm text-ink-secondary leading-relaxed">{prd.problem_statement}</p>
            </PRDSection>
          )}

          {prd.personas?.length > 0 && (
            <PRDSection title="Personas" icon={Users} delay={0.05}>
              <div className="flex flex-col gap-4">
                {prd.personas.map((p, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-ink-primary text-sm">{p.name}</p>
                        <p className="text-xs text-ink-secondary mt-0.5">{p.role} · {p.company_type}</p>
                      </div>
                      <Tag variant={p.tech_savviness === 'High' ? 'brand' : p.tech_savviness === 'Medium' ? 'sky' : 'default'}>
                        {p.tech_savviness} Tech Savviness
                      </Tag>
                    </div>
                    <p className="text-xs text-ink-secondary mb-3 leading-relaxed">{p.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Pain Points</p>
                        <ul className="flex flex-col gap-1.5">
                          {p.pain_points?.map((pp, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-ink-secondary">
                              <span className="text-red-400 mt-0.5 flex-shrink-0">×</span>
                              {pp}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Goals</p>
                        <ul className="flex flex-col gap-1.5">
                          {p.goals?.map((g, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-ink-secondary">
                              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {(prd.goals?.length > 0 || prd.non_goals?.length > 0) && (
            <PRDSection title="Goals & Non-Goals" icon={Target} delay={0.1}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">In Scope</p>
                  <ul className="flex flex-col gap-2">
                    {prd.goals?.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0 text-base leading-none">✓</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-2xs font-semibold text-red-400 uppercase tracking-wide mb-3">Out of Scope</p>
                  <ul className="flex flex-col gap-2">
                    {prd.non_goals?.map((ng, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-secondary">
                        <span className="text-red-400 mt-0.5 flex-shrink-0 text-base leading-none">×</span>
                        {ng}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </PRDSection>
          )}

          {prd.user_stories?.length > 0 && (
            <PRDSection title="User Stories" icon={BookOpen} delay={0.15}>
              <div className="flex flex-col gap-3">
                {prd.user_stories.map((story, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <code className="text-2xs text-ink-muted font-mono">{story.id}</code>
                      <PriorityTag priority={story.priority} />
                    </div>
                    <p className="text-sm text-ink-secondary mb-3">
                      <span className="text-ink-muted">As a </span>
                      <span className="text-ink-primary font-medium">{story.as_a}</span>
                      <span className="text-ink-muted">, I want to </span>
                      <span className="text-ink-primary font-medium">{story.i_want}</span>
                      <span className="text-ink-muted">, so that </span>
                      <span className="text-ink-secondary">{story.so_that}</span>
                    </p>
                    {story.acceptance_criteria?.length > 0 && (
                      <div>
                        <p className="text-2xs font-semibold text-ink-muted uppercase tracking-wide mb-1.5">Acceptance Criteria</p>
                        <ul className="flex flex-col gap-1">
                          {story.acceptance_criteria.map((ac, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-ink-secondary">
                              <span className="text-brand-400 flex-shrink-0">·</span>
                              {ac}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.functional_requirements?.length > 0 && (
            <PRDSection title="Functional Requirements" icon={Zap} delay={0.2}>
              <div className="flex flex-col gap-3">
                {prd.functional_requirements.map((fr, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-2xs text-ink-muted font-mono">{fr.id}</code>
                        <p className="text-sm font-semibold text-ink-primary">{fr.title}</p>
                      </div>
                      <PriorityTag priority={fr.priority} />
                    </div>
                    <p className="text-sm text-ink-secondary leading-relaxed mb-2">{fr.description}</p>
                    {fr.user_impact && (
                      <p className="text-xs text-brand-400/80">
                        <span className="font-medium">Impact: </span>{fr.user_impact}
                      </p>
                    )}
                    {fr.dependencies?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {fr.dependencies.map((d, j) => (
                          <Tag key={j}>{d}</Tag>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.non_functional_requirements?.length > 0 && (
            <PRDSection title="Non-Functional Requirements" icon={Shield} delay={0.25}>
              <div className="flex flex-col gap-0">
                {prd.non_functional_requirements.map((nfr, i) => (
                  <div key={i} className="flex items-start gap-4 py-3 border-b border-surface-border/40 last:border-0">
                    <Tag variant="brand">{nfr.category}</Tag>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-secondary">{nfr.requirement}</p>
                      <p className="text-xs text-brand-400 mt-1 font-mono">{nfr.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.kpis && (
            <PRDSection title="KPIs & North Star" icon={BarChart2} delay={0.3}>
              <div className="mb-4 p-4 rounded-xl bg-brand-gradient-subtle border border-brand-500/20">
                <p className="text-2xs font-semibold text-brand-400 uppercase tracking-wide mb-1">North Star Metric</p>
                <p className="text-base font-bold text-ink-primary">{prd.kpis.north_star}</p>
              </div>
              {prd.kpis.metrics?.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {prd.kpis.metrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-ink-primary">{m.name}</p>
                        <Tag variant="sky">{m.type}</Tag>
                      </div>
                      <p className="text-xs text-ink-secondary mb-2 leading-relaxed">{m.description}</p>
                      <p className="text-xs font-mono text-emerald-400">{m.target}</p>
                    </div>
                  ))}
                </div>
              )}
            </PRDSection>
          )}

          {prd.edge_cases?.length > 0 && (
            <PRDSection title="Edge Cases" icon={GitBranch} delay={0.35} defaultOpen={false}>
              <div className="flex flex-col gap-3">
                {prd.edge_cases.map((ec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <SeverityTag severity={ec.likelihood} />
                    <div>
                      <p className="text-sm font-medium text-ink-primary mb-1">{ec.scenario}</p>
                      <p className="text-xs text-ink-secondary">{ec.handling}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.risks?.length > 0 && (
            <PRDSection title="Risks" icon={AlertTriangle} delay={0.4} defaultOpen={false}>
              <div className="flex flex-col gap-3">
                {prd.risks.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-semibold text-ink-primary">{r.title}</p>
                      <div className="flex gap-1.5">
                        <Tag variant="default">{r.category}</Tag>
                        <SeverityTag severity={r.severity} />
                      </div>
                    </div>
                    <p className="text-sm text-ink-secondary mb-2 leading-relaxed">{r.description}</p>
                    <div className="pt-2 border-t border-surface-border/40">
                      <p className="text-xs text-ink-muted">
                        <span className="font-medium text-emerald-400">Mitigation: </span>
                        {r.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.mvp_scope?.length > 0 && (
            <PRDSection title="MVP Scope" icon={Rocket} delay={0.45}>
              <div className="flex flex-col gap-2">
                {prd.mvp_scope.map((f, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <EffortTag effort={f.effort} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-primary">{f.feature}</p>
                      <p className="text-xs text-ink-secondary mt-1">{f.rationale}</p>
                      {f.value && (
                        <p className="text-xs text-brand-400/80 mt-1">{f.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.future_roadmap?.length > 0 && (
            <PRDSection title="Future Roadmap" icon={Map} delay={0.5} defaultOpen={false}>
              <div className="flex flex-col gap-4 relative pl-4">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-border" />
                {prd.future_roadmap.map((phase, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-brand-500 shadow-glow-sm" />
                    <div className="p-4 rounded-xl bg-surface-secondary border border-surface-border ml-2">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-ink-primary">{phase.phase}</p>
                        {phase.theme && <Tag variant="brand">{phase.theme}</Tag>}
                      </div>
                      <p className="text-xs text-ink-secondary mb-3">{phase.rationale}</p>
                      <ul className="flex flex-wrap gap-1.5">
                        {phase.features?.map((f, j) => (
                          <li key={j}>
                            <Tag>{f}</Tag>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          {prd.open_questions?.length > 0 && (
            <PRDSection title="Open Questions" icon={HelpCircle} delay={0.55} defaultOpen={false}>
              <div className="flex flex-col gap-2">
                {prd.open_questions.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-secondary border border-surface-border">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-sm text-ink-primary font-medium">{q.question}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xs text-ink-muted">Owner: <span className="text-ink-secondary">{q.owner}</span></span>
                      {q.deadline && (
                        <span className="text-xs text-ink-muted">By: <span className="text-amber-400">{q.deadline}</span></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PRDSection>
          )}

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}

function prdToMarkdown(prd) {
  const lines = [];
  lines.push(`# ${prd.title}`);
  lines.push(`> ${prd.tagline}`);
  lines.push(`\n**Version:** ${prd.version} · **Date:** ${prd.date}\n`);
  lines.push(`---\n`);

  lines.push(`## Problem Statement\n${prd.problem_statement}\n`);

  if (prd.personas?.length) {
    lines.push(`## Personas`);
    prd.personas.forEach(p => {
      lines.push(`\n### ${p.name} — ${p.role}`);
      lines.push(p.description);
      lines.push(`\n**Pain Points:** ${p.pain_points?.join(', ')}`);
      lines.push(`**Goals:** ${p.goals?.join(', ')}`);
    });
    lines.push('');
  }

  if (prd.goals?.length) {
    lines.push(`## Goals`);
    prd.goals.forEach(g => lines.push(`- ✅ ${g}`));
    lines.push('');
  }
  if (prd.non_goals?.length) {
    lines.push(`## Non-Goals`);
    prd.non_goals.forEach(ng => lines.push(`- ❌ ${ng}`));
    lines.push('');
  }

  if (prd.user_stories?.length) {
    lines.push(`## User Stories`);
    prd.user_stories.forEach(s => {
      lines.push(`\n**${s.id}** [${s.priority}] — As a ${s.as_a}, I want to ${s.i_want}, so that ${s.so_that}`);
      s.acceptance_criteria?.forEach(ac => lines.push(`  - ${ac}`));
    });
    lines.push('');
  }

  if (prd.functional_requirements?.length) {
    lines.push(`## Functional Requirements`);
    prd.functional_requirements.forEach(fr => {
      lines.push(`\n**${fr.id}** [${fr.priority}] **${fr.title}**`);
      lines.push(fr.description);
    });
    lines.push('');
  }

  if (prd.kpis) {
    lines.push(`## KPIs\n\n**North Star:** ${prd.kpis.north_star}\n`);
    prd.kpis.metrics?.forEach(m => {
      lines.push(`- **${m.name}** (${m.type}): ${m.target}`);
    });
    lines.push('');
  }

  if (prd.risks?.length) {
    lines.push(`## Risks`);
    prd.risks.forEach(r => {
      lines.push(`\n### ${r.title} [${r.severity}]`);
      lines.push(`${r.description}\n\n**Mitigation:** ${r.mitigation}`);
    });
    lines.push('');
  }

  if (prd.mvp_scope?.length) {
    lines.push(`## MVP Scope`);
    prd.mvp_scope.forEach(f => lines.push(`- **[${f.effort}]** ${f.feature} — ${f.rationale}`));
    lines.push('');
  }

  return lines.join('\n');
}
