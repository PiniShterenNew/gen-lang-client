import React from 'react';
import {
  Navigation,
  CheckCircle2,
  Route as RouteIcon,
  RotateCcw,
  Info,
} from 'lucide-react';
import { Challenge } from '../../types/game';
import { CITIES } from '../../data/cities';
import { JUNCTIONS } from '../../data/junctions';

interface RouteChallengeProps {
  challenge: Challenge;
  routeSteps: string[];
  routeStatus: 'idle' | 'in_progress' | 'valid' | 'invalid';
  guessScore: number | null;
  gradeHebrew: string | null;
  feedbackText: string | null;
  showResult: boolean;
  onResetRoute: () => void;
  onSelectNode: (nodeId: string) => void;
}

export const RouteChallenge: React.FC<RouteChallengeProps> = ({
  challenge,
  routeSteps,
  guessScore,
  gradeHebrew,
  feedbackText,
  showResult,
  onResetRoute,
  onSelectNode,
}) => {
  const getNodeName = (id: string): string => {
    const city = CITIES.find((c) => c.id === id);
    if (city) return city.hebrewName;
    const junc = JUNCTIONS.find((j) => j.id === id);
    if (junc) return junc.hebrewName;
    return id;
  };

  // Find candidate connecting nodes to display for easy clicking
  const candidateNodes = [
    'junc-ganot',
    'junc-ben-shemen',
    'junc-anava',
    'junc-shaar-hagai',
    'junc-ashdod',
    'junc-sorek',
    'junc-qastina',
    'junc-plugot',
    'junc-lehavim',
    'junc-glilot',
    'junc-morasha',
    'junc-kesem',
    'junc-iron',
    'junc-megiddo',
    'junc-yokneam',
    'junc-golani',
    'junc-hamovil',
    'junc-amiad',
    'junc-arava',
    'dimona',
    'mitzpe-ramon',
    'jerusalem',
    'beer-sheva',
    'eilat',
    'tel-aviv',
    'haifa',
    'tiberias',
  ];

  return (
    <div className="space-y-4">
      {/* Route Header Info */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 text-emerald-200">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-1">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>בניית מסלול נסיעה:</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 bg-emerald-900/60 rounded-full font-mono">
            {routeSteps.length} תחנות
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2 font-bold text-sm text-white">
          <span className="px-2 py-1 bg-emerald-800/60 rounded-lg text-emerald-200">
            {challenge.startNodeName}
          </span>
          <span className="text-emerald-400">➔</span>
          <span className="px-2 py-1 bg-sky-800/60 rounded-lg text-sky-200">
            {challenge.targetNodeName}
          </span>
        </div>
      </div>

      {/* Built Route Sequence Tracker */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>תחנות המסלול שנבחרו:</span>
          {!showResult && routeSteps.length > 1 && (
            <button
              onClick={onResetRoute}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>התחל מחדש</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          {routeSteps.map((nodeId, idx) => {
            const isStart = idx === 0;
            const isEnd = nodeId === challenge.targetNodeId;

            return (
              <React.Fragment key={`step-${idx}`}>
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm ${
                    isStart
                      ? 'bg-emerald-600 text-white'
                      : isEnd
                      ? 'bg-sky-600 text-white animate-bounce'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{idx + 1}.</span>
                  <span>{getNodeName(nodeId)}</span>
                </div>
                {idx < routeSteps.length - 1 && (
                  <span className="text-slate-500 text-xs">➔</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Recommended Roads & Quick Selection Buttons */}
      {!showResult && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>בחר את הצומת / מחלף הבא במסלול:</span>
            <span className="text-[10px] text-slate-500">ניתן ללחוץ גם ישירות על המפה</span>
          </div>

          <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
            <div className="grid grid-cols-2 gap-1.5">
              {candidateNodes
                .filter((id) => id !== challenge.startNodeId)
                .slice(0, 10)
                .map((id) => {
                  const isSelected = routeSteps.includes(id);
                  const isTarget = id === challenge.targetNodeId;

                  return (
                    <button
                      key={id}
                      disabled={isSelected}
                      onClick={() => onSelectNode(id)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-right transition-all flex items-center justify-between ${
                        isSelected
                          ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                          : isTarget
                          ? 'bg-sky-950/60 hover:bg-sky-900/80 border-sky-600/70 text-sky-200 font-bold'
                          : 'bg-slate-800/80 hover:bg-emerald-950/50 border-slate-700 hover:border-emerald-600 text-slate-200'
                      }`}
                    >
                      <span className="truncate">{getNodeName(id)}</span>
                      {isTarget && <RouteIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      {showResult && (
        <div
          className={`rounded-xl p-4 border ${
            (guessScore || 0) >= 80
              ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-600/60 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{gradeHebrew}</span>
            </div>
            <span className="text-xl font-black">{guessScore} נקודות</span>
          </div>
          {feedbackText && <p className="mt-2 text-xs leading-relaxed">{feedbackText}</p>}
        </div>
      )}

      {/* Spatial Explanation */}
      {showResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Info className="w-4 h-4" />
            <span>הנתיב המרכזי במציאות:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {challenge.spatialExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
