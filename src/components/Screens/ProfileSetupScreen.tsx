import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { UserProfile } from '../../types/game';

interface ProfileSetupScreenProps {
  currentProfile: UserProfile;
  onSaveProfile: (name: string, avatar: string) => void;
  onBack: () => void;
}

const AVATARS = [
  { id: 'compass', emoji: '🧭', name: 'נווט שטח', desc: 'מתמחה בכיוונים ושושנת הרוחות' },
  { id: 'map', emoji: '🗺️', name: 'סייר גיאוגרפי', desc: 'חוקר מפות ותבליטי גובה' },
  { id: 'mountain', emoji: '🏔️', name: 'מטפס פסגות', desc: 'מומחה רכסי הרים וצפון הארץ' },
  { id: 'desert', emoji: '🏜️', name: 'סייר מדבר', desc: 'שולט בנגב, במכתשים ובערבה' },
  { id: 'car', emoji: '🚗', name: 'נהג צירים', desc: 'שולט בכל הכבישים והמחלפים' },
  { id: 'eagle', emoji: '🦅', name: 'מבט-על', desc: 'תפיסה מרחבית פנורמית' },
  { id: 'star', emoji: '⭐', name: 'אלוף הניווט', desc: 'מהירות תגובה ודיוק מושלם' },
  { id: 'trail', emoji: '🏕️', name: 'מוביל שבילים', desc: 'מכיר כל נקודת ציון בארץ' },
];

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  currentProfile,
  onSaveProfile,
  onBack,
}) => {
  const [name, setName] = useState(currentProfile.name || 'סייר שטח');
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile.avatar || '🧭');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSaveProfile(name.trim(), selectedAvatar);
  };

  return (
    <div className="relative min-h-[100vh] bg-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden" dir="rtl">
      {/* Glow effects */}
      <div className="absolute top-10 right-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-4xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
          <span>חזרה לעמוד הראשי</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">שלב 1 מתוך 2: הגדרת שחקן</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>יצירת פרופיל נווט</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">איך נקרא לך במסע?</h2>
            <p className="text-slate-400 text-sm">
              בחר את שמך ודמות הנווט שלך. כל ההישגים והמפה המנטלית יישמרו על שמך.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Player Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">שם השחקן / הנווט</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="הקלד את שמך כאן..."
                  maxLength={25}
                  required
                  className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Avatar Picker Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
                <span>בחר דמות ואייקון נווט:</span>
                <span className="text-sky-400 font-normal text-[11px]">8 דמויות ייחודיות</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.emoji;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.emoji)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-2xl">{av.emoji}</span>
                        {isSelected && <ShieldCheck className="w-4 h-4 text-sky-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{av.name}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{av.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Profile Preview Badge */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  {selectedAvatar}
                </div>
                <div>
                  <div className="text-sm font-black text-white">{name.trim() || 'סייר שטח'}</div>
                  <div className="text-xs text-sky-400 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>דרגת נווט: מתלמד שטח (רמה 1)</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-slate-400 font-mono">מפה מנטלית</div>
                <div className="text-xs font-bold text-emerald-400">מוכן לשיגור 🚀</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 disabled:opacity-50 text-slate-950 font-black text-base shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>המשך לבחירת רמות והגדרות מפה</span>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        שלב 1: כניסה והגדרת שם • השלב הבא: בחירת רמת קושי והגדרות מפה
      </footer>
    </div>
  );
};
