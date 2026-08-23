import React from 'react';
import { CheckCircle2, XCircle, Info, ArrowDown, RotateCcw } from 'lucide-react';
import { Challenge } from '../../types/game';
import { CITIES } from '../../data/cities';

interface SpatialChallengeProps {
  challenge: Challenge;
  selectedOptionId: string | null;
  orderedEntities: string[];
  guessScore: number | null;
  gradeHebrew: string | null;
  feedbackText: string | null;
  showResult: boolean;
  onSelectOption: (id: string) => void;
  onResetOrder: () => void;
}

export const SpatialChallenge: React.FC<SpatialChallengeProps> = ({
  challenge,
  selectedOptionId,
  orderedEntities,
  guessScore,
  gradeHebrew,
  feedbackText,
  showResult,
  onSelectOption,
  onResetOrder,
}) => {
  // If it's a spatial ordering challenge (e.g. north to south)
  if (challenge.type === 'spatial_order') {
    const targetEntities = challenge.orderEntityIds || [];

    return (
      <div className="space-y-4">
        <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-3.5 text-purple-200">
          <div className="flex items-center gap-2 font-semibold text-sm text-purple-100 mb-1">
            <ArrowDown className="w-4 h-4 text-purple-400" />
            <span>סדר את 4 הערים מצפון לדרום:</span>
          </div>
          <p className="text-xs text-purple-300 leading-relaxed">
            לחץ על הערים ישירות במפה (או ברשימה למטה) לפי הסדר הגיאוגרפי שלהן מלמעלה (צפון) למטה (דרום).
          </p>
        </div>

        {/* Selected Sequence View */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>הרצף שבחרת:</span>
            {!showResult && orderedEntities.length > 0 && (
              <button
                onClick={onResetOrder}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>אפס סדר</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {targetEntities.map((entityId, idx) => {
              const currentChoiceId = orderedEntities[idx];
              const city = CITIES.find((c) => c.id === currentChoiceId);
              const isFilled = !!currentChoiceId;

              return (
                <div
                  key={`slot-${idx}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    isFilled
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-200'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 border-dashed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[11px] text-purple-300">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-sm">
                      {city ? city.hebrewName : `בחר עיר מספר ${idx + 1}...`}
                    </span>
                  </div>
                  {isFilled && <span className="text-[11px] text-purple-400">נבחרה</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick select buttons if user prefers list */}
        {!showResult && (
          <div className="pt-1">
            <span className="text-[11px] text-slate-400 block mb-1.5">אפשרויות לבחירה:</span>
            <div className="grid grid-cols-2 gap-2">
              {targetEntities.map((id) => {
                const city = CITIES.find((c) => c.id === id);
                const isSelected = orderedEntities.includes(id);
                if (!city) return null;

                return (
                  <button
                    key={id}
                    disabled={isSelected}
                    onClick={() => {
                      // Trigger entity selection
                      const event = new CustomEvent('order-select', { detail: id });
                      window.dispatchEvent(event);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-purple-900/40 border-slate-700 hover:border-purple-500 text-slate-200'
                    }`}
                  >
                    {city.hebrewName}
                  </button>
                );
              })}
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
              <span className="font-bold text-sm text-white">{gradeHebrew}</span>
              <span className="text-lg font-black">{guessScore} נקודות</span>
            </div>
            {feedbackText && <p className="mt-2 text-xs leading-relaxed">{feedbackText}</p>}
          </div>
        )}

        {/* Spatial Explanation */}
        {showResult && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Info className="w-4 h-4" />
              <span>הסבר גיאוגרפי:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {challenge.spatialExplanation}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Standard Multiple Options (Direction / Between / Road Identification)
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {challenge.options?.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;

          let btnStyle =
            'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-200';

          if (showResult) {
            if (isCorrect) {
              btnStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 shadow-md';
            } else if (isSelected && !isCorrect) {
              btnStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200';
            } else {
              btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
            }
          }

          return (
            <button
              key={option.id}
              disabled={showResult}
              onClick={() => onSelectOption(option.id)}
              className={`w-full p-3.5 rounded-xl border text-right font-medium text-xs md:text-sm flex items-center justify-between transition-all group ${btnStyle}`}
            >
              <span>{option.label}</span>
              {showResult && (
                <div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

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
            <span className="font-bold text-sm text-white">{gradeHebrew}</span>
            <span className="text-lg font-black">{guessScore} נקודות</span>
          </div>
          {feedbackText && <p className="mt-2 text-xs leading-relaxed">{feedbackText}</p>}
        </div>
      )}
    </div>
  );
};
