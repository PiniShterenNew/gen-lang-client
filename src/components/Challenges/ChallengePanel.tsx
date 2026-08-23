import React from 'react';
import {
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import { Challenge, UserProgress } from '../../types/game';
import { LocateChallenge } from './LocateChallenge';
import { SpatialChallenge } from './SpatialChallenge';
import { RouteChallenge } from './RouteChallenge';
import { STAGES } from '../../data/stages';

interface ChallengePanelProps {
  challenge: Challenge;
  currentIndex: number;
  totalChallenges: number;
  progress: UserProgress;
  playerGuess: { lat: number; lon: number } | null;
  guessDistKm: number | null;
  guessScore: number | null;
  gradeHebrew: string | null;
  feedbackText: string | null;
  showResult: boolean;
  hintLevel: number;
  selectedOptionId: string | null;
  orderedEntities: string[];
  routeSteps: string[];
  routeStatus: 'idle' | 'in_progress' | 'valid' | 'invalid';
  onNext: () => void;
  onPrev: () => void;
  onRevealHint: () => void;
  onSelectOption: (id: string) => void;
  onResetOrder: () => void;
  onResetRoute: () => void;
  onSelectRouteNode: (nodeId: string) => void;
}

export const ChallengePanel: React.FC<ChallengePanelProps> = ({
  challenge,
  currentIndex,
  totalChallenges,
  progress,
  playerGuess,
  guessDistKm,
  guessScore,
  gradeHebrew,
  feedbackText,
  showResult,
  hintLevel,
  selectedOptionId,
  orderedEntities,
  routeSteps,
  routeStatus,
  onNext,
  onPrev,
  onRevealHint,
  onSelectOption,
  onResetOrder,
  onResetRoute,
  onSelectRouteNode,
}) => {
  const currentStageInfo = STAGES.find((s) => s.id === challenge.stage) || STAGES[0];
  const isChallengeCompleted = !!progress.completedChallenges[challenge.id]?.completed;
  const bestScore = progress.completedChallenges[challenge.id]?.score;

  return (
    <div className="w-full md:w-[420px] lg:w-[460px] flex-1 md:h-full min-h-0 shrink-0 bg-slate-900/95 border-t md:border-t-0 md:border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shadow-2xl z-10 text-slate-100 select-none overflow-hidden">
      {/* Top Header & Progression Pill */}
      <div className="p-5 border-b border-slate-800/80 space-y-3">
        {/* Stage Badge & Challenge Index */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
              שלב {challenge.stage}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[180px]">
              {currentStageInfo.hebrewTitle}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            {progress.streak > 1 && (
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{progress.streak} ברצף</span>
              </div>
            )}
            <span>
              {currentIndex + 1} / {totalChallenges}
            </span>
          </div>
        </div>

        {/* Challenge Title & Main Instruction */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white tracking-wide">
              {challenge.title}
            </h2>
            {isChallengeCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <Award className="w-3.5 h-3.5" />
                <span>שיא: {bestScore}</span>
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-sky-200/95 leading-relaxed">
            {challenge.instruction}
          </p>
          {challenge.subInstruction && (
            <p className="text-xs text-slate-400 leading-normal">
              {challenge.subInstruction}
            </p>
          )}
        </div>
      </div>

      {/* Main Interactive Challenge Body */}
      <div className="flex-1 min-h-0 p-5 overflow-y-auto space-y-4 custom-scrollbar">
        {/* Hint Accordion / Button */}
        {!showResult && (
          <div>
            {hintLevel === 0 ? (
              <button
                onClick={onRevealHint}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-amber-300 text-xs font-semibold transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>צריך רמז מרחבי?</span>
              </button>
            ) : (
              <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 text-amber-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-amber-300">
                    רמז {hintLevel === 1 ? '1 מתוך 2 (כיוון ואזור)' : '2 מתוך 2 (רדיוס חיפוש)'}:
                  </span>
                  <p className="leading-relaxed opacity-90">{challenge.hint}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Mode Sub-View */}
        {challenge.type === 'locate' && (
          <LocateChallenge
            challenge={challenge}
            playerGuess={playerGuess}
            guessDistKm={guessDistKm}
            guessScore={guessScore}
            gradeHebrew={gradeHebrew}
            feedbackText={feedbackText}
            showResult={showResult}
          />
        )}

        {(challenge.type === 'spatial_direction' ||
          challenge.type === 'spatial_order' ||
          challenge.type === 'spatial_between' ||
          challenge.type === 'identify_road' ||
          challenge.type === 'identify_junction') && (
          <SpatialChallenge
            challenge={challenge}
            selectedOptionId={selectedOptionId}
            orderedEntities={orderedEntities}
            guessScore={guessScore}
            gradeHebrew={gradeHebrew}
            feedbackText={feedbackText}
            showResult={showResult}
            onSelectOption={onSelectOption}
            onResetOrder={onResetOrder}
          />
        )}

        {challenge.type === 'build_route' && (
          <RouteChallenge
            challenge={challenge}
            routeSteps={routeSteps}
            routeStatus={routeStatus}
            guessScore={guessScore}
            gradeHebrew={gradeHebrew}
            feedbackText={feedbackText}
            showResult={showResult}
            onResetRoute={onResetRoute}
            onSelectNode={onSelectRouteNode}
          />
        )}
      </div>

      {/* Bottom Footer Navigation Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-slate-300 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>הקודם</span>
        </button>

        {showResult ? (
          <button
            onClick={onNext}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all active:scale-[0.98]"
          >
            <span>לאתגר הבא</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex-1 text-center text-xs text-slate-500 font-medium">
            השלם את האתגר במפה להמשך
          </div>
        )}
      </div>
    </div>
  );
};
