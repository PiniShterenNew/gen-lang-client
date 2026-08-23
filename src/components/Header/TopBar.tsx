import React, { useState } from 'react';
import {
  Compass,
  Trophy,
  BarChart2,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
  Home,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProgress } from '../../types/game';
import { STAGES } from '../../data/stages';

interface TopBarProps {
  progress: UserProgress;
  currentStageId: number;
  isSandboxMode: boolean;
  onSelectStage: (stageId: number) => void;
  onToggleSandbox: () => void;
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onGoHome: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  progress,
  currentStageId,
  isSandboxMode,
  onSelectStage,
  onToggleSandbox,
  onOpenStats,
  onOpenHelp,
  onGoHome,
  onOpenSettings,
  onToggleSound,
}) => {
  const [isStageMenuOpen, setIsStageMenuOpen] = useState(false);

  const currentStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];
  const discoveredCount = progress.discoveredLandmarks?.length || 5;

  const getDifficultyLabel = () => {
    if (progress.difficulty === 'pro_navigator') return '🔴 אלוף הניווט';
    if (progress.difficulty === 'advanced') return '🟡 נווט מתקדם';
    return '🟢 מתחיל';
  };

  return (
    <header className="h-14 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between text-slate-200 z-30 select-none">
      {/* Brand, Home & Stage Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Return Home Button */}
        <button
          onClick={onGoHome}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="חזרה לתפריט הראשי"
        >
          <Home className="w-4 h-4 text-sky-400" />
        </button>

        {/* Player Profile Badge */}
        <div
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/70 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition-colors"
          title="הגדרות פרופיל ומפה"
        >
          <span className="text-base">{progress.profile.avatar}</span>
          <span className="text-xs font-bold text-white max-w-[90px] truncate hidden md:inline">
            {progress.profile.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900 text-slate-300 font-semibold hidden lg:inline">
            {getDifficultyLabel()}
          </span>
        </div>

        <div className="h-5 w-[1px] bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Stage Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStageMenuOpen(!isStageMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-100 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span className="max-w-[130px] truncate">{currentStage.hebrewTitle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isStageMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 border-b border-slate-800 flex justify-between">
                <span>בחירת שלב למידה:</span>
                <span className="text-sky-400 font-mono">6 שלבים</span>
              </div>
              {STAGES.map((st) => {
                const isSelected = st.id === currentStageId;
                const completedInStage = st.challengeIds.filter(
                  (id) => progress.completedChallenges[id]?.score >= 60
                ).length;
                const totalInStage = st.challengeIds.length;

                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      onSelectStage(st.id);
                      setIsStageMenuOpen(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white font-bold'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{st.hebrewTitle}</div>
                      <div className="text-[10px] opacity-75 font-normal">
                        {completedInStage} מתוך {totalInStage} אתגרים
                      </div>
                    </div>
                    {completedInStage === totalInStage && (
                      <span className="text-emerald-400 text-xs">✓ הושלם</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Center/Right Stats & Mode Controls */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Discovered Landmarks Counter */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 px-2.5 py-1.5 rounded-xl text-xs font-mono text-slate-300" title="נקודות ציון שנתגלו במפה">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>{discoveredCount} מקומות</span>
        </div>

        {/* Total Score Display */}
        <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400 font-sans hidden sm:inline">ניקוד:</span>
          <span className="font-black text-amber-300 text-sm">{progress.totalScore}</span>
        </div>

        {/* Sandbox Practice Toggle */}
        <button
          onClick={onToggleSandbox}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSandboxMode
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
          }`}
          title="מעבר למצב חקירה חופשית ומדידת מרחקים"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isSandboxMode ? 'משחק אתגרים' : 'חקירה חופשית'}</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          title={progress.settings.soundEnabled ? 'השתק צלילים' : 'הפעל צלילים'}
        >
          {progress.settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-rose-400" />
          )}
        </button>

        {/* Settings / Levels Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          title="הגדרות משחק ורמות"
        >
          <Sliders className="w-4 h-4 text-sky-400" />
        </button>

        {/* Stats Modal Button */}
        <button
          onClick={onOpenStats}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          title="לוח הישגים והתקדמות"
        >
          <BarChart2 className="w-4 h-4 text-sky-400" />
        </button>

        {/* Help Modal Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          title="הסבר והוראות משחק"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
};
