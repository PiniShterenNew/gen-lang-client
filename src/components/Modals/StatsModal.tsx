import React from 'react';
import {
  X,
  Trophy,
  Award,
  RotateCcw,
  Compass,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { UserProgress } from '../../types/game';
import { STAGES } from '../../data/stages';
import { CHALLENGES } from '../../data/challenges';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onResetProgress: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalChallengesCount = CHALLENGES.length;
  const completedList = (Object.values(progress.completedChallenges || {}) as { score: number }[]);
  const completedCount = completedList.length;
  let totalScoresSum = 0;
  for (const item of completedList) {
    if (item && typeof item.score === 'number') {
      totalScoresSum += item.score;
    }
  }
  const accuracyAvg = completedCount > 0 ? Math.round(totalScoresSum / completedCount) : 0;
  const discoveredCount = progress.discoveredLandmarks?.length || 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl border border-sky-500/30">
              {progress.profile.avatar || '🧭'}
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>{progress.profile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {progress.profile.title}
                </span>
              </h2>
              <p className="text-xs text-slate-400">מעקב שליטה במפה מנטלית וידיעת הארץ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">ניקוד כולל</span>
              <div className="text-xl font-black text-amber-400 font-mono">
                {progress.totalScore}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">אתגרים שהושלמו</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {completedCount}/{totalChallengesCount}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">ציון דיוק ממוצע</span>
              <div className="text-xl font-black text-sky-400 font-mono">
                {completedCount > 0 ? `${accuracyAvg}%` : '-'}
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-medium">מקומות שנתגלו</span>
              <div className="text-xl font-black text-purple-400 font-mono">
                {discoveredCount}
              </div>
            </div>
          </div>

          {/* Overall Mastery Percentage */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-emerald-950/40 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>שליטה כוללת במפה המנטלית של ישראל</span>
              </span>
              <span className="text-sky-400 font-mono text-sm">{progress.profile.totalMasteryPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(5, progress.profile.totalMasteryPercent)}%` }}
              />
            </div>
          </div>

          {/* Stages Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300">שליטה לפי שלבי למידה:</h3>
            <div className="space-y-2">
              {STAGES.map((stage) => {
                const stageChallenges = stage.challengeIds;
                const completedInStage = stageChallenges.filter(
                  (id) => progress.completedChallenges[id]?.score >= 60
                ).length;
                const percent = Math.round((completedInStage / stageChallenges.length) * 100);

                return (
                  <div
                    key={stage.id}
                    className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{stage.hebrewTitle}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {completedInStage}/{stageChallenges.length} ({percent}%)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('האם אתה בטוח שברצונך לאפס את כל נתוני ההתקדמות והפרופיל?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>אפס את כל ההתקדמות</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};
