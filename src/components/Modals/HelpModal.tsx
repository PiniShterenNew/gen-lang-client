import React from 'react';
import {
  X,
  Compass,
  MousePointerClick,
  ArrowUpDown,
  Navigation,
  Sparkles,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">איך לבנות מפה מנטלית של ישראל?</h2>
              <p className="text-xs text-slate-400">מדריך למשחק התמצאות במרחב</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed custom-scrollbar">
          {/* Mode A */}
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-400 text-sm">
              <MousePointerClick className="w-4 h-4" />
              <span>1. מצב מיקום (Locate)</span>
            </div>
            <p>
              מתבקשים למקם עיר, מחלף או אתר. לוחצים ישירות על גבי המפה. המשחק מודד את המרחק האווירי המדויק בקילומטרים (ק"מ) ומעניק ניקוד לפי דיוק הפגיעה.
            </p>
          </div>

          {/* Mode B */}
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-purple-400 text-sm">
              <ArrowUpDown className="w-4 h-4" />
              <span>2. יחסים מרחביים וסדר (Spatial Relationships)</span>
            </div>
            <p>
              לומדים להבין כיוונים יחסיים (מה צפונית ממה, מה מזרחית למישור החוף) ומסדרים שרשראות של ערים ומחלפים מצפון לדרום ישירות במפה.
            </p>
          </div>

          {/* Mode C */}
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <Navigation className="w-4 h-4" />
              <span>3. בניית מסלול (Build the Route)</span>
            </div>
            <p>
              מתחברים לרשת הכבישים והמחלפים הארצית: בונים מסלול נסיעה מנקודת המוצא ליעד על ידי לחיצה על צמתים, מחלפים וכבישים ברצף גיאוגרפי הגיוני.
            </p>
          </div>

          {/* Tips */}
          <div className="bg-amber-950/30 border border-amber-800/40 p-3.5 rounded-2xl space-y-1 text-amber-200">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>טיפ ללמידה מיטבית:</span>
            </div>
            <p className="opacity-90">
              ככל שתתקדמו, נסו לכבות את שכבת התוויות (שמות הערים) באמצעות כפתורי השכבות למטה כדי לאמן את הזיכרון החזותי שלכם!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
          >
            הבנתי, בוא נשחק!
          </button>
        </div>
      </div>
    </div>
  );
};
