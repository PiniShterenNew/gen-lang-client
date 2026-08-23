import { GeoPoint, Region } from '../types/game';

// Detailed accurate outline boundary of Israel
export const ISRAEL_OUTLINE_COORDS: GeoPoint[] = [
  // Rosh HaNikra (NW point on border with Lebanon)
  { lat: 33.093, lon: 35.104 },
  { lat: 33.080, lon: 35.180 },
  { lat: 33.060, lon: 35.250 },
  { lat: 33.080, lon: 35.380 },
  { lat: 33.150, lon: 35.450 },
  { lat: 33.240, lon: 35.560 }, // Metula area / Northern tip
  { lat: 33.280, lon: 35.580 }, // Northern Galilee tip
  { lat: 33.300, lon: 35.770 }, // Mt. Hermon
  { lat: 33.250, lon: 35.840 }, // Northern Golan
  { lat: 33.100, lon: 35.880 }, // Eastern Golan / Quneitra area
  { lat: 32.880, lon: 35.860 }, // Southern Golan / Hamat Gader
  { lat: 32.700, lon: 35.620 }, // Yarmuk confluence / Jordan valley start
  { lat: 32.500, lon: 35.550 }, // Beit Shean Valley
  { lat: 32.250, lon: 35.520 }, // Central Jordan Valley
  { lat: 32.000, lon: 35.530 }, // Lower Jordan Valley
  { lat: 31.800, lon: 35.520 }, // Dead Sea North
  { lat: 31.500, lon: 35.450 }, // Dead Sea Central
  { lat: 31.250, lon: 35.380 }, // Dead Sea South / Sodom
  { lat: 31.000, lon: 35.340 }, // Arava North / Hatzeva
  { lat: 30.700, lon: 35.240 }, // Arava Central / Ein Yahav
  { lat: 30.300, lon: 35.150 }, // Paran / Ketura area
  { lat: 29.850, lon: 35.050 }, // Yotvata
  { lat: 29.550, lon: 34.960 }, // Eilat East / Jordan Border
  { lat: 29.530, lon: 34.940 }, // Eilat Bay / Red Sea coast
  { lat: 29.490, lon: 34.900 }, // Taba Border (Egypt)
  { lat: 29.700, lon: 34.820 }, // Eilat Mountains (Egypt Border)
  { lat: 30.150, lon: 34.700 }, // Uvda area border
  { lat: 30.600, lon: 34.550 }, // Mitzpe Ramon area border
  { lat: 30.900, lon: 34.400 }, // Nitzana area
  { lat: 31.250, lon: 34.280 }, // Kerem Shalom / Gaza corner
  { lat: 31.330, lon: 34.220 }, // Rafah
  { lat: 31.420, lon: 34.330 }, // Khan Yunis
  { lat: 31.540, lon: 34.440 }, // Gaza City
  { lat: 31.600, lon: 34.500 }, // Erez / Ashkelon South
  { lat: 31.670, lon: 34.560 }, // Ashkelon Coast
  { lat: 31.810, lon: 34.640 }, // Ashdod Coast
  { lat: 31.980, lon: 34.750 }, // Rishon / Bat Yam Coast
  { lat: 32.080, lon: 34.770 }, // Tel Aviv Coast
  { lat: 32.180, lon: 34.800 }, // Herzliya Coast
  { lat: 32.330, lon: 34.850 }, // Netanya Coast
  { lat: 32.440, lon: 34.880 }, // Hadera / Mikhmoret
  { lat: 32.600, lon: 34.920 }, // Dor / Atlit Coast
  { lat: 32.830, lon: 34.970 }, // Haifa Cape / Bat Galim
  { lat: 32.820, lon: 35.040 }, // Haifa Bay / Kishon
  { lat: 32.930, lon: 35.070 }, // Akko Coast
  { lat: 33.010, lon: 35.090 }, // Nahariya Coast
  { lat: 33.093, lon: 35.104 }, // Rosh HaNikra
];

// Sea of Galilee (Kinneret)
export const KINNERET_COORDS: GeoPoint[] = [
  { lat: 32.890, lon: 35.570 }, // Capernaum / Jordan Inlet
  { lat: 32.880, lon: 35.630 }, // Bethsaida
  { lat: 32.820, lon: 35.645 }, // Kursi / East Coast
  { lat: 32.740, lon: 35.620 }, // Ein Gev
  { lat: 32.705, lon: 35.585 }, // HaOn / Degania Outlet
  { lat: 32.710, lon: 35.560 }, // Kinneret Moshava
  { lat: 32.790, lon: 35.535 }, // Tiberias
  { lat: 32.860, lon: 35.525 }, // Tabgha
  { lat: 32.890, lon: 35.570 },
];

// Dead Sea (ים המלח)
export const DEAD_SEA_COORDS: GeoPoint[] = [
  { lat: 31.780, lon: 35.520 }, // Kalia / North
  { lat: 31.770, lon: 35.560 }, // Jordan River mouth
  { lat: 31.600, lon: 35.550 }, // Eastern Jordanian shore
  { lat: 31.400, lon: 35.480 }, // Lisan peninsula area
  { lat: 31.250, lon: 35.450 }, // South basin east
  { lat: 31.050, lon: 35.410 }, // Sodom evaporation ponds
  { lat: 31.050, lon: 35.360 }, // Sodom west
  { lat: 31.190, lon: 35.365 }, // Ein Bokek
  { lat: 31.320, lon: 35.385 }, // Masada shore
  { lat: 31.460, lon: 35.395 }, // Ein Gedi
  { lat: 31.650, lon: 35.440 }, // Mitzpe Shalem
  { lat: 31.780, lon: 35.520 },
];

// Topographic Relief Elevation Polygons (Mountains, Craters, Ridges)
export interface TopoFeature {
  id: string;
  name: string;
  type: 'mountain' | 'ridge' | 'crater' | 'valley' | 'desert';
  polygon: GeoPoint[];
  color: string;
  elevation: string;
}

export const TOPOGRAPHIC_RELIEF: TopoFeature[] = [
  // 1. Mount Hermon (חרמון) - Highest elevation in Israel
  {
    id: 'hermon',
    name: 'רכס החרמון (2,814 מטר)',
    type: 'mountain',
    polygon: [
      { lat: 33.310, lon: 35.760 },
      { lat: 33.325, lon: 35.820 },
      { lat: 33.270, lon: 35.830 },
      { lat: 33.240, lon: 35.760 },
      { lat: 33.270, lon: 35.730 },
    ],
    color: '#e2e8f0',
    elevation: '2,814m',
  },
  // 2. Upper Galilee Peaks (הר מירון והגליל העליון)
  {
    id: 'meron-peaks',
    name: 'גוש הר מירון והגליל העליון (1,204 מטר)',
    type: 'mountain',
    polygon: [
      { lat: 33.020, lon: 35.350 },
      { lat: 33.040, lon: 35.440 },
      { lat: 32.960, lon: 35.480 },
      { lat: 32.920, lon: 35.380 },
      { lat: 32.960, lon: 35.320 },
    ],
    color: '#064e3b',
    elevation: '1,204m',
  },
  // 3. Mount Carmel Ridge (רכס הכרמל)
  {
    id: 'carmel-ridge',
    name: 'רכס הכרמל (546 מטר)',
    type: 'ridge',
    polygon: [
      { lat: 32.820, lon: 34.980 },
      { lat: 32.770, lon: 35.050 },
      { lat: 32.650, lon: 35.080 },
      { lat: 32.600, lon: 34.980 },
      { lat: 32.700, lon: 34.960 },
    ],
    color: '#047857',
    elevation: '546m',
  },
  // 4. Mount Gilboa & Tabor (הגלבוע והתבור)
  {
    id: 'gilboa-ridge',
    name: 'רכס הגלבוע (536 מטר)',
    type: 'ridge',
    polygon: [
      { lat: 32.550, lon: 35.380 },
      { lat: 32.520, lon: 35.480 },
      { lat: 32.440, lon: 35.450 },
      { lat: 32.480, lon: 35.360 },
    ],
    color: '#15803d',
    elevation: '536m',
  },
  // 5. Jerusalem & Judean Mountains Ridge (הרי ירושלים ויהודה)
  {
    id: 'judean-mountains',
    name: 'הרי ירושלים וגב ההר (1,020 מטר)',
    type: 'mountain',
    polygon: [
      { lat: 31.920, lon: 35.150 },
      { lat: 31.900, lon: 35.260 },
      { lat: 31.650, lon: 35.220 },
      { lat: 31.500, lon: 35.100 },
      { lat: 31.550, lon: 34.980 },
      { lat: 31.780, lon: 35.050 },
    ],
    color: '#78350f',
    elevation: '1,020m',
  },
  // 6. Ramon Crater (מכתש רמון - תופעת טבע עולמית)
  {
    id: 'machtesh-ramon',
    name: 'מכתש רמון (אורך 40 ק"מ, עומק 500 מטר)',
    type: 'crater',
    polygon: [
      { lat: 30.630, lon: 34.750 },
      { lat: 30.640, lon: 34.880 },
      { lat: 30.560, lon: 35.020 },
      { lat: 30.500, lon: 34.960 },
      { lat: 30.540, lon: 34.780 },
      { lat: 30.580, lon: 34.700 },
    ],
    color: '#b45309',
    elevation: 'מכתש ענק',
  },
  // 7. Machtesh Gadol & Katan (המכתש הגדול והמכתש הקטן)
  {
    id: 'machtesh-gadol',
    name: 'המכתש הגדול (מכתש ירוחם)',
    type: 'crater',
    polygon: [
      { lat: 30.950, lon: 34.950 },
      { lat: 30.980, lon: 35.020 },
      { lat: 30.880, lon: 35.000 },
      { lat: 30.880, lon: 34.920 },
    ],
    color: '#d97706',
    elevation: 'מכתש אירוזי',
  },
  // 8. Eilat Red Granite Mountains (הרי אילת)
  {
    id: 'eilat-mountains',
    name: 'הרי אילת והר שלמה (גרניט אדום)',
    type: 'mountain',
    polygon: [
      { lat: 29.680, lon: 34.850 },
      { lat: 29.620, lon: 34.930 },
      { lat: 29.530, lon: 34.920 },
      { lat: 29.540, lon: 34.840 },
      { lat: 29.620, lon: 34.800 },
    ],
    color: '#991b1b',
    elevation: '892m',
  },
];

// Mediterranean Sea Bathymetric Depth Contours (Realistic sea gradients)
export const SEA_DEPTH_CONTOURS: GeoPoint[][] = [
  // Shallow shelf contour (0-50m)
  [
    { lat: 33.093, lon: 35.080 },
    { lat: 32.830, lon: 34.920 },
    { lat: 32.080, lon: 34.720 },
    { lat: 31.600, lon: 34.420 },
    { lat: 31.250, lon: 34.200 },
  ],
  // Deep sea contour (50-200m)
  [
    { lat: 33.100, lon: 34.950 },
    { lat: 32.800, lon: 34.800 },
    { lat: 32.100, lon: 34.600 },
    { lat: 31.600, lon: 34.300 },
    { lat: 31.200, lon: 34.100 },
  ],
];

// 11 Core Geographic Regions with distinct spatial identity
export const REGIONS: Region[] = [
  {
    id: 'galil-elyon',
    hebrewName: 'הגליל העליון ואצבע הגליל',
    englishName: 'Upper Galilee & Panhandle',
    color: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.14)',
    center: { lat: 33.050, lon: 35.420 },
    polygon: [
      { lat: 33.093, lon: 35.104 },
      { lat: 33.080, lon: 35.380 },
      { lat: 33.280, lon: 35.580 },
      { lat: 33.150, lon: 35.650 },
      { lat: 32.950, lon: 35.550 },
      { lat: 32.920, lon: 35.300 },
      { lat: 32.950, lon: 35.120 },
    ],
    description: 'האזור ההררי והגבוה ביותר בצפון, גובל בלבנון. כולל את הר מירון, צפת, קריית שמונה ועמק החולה.',
  },
  {
    id: 'galil-tahton',
    hebrewName: 'הגליל התחתון ועמק יזרעאל',
    englishName: 'Lower Galilee & Jezreel Valley',
    color: '#34d399',
    fillColor: 'rgba(52, 211, 153, 0.14)',
    center: { lat: 32.720, lon: 35.320 },
    polygon: [
      { lat: 32.920, lon: 35.120 },
      { lat: 32.920, lon: 35.500 },
      { lat: 32.700, lon: 35.550 },
      { lat: 32.550, lon: 35.400 },
      { lat: 32.550, lon: 35.180 },
      { lat: 32.700, lon: 35.100 },
    ],
    description: 'אזור של גבעות ועמקים פוריים. כולל את נצרת, כרמיאל, עפולה, הר תבור וצומת גולני.',
  },
  {
    id: 'golan',
    hebrewName: 'רמת הגולן והחרמון',
    englishName: 'Golan Heights & Mt Hermon',
    color: '#059669',
    fillColor: 'rgba(5, 150, 105, 0.14)',
    center: { lat: 33.080, lon: 35.750 },
    polygon: [
      { lat: 33.300, lon: 35.770 },
      { lat: 33.250, lon: 35.840 },
      { lat: 32.880, lon: 35.860 },
      { lat: 32.750, lon: 35.650 },
      { lat: 32.900, lon: 35.620 },
      { lat: 33.150, lon: 35.650 },
    ],
    description: 'רמה בזלתית ממזרח לירדן ולכנרת, ומצפון לה פסגת החרמון המושלגת. המרכז הראשי: קצרין.',
  },
  {
    id: 'coastal-north',
    hebrewName: 'מישור החוף הצפוני והכרמל',
    englishName: 'Northern Coast & Carmel',
    color: '#0ea5e9',
    fillColor: 'rgba(14, 165, 233, 0.14)',
    center: { lat: 32.750, lon: 34.980 },
    polygon: [
      { lat: 33.093, lon: 35.104 },
      { lat: 32.950, lon: 35.120 },
      { lat: 32.700, lon: 35.100 },
      { lat: 32.500, lon: 34.950 },
      { lat: 32.500, lon: 34.900 },
      { lat: 32.830, lon: 34.970 },
      { lat: 33.010, lon: 35.090 },
    ],
    description: 'רצועת החוף הצפונית מרכס סולם צור דרך עכו, מפרץ חיפה, הכרמל ועד זיכרון יעקב.',
  },
  {
    id: 'coastal-center',
    hebrewName: 'מישור החוף המרכזי (שרון וגוש דן)',
    englishName: 'Central Coast, Sharon & Gush Dan',
    color: '#3b82f6',
    fillColor: 'rgba(59, 130, 246, 0.14)',
    center: { lat: 32.150, lon: 34.840 },
    polygon: [
      { lat: 32.500, lon: 34.900 },
      { lat: 32.500, lon: 35.050 },
      { lat: 32.100, lon: 35.000 },
      { lat: 31.950, lon: 34.880 },
      { lat: 31.980, lon: 34.750 },
      { lat: 32.330, lon: 34.850 },
    ],
    description: 'הלב הכלכלי והעירוני הצפוף בישראל: נתניה, הרצליה, תל אביב-יפו, פתח תקווה ורמת גן.',
  },
  {
    id: 'shfela',
    hebrewName: 'השפלה ומישור החוף הדרומי',
    englishName: 'Shfela & Southern Coast',
    color: '#8b5cf6',
    fillColor: 'rgba(139, 92, 246, 0.14)',
    center: { lat: 31.780, lon: 34.780 },
    polygon: [
      { lat: 31.980, lon: 34.750 },
      { lat: 31.950, lon: 34.880 },
      { lat: 31.750, lon: 35.000 },
      { lat: 31.550, lon: 34.850 },
      { lat: 31.550, lon: 34.500 },
      { lat: 31.810, lon: 34.640 },
    ],
    description: 'הגבעות הרכות בין מישור החוף להרי יהודה. כולל את ראשון לציון, רחובות, אשדוד, אשקלון, מודיעין ובית שמש.',
  },
  {
    id: 'jerusalem-mountains',
    hebrewName: 'הרי ירושלים ויהודה',
    englishName: 'Jerusalem Mountains & Judea',
    color: '#d97706',
    fillColor: 'rgba(217, 119, 6, 0.14)',
    center: { lat: 31.780, lon: 35.200 },
    polygon: [
      { lat: 31.950, lon: 35.100 },
      { lat: 31.950, lon: 35.350 },
      { lat: 31.500, lon: 35.300 },
      { lat: 31.500, lon: 34.950 },
      { lat: 31.750, lon: 35.000 },
    ],
    description: 'רכס ההר המרכזי בגובה 700-1000 מטרים. בירתו ירושלים, מחבר מערבה לשפלה דרך כביש 1 וכביש 443.',
  },
  {
    id: 'jordan-valley',
    hebrewName: 'בקעת הירדן וים המלח',
    englishName: 'Jordan Valley & Dead Sea',
    color: '#06b6d4',
    fillColor: 'rgba(6, 182, 212, 0.14)',
    center: { lat: 31.900, lon: 35.450 },
    polygon: [
      { lat: 32.700, lon: 35.550 },
      { lat: 32.700, lon: 35.620 },
      { lat: 31.100, lon: 35.420 },
      { lat: 31.100, lon: 35.300 },
      { lat: 31.950, lon: 35.350 },
      { lat: 32.550, lon: 35.400 },
    ],
    description: 'החלק הצפוני של השבר הסורי-אפריקאי, כולל את נהר הירדן, יריחו, ואת הנקודה הנמוכה בעולם - ים המלח.',
  },
  {
    id: 'northern-negev',
    hebrewName: 'הנגב הצפוני ועוטף עזה',
    englishName: 'Northern Negev & Western Negev',
    color: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.14)',
    center: { lat: 31.300, lon: 34.700 },
    polygon: [
      { lat: 31.550, lon: 34.500 },
      { lat: 31.550, lon: 34.850 },
      { lat: 31.300, lon: 35.250 },
      { lat: 31.050, lon: 35.050 },
      { lat: 31.000, lon: 34.400 },
      { lat: 31.250, lon: 34.280 },
    ],
    description: 'השער למדבר הנגב. מרכזו בבאר שבע ("בירת הנגב"), וכולל את שדרות, אופקים, נתיבות, ערד ודימונה.',
  },
  {
    id: 'central-negev',
    hebrewName: 'הר הנגב והמכתשים',
    englishName: 'Central Negev Highlands & Craters',
    color: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.14)',
    center: { lat: 30.650, lon: 34.800 },
    polygon: [
      { lat: 31.000, lon: 34.400 },
      { lat: 31.050, lon: 35.050 },
      { lat: 30.400, lon: 35.050 },
      { lat: 30.200, lon: 34.700 },
      { lat: 30.600, lon: 34.550 },
    ],
    description: 'אזור הררי צחיח ומרשים, כולל את שדה בוקר, מדרשת בן גוריון, מצפה רמון ומכתש רמון הענק.',
  },
  {
    id: 'arava-eilat',
    hebrewName: 'הערבה ומפרץ אילת',
    englishName: 'Arava Valley & Eilat Gulf',
    color: '#ec4899',
    fillColor: 'rgba(236, 72, 153, 0.14)',
    center: { lat: 29.900, lon: 35.050 },
    polygon: [
      { lat: 30.900, lon: 35.300 },
      { lat: 31.000, lon: 35.340 },
      { lat: 29.550, lon: 34.960 },
      { lat: 29.490, lon: 34.900 },
      { lat: 29.700, lon: 34.820 },
      { lat: 30.200, lon: 34.700 },
      { lat: 30.400, lon: 35.050 },
    ],
    description: 'עמק מדברי צר לאורך גבול ירדן המוביל עד לקצה הדרומי של ישראל ולחופי ים סוף בעיר אילת.',
  },
];
