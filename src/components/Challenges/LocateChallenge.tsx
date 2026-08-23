import React from 'react';
import { MousePointerClick, Target, Info } from 'lucide-react';
import { Challenge } from '../../types/game';

interface LocateChallengeProps {
  challenge: Challenge;
  playerGuess: { lat: number; lon: number } | null;
  guessDistKm: number | null;
  guessScore: number | null;
  gradeHebrew: string | null;
  feedbackText: string | null;
  showResult: boolean;
}

export const LocateChallenge: React.FC<LocateChallengeProps> = ({
  challenge,
  playerGuess,
  guessDistKm,
  guessScore,
  gradeHebrew,
  feedbackText,
  showResult,
}) => {
  return (
    <div className="space-y-4">
      {/* Interactive Guidance Box */}
      {!showResult ? (
        <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3.5 flex items-start gap-3 text-sky-200">
          <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400 shrink-0 mt-0.5">
            <MousePointerClick className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="font-semibold text-sm text-sky-100">איך משחקים?</div>
            <p className="text-xs text-sky-300/90 mt-0.5 leading-relaxed">
              לחץ ישירות על גבי המפה במקום שבו אתה מעריך שנמצא היעד. ככל שתהיה קרוב יותר, תקבל יותר נקודות!
            </p>
          </div>
        </div>
      ) : (
        /* Result Score Card */
        <div
          className={`rounded-xl p-4 border transition-all ${
            (guessScore || 0) >= 80
              ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
              : (guessScore || 0) >= 50
              ? 'bg-amber-950/40 border-amber-600/60 text-amber-200'
              : 'bg-rose-950/40 border-rose-600/60 text-rose-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span className="font-bold text-base text-white">{gradeHebrew}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{guessScore}</span>
              <span className="text-xs opacity-75">/ 100 נקודות</span>
            </div>
          </div>

          {guessDistKm !== null && (
            <div className="mt-2.5 flex items-center justify-between text-xs border-t border-white/10 pt-2 font-mono">
              <span className="opacity-80">מרחק שגיאה:</span>
              <span className="font-bold text-white text-sm">{guessDistKm} ק"מ</span>
            </div>
          )}

          {feedbackText && (
            <p className="mt-2 text-xs leading-relaxed opacity-95 bg-black/20 p-2.5 rounded-lg">
              {feedbackText}
            </p>
          )}
        </div>
      )}

      {/* Educational Spatial Context when result is shown */}
      {showResult && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Info className="w-4 h-4" />
            <span>הסבר מרחבי וגיאוגרפי:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {challenge.spatialExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
