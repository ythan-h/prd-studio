import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PRDInput from './components/PRDInput';
import PRDOutput from './components/PRDOutput';
import CritiquePanel from './components/CritiquePanel';
import LoadingState from './components/LoadingState';
import { generatePRD, critiquePRD, improvePRD } from './api/prdApi';

function loadHistory() {
  try {
    const saved = localStorage.getItem('prd-studio-history');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem('prd-studio-history', JSON.stringify(history));
  } catch {}
}

export default function App() {
  const [view, setView] = useState('new');
  const [currentPRD, setCurrentPRD] = useState(null);
  const [currentCritique, setCurrentCritique] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCritiquing, setIsCritiquing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showCritique, setShowCritique] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePRD = useCallback(async (idea) => {
    setIsGenerating(true);
    setError(null);
    setCurrentPRD(null);
    setCurrentCritique(null);
    setShowCritique(false);

    try {
      const prd = await generatePRD(idea);
      setCurrentPRD(prd);
      setView('workspace');

      const item = { id: Date.now(), idea, title: prd.title, date: new Date().toISOString(), prd };
      const next = [item, ...history.slice(0, 19)];
      setHistory(next);
      saveHistory(next);
    } catch (err) {
      setError(err.message || 'Failed to generate PRD. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [history]);

  const handleCritiquePRD = useCallback(async () => {
    if (!currentPRD) return;
    setIsCritiquing(true);
    setError(null);

    try {
      const critique = await critiquePRD(currentPRD);
      setCurrentCritique(critique);
      setShowCritique(true);
    } catch (err) {
      setError(err.message || 'Failed to critique PRD. Please try again.');
    } finally {
      setIsCritiquing(false);
    }
  }, [currentPRD]);

  const handleImprovePRD = useCallback(async () => {
    if (!currentPRD || !currentCritique) return;
    setIsImproving(true);
    setError(null);

    try {
      const improved = await improvePRD(currentPRD, currentCritique);
      setCurrentPRD(improved);
      setCurrentCritique(null);
      setShowCritique(false);

      const updated = history.map(item =>
        item.prd?.title === currentPRD.title
          ? { ...item, prd: improved, title: improved.title }
          : item
      );
      setHistory(updated);
      saveHistory(updated);
    } catch (err) {
      setError(err.message || 'Failed to improve PRD. Please try again.');
    } finally {
      setIsImproving(false);
    }
  }, [currentPRD, currentCritique, history]);

  const handleNewPRD = useCallback(() => {
    setCurrentPRD(null);
    setCurrentCritique(null);
    setShowCritique(false);
    setError(null);
    setView('new');
  }, []);

  const handleLoadFromHistory = useCallback((item) => {
    setCurrentPRD(item.prd);
    setCurrentCritique(null);
    setShowCritique(false);
    setError(null);
    setView('workspace');
  }, []);

  const showWorkspace = view === 'workspace' && currentPRD && !isGenerating;
  const showInput = !isGenerating && !showWorkspace;

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <div className="absolute inset-0 bg-glow-radial pointer-events-none" />

      <Sidebar
        view={view}
        setView={setView}
        history={history}
        onNewPRD={handleNewPRD}
        onLoadFromHistory={handleLoadFromHistory}
        currentPRD={currentPRD}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {isGenerating ? (
          <LoadingState message="Generating your PRD..." />
        ) : showWorkspace ? (
          <PRDOutput
            prd={currentPRD}
            critique={currentCritique}
            isCritiquing={isCritiquing}
            isImproving={isImproving}
            showCritique={showCritique}
            onCritique={handleCritiquePRD}
            onImprove={handleImprovePRD}
            onNewPRD={handleNewPRD}
            error={error}
          />
        ) : (
          <PRDInput
            onGenerate={handleGeneratePRD}
            error={error}
            view={view}
            history={history}
            onLoadFromHistory={handleLoadFromHistory}
          />
        )}

        {showCritique && currentCritique && !isGenerating && (
          <CritiquePanel
            critique={currentCritique}
            onClose={() => setShowCritique(false)}
            onImprove={handleImprovePRD}
            isImproving={isImproving}
          />
        )}
      </main>
    </div>
  );
}
