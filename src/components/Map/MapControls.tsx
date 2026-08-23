import React from 'react';
import {
  Tag,
  MapPin,
  GitMerge,
  Grid,
  Layers,
  Mountain,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { UserProgress } from '../../types/game';

interface MapControlsProps {
  settings: UserProgress['settings'];
  onToggleSetting: (key: keyof UserProgress['settings']) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  settings,
  onToggleSetting,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 px-3 py-1.5 rounded-2xl shadow-2xl text-slate-300 text-xs">
      <div className="flex items-center gap-1 text-slate-400 font-medium pl-1 text-[11px]">
        <Layers className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">שכבות:</span>
      </div>

      {/* Toggle Labels */}
      <button
        onClick={() => onToggleSetting('showLabels')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showLabels
            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר שמות ותוויות יישובים"
      >
        <Tag className="w-3 h-3" />
        <span>תוויות</span>
      </button>

      {/* Toggle Topographic Relief */}
      <button
        onClick={() => onToggleSetting('showElevationRelief')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showElevationRelief
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר תבליטי גובה, רכסי הרים ומכתשים"
      >
        <Mountain className="w-3 h-3" />
        <span>טופוגרפיה</span>
      </button>

      {/* Toggle Regions */}
      <button
        onClick={() => onToggleSetting('showRegions')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showRegions
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר אזורים גיאוגרפיים"
      >
        <MapPin className="w-3 h-3" />
        <span className="hidden sm:inline">אזורים</span>
      </button>

      {/* Toggle Road Numbers */}
      <button
        onClick={() => onToggleSetting('showRoadNumbers')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showRoadNumbers
            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר מספרי כבישים"
      >
        <span className="font-mono font-bold text-[10px]">#</span>
        <span className="hidden sm:inline">מספרי כבישים</span>
      </button>

      {/* Toggle Junctions */}
      <button
        onClick={() => onToggleSetting('showJunctions')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showJunctions
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר מחלפים וצמתים"
      >
        <GitMerge className="w-3 h-3" />
        <span className="hidden sm:inline">צמתים</span>
      </button>

      {/* Toggle Grid */}
      <button
        onClick={() => onToggleSetting('showGrid')}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all font-medium cursor-pointer ${
          settings.showGrid
            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-transparent'
        }`}
        title="הצג / הסתר קווי רוחב ואורך"
      >
        <Grid className="w-3 h-3" />
        <span className="hidden sm:inline">גריד</span>
      </button>

      <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />

      {/* Sound Toggle */}
      <button
        onClick={() => onToggleSetting('soundEnabled')}
        className={`p-1.5 rounded-xl transition-all cursor-pointer ${
          settings.soundEnabled
            ? 'text-sky-400 hover:bg-slate-800'
            : 'text-slate-500 hover:bg-slate-800'
        }`}
        title={settings.soundEnabled ? 'השתק אפקטים קוליים' : 'הפעל אפקטים קוליים'}
      >
        {settings.soundEnabled ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};
