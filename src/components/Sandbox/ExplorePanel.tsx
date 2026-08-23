import React from 'react';
import {
  Compass,
  Ruler,
  MapPin,
  GitMerge,
  Route,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { GeoPoint } from '../../types/game';
import { CITIES } from '../../data/cities';
import { JUNCTIONS } from '../../data/junctions';
import { ROADS } from '../../data/roads';
import { REGIONS } from '../../data/geoData';
import { calculateDistanceKm, calculateBearing, getHebrewDirection } from '../../utils/geoUtils';

interface ExplorePanelProps {
  selectedEntity: {
    type: 'city' | 'road' | 'junction' | 'region';
    id: string;
  } | null;
  measurePoints: GeoPoint[];
  onClearMeasure: () => void;
  onExitSandbox: () => void;
}

export const ExplorePanel: React.FC<ExplorePanelProps> = ({
  selectedEntity,
  measurePoints,
  onClearMeasure,
  onExitSandbox,
}) => {
  // Measurement details
  const measureResult = React.useMemo(() => {
    if (measurePoints.length < 2) return null;
    const p1 = measurePoints[0];
    const p2 = measurePoints[1];
    const dist = calculateDistanceKm(p1, p2);
    const bearing = calculateBearing(p1, p2);
    const dir = getHebrewDirection(bearing);
    return { dist, bearing, dir };
  }, [measurePoints]);

  // Selected Entity Details
  const entityData = React.useMemo(() => {
    if (!selectedEntity) return null;
    if (selectedEntity.type === 'city') {
      const city = CITIES.find((c) => c.id === selectedEntity.id);
      return city ? { title: city.hebrewName, sub: city.englishName, ...city } : null;
    }
    if (selectedEntity.type === 'junction') {
      const junc = JUNCTIONS.find((j) => j.id === selectedEntity.id);
      return junc ? { title: junc.hebrewName, sub: junc.englishName, ...junc } : null;
    }
    if (selectedEntity.type === 'road') {
      const road = ROADS.find((r) => r.id === selectedEntity.id);
      return road ? { title: road.hebrewName, sub: `כביש מספר ${road.number}`, ...road } : null;
    }
    if (selectedEntity.type === 'region') {
      const reg = REGIONS.find((r) => r.id === selectedEntity.id);
      return reg ? { title: reg.hebrewName, sub: reg.englishName, ...reg } : null;
    }
    return null;
  }, [selectedEntity]);

  return (
    <div className="w-full md:w-[420px] lg:w-[460px] flex-1 md:h-full min-h-0 shrink-0 bg-slate-900/95 border-t md:border-t-0 md:border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between shadow-2xl z-10 text-slate-100 select-none overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/40">
              <Compass className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-white">מצב חקירה חופשית</h2>
          </div>
          <button
            onClick={onExitSandbox}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            חזרה לאתגרים
          </button>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          חקור את מפת ישראל ללא הגבלת זמן: לחץ על כל עיר, כביש, צומת או אזור, או לחץ על 2 נקודות למדידת מרחקים וכיוונים.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 p-5 overflow-y-auto space-y-4 custom-scrollbar">
        {/* Measurement Widget */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <Ruler className="w-4 h-4" />
              <span>סרגל מרחקים אווירי:</span>
            </div>
            {measurePoints.length > 0 && (
              <button
                onClick={onClearMeasure}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300"
              >
                <RotateCcw className="w-3 h-3" />
                <span>נקה מדידה</span>
              </button>
            )}
          </div>

          {measurePoints.length === 0 && (
            <p className="text-xs text-slate-400">
              לחץ על 2 נקודות כלשהן במפה כדי למדוד מרחק וכיוון ביניהן.
            </p>
          )}

          {measurePoints.length === 1 && (
            <div className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>נקודה ראשונה נבחרה. לחץ על נקודה שנייה במפה...</span>
            </div>
          )}

          {measureResult && (
            <div className="bg-sky-950/40 border border-sky-800/60 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sky-300">מרחק אווירי:</span>
                <span className="text-xl font-black text-white font-mono">
                  {measureResult.dist} ק"מ
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-sky-800/40 pt-2 text-sky-300">
                <span>כיוון מנקודה 1 ל-2:</span>
                <span className="font-bold text-white font-mono">
                  {measureResult.dir} ({Math.round(measureResult.bearing)}°)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Entity Card */}
        {entityData ? (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 bg-sky-950/60 rounded border border-sky-800 inline-block mb-1">
                  {selectedEntity?.type === 'city'
                    ? 'עיר'
                    : selectedEntity?.type === 'road'
                    ? 'כביש'
                    : selectedEntity?.type === 'junction'
                    ? 'מחלף / צומת'
                    : 'אזור'}
                </span>
                <h3 className="text-lg font-black text-white">{entityData.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{entityData.sub}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-lg">
              {entityData.description}
            </p>

            {/* Spatial Context Hints if available */}
            {'spatialHint' in entityData && entityData.spatialHint && (
              <div className="text-xs text-amber-200 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg space-y-1">
                <div className="flex items-center gap-1 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>עוגן מרחבי:</span>
                </div>
                <p className="leading-relaxed opacity-90">{entityData.spatialHint}</p>
              </div>
            )}

            {/* Connected Roads if available */}
            {'relatedRoads' in entityData && entityData.relatedRoads && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-400 block font-medium">כבישים מקשרים:</span>
                <div className="flex flex-wrap gap-1.5">
                  {entityData.relatedRoads.map((roadId: string) => {
                    const road = ROADS.find((r) => r.id === roadId);
                    return (
                      <span
                        key={roadId}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200"
                      >
                        {road ? road.hebrewName : roadId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 space-y-2 border border-slate-800/50 rounded-xl p-4">
            <MapPin className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs">לחץ על כל אובייקט במפה כדי לקבל מידע מרחבי מפורט</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <button
          onClick={onExitSandbox}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all"
        >
          חזרה למשחק האתגרים
        </button>
      </div>
    </div>
  );
};
