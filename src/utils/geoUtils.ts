import { GeoPoint } from '../types/game';

// Israel geographic bounding box for SVG projection
export const MAP_BOUNDS = {
  minLat: 29.35, // South (below Eilat)
  maxLat: 33.45, // North (Mount Hermon / Metula)
  minLon: 34.15, // West (Sinai / Mediterranean)
  maxLon: 35.95, // East (Golan Heights / Jordan Valley)
  svgWidth: 600,
  svgHeight: 1100,
};

/**
 * Converts Geographic (Lat, Lon) into SVG Canvas (X, Y)
 */
export function latLonToSvg(lat: number, lon: number): { x: number; y: number } {
  const { minLat, maxLat, minLon, maxLon, svgWidth, svgHeight } = MAP_BOUNDS;
  
  const x = ((lon - minLon) / (maxLon - minLon)) * svgWidth;
  const y = ((maxLat - lat) / (maxLat - minLat)) * svgHeight;
  
  return { x, y };
}

/**
 * Converts SVG Canvas (X, Y) back into Geographic (Lat, Lon)
 */
export function svgToLatLon(x: number, y: number): GeoPoint {
  const { minLat, maxLat, minLon, maxLon, svgWidth, svgHeight } = MAP_BOUNDS;
  
  const clampedX = Math.max(0, Math.min(svgWidth, x));
  const clampedY = Math.max(0, Math.min(svgHeight, y));
  
  const lon = minLon + (clampedX / svgWidth) * (maxLon - minLon);
  const lat = maxLat - (clampedY / svgHeight) * (maxLat - minLat);
  
  return { lat, lon };
}

/**
 * Calculates Haversine distance in Kilometers between two GeoPoints
 */
export function calculateDistanceKm(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLon = ((p2.lon - p1.lon) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates the bearing from point A to point B in degrees (0 = North, 90 = East, 180 = South, 270 = West)
 */
export function calculateBearing(from: GeoPoint, to: GeoPoint): number {
  const y = Math.sin(((to.lon - from.lon) * Math.PI) / 180) * Math.cos((to.lat * Math.PI) / 180);
  const x =
    Math.cos((from.lat * Math.PI) / 180) * Math.sin((to.lat * Math.PI) / 180) -
    Math.sin((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.cos(((to.lon - from.lon) * Math.PI) / 180);
      
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Returns a Hebrew direction string (e.g. צפון-מזרח) based on bearing
 */
export function getHebrewDirection(bearingDeg: number): string {
  const directions = [
    { label: 'צפון', min: 337.5, max: 360 },
    { label: 'צפון', min: 0, max: 22.5 },
    { label: 'צפון-מזרח', min: 22.5, max: 67.5 },
    { label: 'מזרח', min: 67.5, max: 112.5 },
    { label: 'דרום-מזרח', min: 112.5, max: 157.5 },
    { label: 'דרום', min: 157.5, max: 202.5 },
    { label: 'דרום-מערב', min: 202.5, max: 247.5 },
    { label: 'מערב', min: 247.5, max: 292.5 },
    { label: 'צפון-מערב', min: 292.5, max: 337.5 },
  ];
  
  for (const d of directions) {
    if (bearingDeg >= d.min && bearingDeg < d.max) {
      return d.label;
    }
  }
  return 'צפון';
}

/**
 * Calculate game score for location guess based on distance error
 */
export function calculateLocateScore(distKm: number, toleranceKm: number = 8): {
  score: number;
  accuracyGrade: 'perfect' | 'excellent' | 'good' | 'fair' | 'miss';
  gradeHebrew: string;
  feedbackText: string;
} {
  if (distKm <= toleranceKm) {
    return {
      score: 100,
      accuracyGrade: 'perfect',
      gradeHebrew: 'בול פגיעה! 🎯',
      feedbackText: `דיוק יוצא מן הכלל! סטייה של ${distKm} ק"מ בלבד.`,
    };
  }
  
  if (distKm <= 20) {
    const score = Math.round(100 - ((distKm - toleranceKm) / 12) * 20); // 80-99
    return {
      score: Math.max(80, score),
      accuracyGrade: 'excellent',
      gradeHebrew: 'מצוין! 🌟',
      feedbackText: `קרוב מאוד ליעד (מרחק של ${distKm} ק"מ). הבנה מרחבית מצוינת!`,
    };
  }
  
  if (distKm <= 45) {
    const score = Math.round(80 - ((distKm - 20) / 25) * 30); // 50-79
    return {
      score: Math.max(50, score),
      accuracyGrade: 'good',
      gradeHebrew: 'טוב מאוד 👍',
      feedbackText: `בכיוון הנכון! סטייה של ${distKm} ק"מ.`,
    };
  }
  
  if (distKm <= 80) {
    const score = Math.round(50 - ((distKm - 45) / 35) * 25); // 25-49
    return {
      score: Math.max(25, score),
      accuracyGrade: 'fair',
      gradeHebrew: 'כמעט, אך באזור אחר 🧭',
      feedbackText: `המרחק מהיעד הוא ${distKm} ק"מ. שים לב למיקום ביחס לערים הסמוכות.`,
    };
  }
  
  const score = Math.max(5, Math.round(25 - Math.min(20, (distKm - 80) / 10)));
  return {
    score,
    accuracyGrade: 'miss',
    gradeHebrew: 'פספוס מרחבי 📍',
    feedbackText: `סטייה של ${distKm} ק"מ. נסה לזכור את האזור הגיאוגרפי והכבישים המובילים אליו.`,
  };
}

/**
 * Generates SVG Path Data string 'M x y L x y ... Z' from GeoPoints
 */
export function geoPolygonToSvgPath(points: GeoPoint[], close: boolean = true): string {
  if (!points || points.length === 0) return '';
  return (
    points
      .map((p, i) => {
        const { x, y } = latLonToSvg(p.lat, p.lon);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ') + (close ? ' Z' : '')
  );
}

/**
 * Generates smooth bezier SVG path data for roads
 */
export function geoPolylineToSvgPath(points: GeoPoint[]): string {
  if (!points || points.length === 0) return '';
  return points
    .map((p, i) => {
      const { x, y } = latLonToSvg(p.lat, p.lon);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

/**
 * Standard Ray-casting algorithm to test if a GeoPoint is inside a polygon
 */
export function isPointInPolygon(point: GeoPoint, polygon: GeoPoint[]): boolean {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lon, yi = polygon[i].lat;
    const xj = polygon[j].lon, yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lon < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Checks if a clicked point is inside Israel's landmass/outline or within a generous coastal/border tolerance (buffer).
 * Prevents invalid clicks out in the Mediterranean sea or neighboring countries.
 */
export function isPointInIsrael(
  point: GeoPoint,
  polygon: GeoPoint[],
  toleranceKm: number = 6
): boolean {
  // 1. Direct ray-casting test
  if (isPointInPolygon(point, polygon)) {
    return true;
  }

  // 2. Proximity buffer test for coastline / border points (so near-border clicks aren't lost)
  for (let i = 0; i < polygon.length; i++) {
    const dist = calculateDistanceKm(point, polygon[i]);
    if (dist <= toleranceKm) {
      return true;
    }
  }

  return false;
}
