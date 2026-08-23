import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Route,
  Award,
  ChevronLeft,
  Sparkles,
  Mountain,
  Layers,
  Zap,
} from 'lucide-react';
import { UserProgress } from '../../types/game';

interface LandingScreenProps {
  progress: UserProgress;
  onStartFlow: () => void;
  onQuickSandbox: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  progress,
  onStartFlow,
  onQuickSandbox,
}) => {
  const completedCount = Object.keys(progress.completedChallenges).length;

  return (
    <div className="relative min-h-[100vh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden" dir="rtl">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-sky-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              מפה מנטלית <span className="text-sky-400 text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">ישראל 3D</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">משחק התמצאות מרחבית ואינטואיציה גיאוגרפית</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {completedCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-semibold">{progress.profile.name}</span>
              <span className="text-amber-400 font-bold">({progress.totalScore} נק׳)</span>
            </div>
          )}
          <button
            onClick={onQuickSandbox}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>מצב חקירה חופשי</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left / Right Content based on RTL */}
        <div className="flex-1 text-right max-w-xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>פיתוח אינטואיציה מרחבית אמיתית ללא תלות ב-GPS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight"
          >
            בנה את <span className="bg-gradient-to-l from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">המפה המנטלית</span> של ישראל בראשך
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed"
          >
            לא עוד שאלות טריוויה יבשות. משחק אינטראקטיבי המפתח תפיסה מרחבית עמוקה: מיקום ערי עוגן, יחסי כיוונים, צמתים מרכזיים, רכסי הרים ובניית צירי תנועה ארציים.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              onClick={onStartFlow}
              className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-sky-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>{completedCount > 0 ? 'המשך במסע לידיעת הארץ' : 'התחל עכשיו - כניסה ובחירת שחקן'}</span>
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </button>

            <button
              onClick={onQuickSandbox}
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Mountain className="w-4 h-4 text-emerald-400" />
              <span>סיור טופוגרפי חופשי</span>
            </button>
          </motion.div>

          {/* Feature Highlights Pill Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 pt-4 text-center"
          >
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <MapPin className="w-5 h-5 text-sky-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200">ערי עוגן וצירים</div>
              <div className="text-[10px] text-slate-400">איתור מדויק במפה עיוורת</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <Route className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200">בניית מסלולים</div>
              <div className="text-[10px] text-slate-400">חיבור צמתים וכבישים</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <Mountain className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xs font-bold text-slate-200">טופוגרפיה ריאליסטית</div>
              <div className="text-[10px] text-slate-400">הרים, מכתשים ושברים</div>
            </div>
          </motion.div>
        </div>

        {/* Right / Interactive Map Teaser Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full max-w-md"
        >
          <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Header of Preview Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 mr-2">GIS Mental View</span>
              </div>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Zap className="w-3 h-3" />
                <span>מצב פעיל</span>
              </div>
            </div>

            {/* Mini Map Art illustration */}
            <div className="py-6 flex flex-col items-center justify-center relative">
              <div className="w-48 h-64 relative border border-slate-800/80 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-amber-950/40 flex items-center justify-center p-3 shadow-inner">
                {/* Visual landmark nodes */}
                <div className="absolute top-4 left-16 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-sky-400 animate-ping" />
                  <span className="text-[9px] font-bold text-sky-300">החרמון & גליל</span>
                </div>
                <div className="absolute top-20 right-8 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-300">חיפה ומפרץ</span>
                </div>
                <div className="absolute top-28 right-12 flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-[9px] font-bold text-blue-300">גוש דן ות״א</span>
                </div>
                <div className="absolute top-36 left-12 flex items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-black text-amber-300">ירושלים</span>
                </div>
                <div className="absolute top-48 right-16 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <span className="text-[9px] font-bold text-orange-300">באר שבע</span>
                </div>
                <div className="absolute bottom-3 left-18 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="text-[9px] font-bold text-rose-300">אילת ומפרץ</span>
                </div>

                {/* Connecting road lines */}
                <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-40">
                  <line x1="80" y1="30" x2="60" y2="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="60" y1="90" x2="70" y2="120" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="70" y1="120" x2="100" y2="150" stroke="#10b981" strokeWidth="2" />
                  <line x1="70" y1="120" x2="75" y2="200" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="75" y1="200" x2="90" y2="245" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* Progress Stat Bar */}
              <div className="w-full mt-5 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-300">התקדמות המפה המנטלית</span>
                  <span className="text-sky-400 font-bold">{progress.profile.totalMasteryPercent}% הושלמו</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(5, progress.profile.totalMasteryPercent)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        פלטפורמה פדגוגית ללמידת מרחב ישראל • פותח עבור חוויית למידה אינטואיטיבית ומדויקת
      </footer>
    </div>
  );
};
