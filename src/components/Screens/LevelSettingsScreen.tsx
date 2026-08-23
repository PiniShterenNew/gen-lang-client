import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layers,
  Clock,
  Play,
} from 'lucide-react';
import { DifficultyLevel, MapStyleTheme, UserProgress } from '../../types/game';
import { STAGES } from '../../data/stages';

interface LevelSettingsScreenProps {
  progress: UserProgress;
  onSetDifficulty: (diff: DifficultyLevel) => void;
  onSetMapTheme: (theme: MapStyleTheme) => void;
  onSelectStage: (stageId: number) => void;
  onToggleSound: () => void;
  onStartGame: () => void;
  onBack: () => void;
}

export const LevelSettingsScreen: React.FC<LevelSettingsScreenProps> = ({
  progress,
  onSetDifficulty,
  onSetMapTheme,
  onSelectStage,
  onToggleSound,
  onStartGame,
  onBack,
}) => {
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>(progress.difficulty || 'beginner');
  const [selectedTheme, setSelectedTheme] = useState<MapStyleTheme>(progress.settings.mapTheme || 'satellite-topography');
  const [selectedStageId, setSelectedStageId] = useState<number>(progress.currentStage || 1);

  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setSelectedDiff(diff);
    onSetDifficulty(diff);
  };

  const handleThemeChange = (theme: MapStyleTheme) => {
    setSelectedTheme(theme);
    onSetMapTheme(theme);
  };

  const handleStageChange = (stId: number) => {
    setSelectedStageId(stId);
    onSelectStage(stId);
  };

  const handleLaunch = () => {
    onStartGame();
  };

  return (
    <div className="relative min-h-[100vh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden" dir="rtl">
      {/* Background Ambience */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>חזרה לפרופיל השחקן</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs">
            <span>{progress.profile.avatar}</span>
            <span className="font-bold text-white">{progress.profile.name}</span>
          </div>
          <div className="text-xs font-mono text-slate-400">שלב 2 מתוך 2: הגדרות ורמות</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>התאמת חוויית הניווט</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">רמת אתגר והגדרות מפה</h2>
          <p className="text-slate-400 text-sm">
            בחר את רמת הקושי המתאימה, סגנון המפה הריאליסטית ושלב הפתיחה.
          </p>
        </div>

        {/* 1. Difficulty Level Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">בחר רמת קושי:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level 1: Beginner */}
            <button
              type="button"
              onClick={() => handleDifficultyChange('beginner')}
              className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                selectedDiff === 'beginner'
                  ? 'bg-emerald-500/15 border-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🟢</span>
                {selectedDiff === 'beginner' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <div className="text-sm font-black text-white">מטייל מתחיל (עם עזרי מפה)</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  שמות ערים וצירים גלויים, רדיוס סובלנות נדיב (15 ק״מ), רמזים חופשיים ללא הגבלה.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-emerald-400">מומלץ ללמידה ראשונית</div>
            </button>

            {/* Level 2: Advanced */}
            <button
              type="button"
              onClick={() => handleDifficultyChange('advanced')}
              className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                selectedDiff === 'advanced'
                  ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🟡</span>
                {selectedDiff === 'advanced' && <CheckCircle2 className="w-5 h-5 text-sky-400" />}
              </div>
              <div>
                <div className="text-sm font-black text-white">נווט מתקדם (מפה נקייה)</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  מפה ריאליסטית ללא שמות ערים, מדידת דיוק קפדנית, אתגרי סדרים ויחסי כיוון.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-sky-400">בניית מפה מנטלית אמיתית</div>
            </button>

            {/* Level 3: Pro Explorer */}
            <button
              type="button"
              onClick={() => handleDifficultyChange('pro_navigator')}
              className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                selectedDiff === 'pro_navigator'
                  ? 'bg-rose-500/15 border-rose-400 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">🔴</span>
                {selectedDiff === 'pro_navigator' && <CheckCircle2 className="w-5 h-5 text-rose-400" />}
              </div>
              <div>
                <div className="text-sm font-black text-white">אלוף הניווט (עיוור + טיימר)</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  מפת שטח עיוורת ללא שום תוויות, טיימר אתגר לבונוס ניקוד כפול, בניית מסלולים מורכבים.
                </p>
              </div>
              <div className="text-[11px] font-semibold text-rose-400">לאלופי גיאוגרפיה בלבד</div>
            </button>
          </div>
        </div>

        {/* 2. Map Realism Theme Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">בחר סגנון מפה ריאליסטי:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleThemeChange('satellite-topography')}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                selectedTheme === 'satellite-topography'
                  ? 'bg-sky-500/20 border-sky-400 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold">🛰️ לווין וטופוגרפיה ריאליסטית</div>
                <div className="text-[10px] text-slate-400">תבליטי הרים, ימות, עמקים ומכתשים</div>
              </div>
              {selectedTheme === 'satellite-topography' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('atlas-realistic')}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                selectedTheme === 'atlas-realistic'
                  ? 'bg-sky-500/20 border-sky-400 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold">🗺️ אטלס פיזי קלאסי</div>
                <div className="text-[10px] text-slate-400">עיצוב קרטוגרפי נקי עם הדגשת צירים</div>
              </div>
              {selectedTheme === 'atlas-realistic' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('tactical-dark')}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                selectedTheme === 'tactical-dark'
                  ? 'bg-sky-500/20 border-sky-400 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="text-xs font-bold">🌌 לילה טקטי (GIS Dark)</div>
                <div className="text-[10px] text-slate-400">תצוגה וקטורית כהה עם שכבות זוהרות</div>
              </div>
              {selectedTheme === 'tactical-dark' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* 3. Starting Stage Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">בחר שלב פתיחה למסע:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {STAGES.map((st) => {
              const isSelected = selectedStageId === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStageChange(st.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-sky-400">שלב {st.id}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{st.hebrewTitle}</div>
                  <div className="text-[10px] text-slate-400">{st.challengeIds.length} אתגרים</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Quick Sound and Settings Toggle Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSound}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              {progress.settings.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>צלילי אינטראקציה: פעיל</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>צלילים: מושתק</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>תבליטי גובה מופעלים</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>שמירה אוטומטית מקומית</span>
          </div>
        </div>

        {/* Start Game Launch Button */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="pt-2"
        >
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-slate-950 font-black text-lg shadow-2xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            <span>צא לדרך והתחל לשחק במפה!</span>
          </button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        הגדרות נשמרות באופן אוטומטי • ניתן לשנות את רמת הקושי והשכבות בכל רגע מתוך המפה
      </footer>
    </div>
  );
};
