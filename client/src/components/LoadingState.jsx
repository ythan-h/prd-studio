const STEPS = [
  'Analyzing product idea...',
  'Researching target personas...',
  'Structuring requirements...',
  'Defining success metrics...',
  'Scoping MVP boundaries...',
  'Identifying risks & edge cases...',
  'Assembling your PRD...',
];

export default function LoadingState({ message = 'Working...' }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-surface-border flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-brand-500 border-r-violet-500 animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-10 blur-xl animate-pulse-glow" />
      </div>

      <div className="flex flex-col items-center gap-3 max-w-sm text-center">
        <p className="text-ink-primary font-semibold text-lg">{message}</p>
        <p className="text-ink-muted text-sm">
          Our AI Senior PM is crafting a production-quality document
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {STEPS.map((step, i) => (
          <Step key={step} label={step} index={i} />
        ))}
      </div>
    </div>
  );
}

function Step({ label, index }) {
  const delay = index * 0.9;

  return (
    <div
      className="flex items-center gap-3 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full bg-brand-500 opacity-0 animate-fade-in"
        style={{ animationDelay: `${delay + 0.2}s`, animationFillMode: 'forwards' }}
      />
      <span className="text-xs text-ink-muted">{label}</span>
    </div>
  );
}
