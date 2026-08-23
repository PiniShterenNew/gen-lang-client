import { Road } from '../types/game';

export const ROADS: Road[] = [
  // ==========================
  // כבישים ארציים ראשיים ומהירים
  // ==========================
  {
    id: 'road-1',
    number: 1,
    hebrewName: 'כביש 1 (תל אביב - ירושלים - ים המלח)',
    type: 'highway',
    color: '#ef4444', // red
    strokeWidth: 4,
    points: [
      { lat: 32.050, lon: 34.780 }, // Kibbutz Galuyot (Tel Aviv)
      { lat: 32.023, lon: 34.827 }, // Ganot Interchange
      { lat: 32.000, lon: 34.870 }, // Shapirim
      { lat: 31.956, lon: 34.927 }, // Ben Shemen Interchange
      { lat: 31.893, lon: 34.954 }, // Anava Interchange
      { lat: 31.835, lon: 34.985 }, // Latrun
      { lat: 31.814, lon: 35.025 }, // Sha'ar HaGai
      { lat: 31.800, lon: 35.120 }, // Shoresh / Mevaseret
      { lat: 31.785, lon: 35.195 }, // Jerusalem (Sakharov Entrance)
      { lat: 31.770, lon: 35.240 }, // Jerusalem East
      { lat: 31.780, lon: 35.310 }, // Ma'ale Adumim
      { lat: 31.812, lon: 35.495 }, // Beit HaArava Junction (Dead Sea)
    ],
    connectedCityIds: ['tel-aviv', 'modiin', 'jerusalem'],
    connectedJunctionIds: ['junc-ganot', 'junc-ben-shemen', 'junc-anava', 'junc-shaar-hagai', 'junc-beit-haarava'],
    description: 'עורק התחבורה הראשי וההיסטורי של ישראל, המחבר את תל אביב וירושלים ויורד לים המלח.',
    orientation: 'east-west',
  },
  {
    id: 'road-2',
    number: 2,
    hebrewName: 'כביש 2 (כביש החוף)',
    type: 'highway',
    color: '#3b82f6', // blue
    strokeWidth: 3.8,
    points: [
      { lat: 32.1485, lon: 34.8020 }, // Glilot Interchange
      { lat: 32.170, lon: 34.815 }, // Herzliya
      { lat: 32.220, lon: 34.825 }, // Ga'ash
      { lat: 32.3215, lon: 34.8532 }, // Netanya
      { lat: 32.400, lon: 34.880 }, // Olga
      { lat: 32.4340, lon: 34.9197 }, // Hadera
      { lat: 32.580, lon: 34.920 }, // Zikhron Ya'akov
      { lat: 32.700, lon: 34.940 }, // Atlit
      { lat: 32.7940, lon: 34.9896 }, // Haifa (Bat Galim / Hagana)
    ],
    connectedCityIds: ['tel-aviv', 'herzliya', 'netanya', 'hadera', 'zikhron-yaakov', 'haifa'],
    connectedJunctionIds: ['junc-glilot'],
    description: 'הכביש המהיר הראשי לאורך קו החוף בין תל אביב לחיפה.',
    orientation: 'north-south',
  },
  {
    id: 'road-4',
    number: 4,
    hebrewName: 'כביש 4 (גהה ומישור החוף המורחב)',
    type: 'highway',
    color: '#8b5cf6', // purple
    strokeWidth: 3.8,
    points: [
      { lat: 31.600, lon: 34.540 }, // Erez Border
      { lat: 31.6688, lon: 34.5743 }, // Ashkelon
      { lat: 31.8044, lon: 34.6553 }, // Ashdod
      { lat: 31.8150, lon: 34.6980 }, // Ashdod Interchange
      { lat: 31.880, lon: 34.740 }, // Yavne
      { lat: 31.9730, lon: 34.7925 }, // Rishon LeZion
      { lat: 32.0230, lon: 34.8270 }, // Ganot Interchange
      { lat: 32.080, lon: 34.845 }, // Geha / Bnei Brak / Petah Tikva
      { lat: 32.1320, lon: 34.8510 }, // Morasha Interchange
      { lat: 32.180, lon: 34.880 }, // Ra'anana Junction
      { lat: 32.320, lon: 34.880 }, // Sharon / Beit Lid
      { lat: 32.440, lon: 34.930 }, // Hadera
      { lat: 32.600, lon: 34.960 }, // Fureidis
      { lat: 32.780, lon: 35.020 }, // Haifa Checkpost
      { lat: 32.9278, lon: 35.0818 }, // Akko
      { lat: 33.0059, lon: 35.0941 }, // Nahariya
      { lat: 33.0930, lon: 35.1040 }, // Rosh HaNikra
    ],
    connectedCityIds: ['ashkelon', 'ashdod', 'rishon-lezion', 'petah-tikva', 'raanana', 'hadera', 'haifa', 'akko', 'nahariya'],
    connectedJunctionIds: ['junc-ashdod', 'junc-ganot', 'junc-morasha'],
    description: 'כביש האורך הוותיק של ישראל לאורך כמעט כל מישור החוף, מראש הנקרה בצפון ועד גבול עזה בדרום.',
    orientation: 'north-south',
  },
  {
    id: 'road-6',
    number: 6,
    hebrewName: 'כביש 6 (חוצה ישראל)',
    type: 'highway',
    color: '#10b981', // emerald green
    strokeWidth: 4.5,
    points: [
      { lat: 31.3720, lon: 34.8210 }, // Lehavim Interchange (South)
      { lat: 31.500, lon: 34.800 }, // Kiryat Gat (Ma'ahaz)
      { lat: 31.650, lon: 34.810 }, // Kiryat Gat North
      { lat: 31.7850, lon: 34.8450 }, // Sorek Interchange
      { lat: 31.8930, lon: 34.9540 }, // Anava Interchange
      { lat: 31.9560, lon: 34.9270 }, // Ben Shemen Interchange
      { lat: 32.1060, lon: 34.9620 }, // Kesem Interchange
      { lat: 32.220, lon: 34.980 }, // Eyal
      { lat: 32.330, lon: 35.010 }, // Nitzanei Oz
      { lat: 32.4820, lon: 35.0340 }, // Iron Interchange
      { lat: 32.600, lon: 35.050 }, // En Tut
      { lat: 32.6630, lon: 35.0880 }, // Yokneam Interchange
      { lat: 32.780, lon: 35.150 }, // Somech
    ],
    connectedCityIds: ['beer-sheva', 'kiryat-gat', 'modiin', 'shoham', 'yokneam'],
    connectedJunctionIds: ['junc-lehavim', 'junc-sorek', 'junc-anava', 'junc-ben-shemen', 'junc-kesem', 'junc-iron', 'junc-yokneam'],
    description: 'האוטוסטרדה המהירה והמתקדמת בישראל, עוקפת את גוש דן ומחברת בין הצפון לדרום.',
    orientation: 'north-south',
  },
  {
    id: 'road-20',
    number: 20,
    hebrewName: 'כביש 20 (נתיבי איילון)',
    type: 'highway',
    color: '#0284c7', // sky blue
    strokeWidth: 3.5,
    points: [
      { lat: 31.960, lon: 34.765 }, // Rishon LeZion South (Holot)
      { lat: 32.015, lon: 34.760 }, // Komemiyut / Bat Yam
      { lat: 32.045, lon: 34.778 }, // Kibbutz Galuyot
      { lat: 32.072, lon: 34.792 }, // HaShalom Interchange
      { lat: 32.088, lon: 34.802 }, // Arlozorov / Savidor
      { lat: 32.110, lon: 34.808 }, // Rokach Interchange
      { lat: 32.1485, lon: 34.8020 }, // Glilot Interchange
      { lat: 32.175, lon: 34.825 }, // Herzliya / Seven Stars
    ],
    connectedCityIds: ['rishon-lezion', 'bat-yam', 'holon', 'tel-aviv', 'ramat-gan', 'herzliya'],
    connectedJunctionIds: ['junc-glilot'],
    description: 'העורק המטרופוליני הצפוף והמרכזי של גוש דן לאורך נחל איילון.',
    orientation: 'north-south',
  },
  {
    id: 'road-40',
    number: 40,
    hebrewName: 'כביש 40 (פתח תקווה - באר שבע - מכתש רמון)',
    type: 'main',
    color: '#f59e0b', // amber
    strokeWidth: 3.5,
    points: [
      { lat: 32.090, lon: 34.890 }, // Petah Tikva
      { lat: 31.950, lon: 34.870 }, // Lod / Ramla
      { lat: 31.890, lon: 34.810 }, // Bilu / Rehovot
      { lat: 31.800, lon: 34.780 }, // Gedera
      { lat: 31.7330, lon: 34.7570 }, // Qastina Junction
      { lat: 31.6230, lon: 34.7550 }, // Plugot Junction (Kiryat Gat)
      { lat: 31.420, lon: 34.780 }, // Beit Kama
      { lat: 31.3720, lon: 34.8210 }, // Lehavim Junction
      { lat: 31.2529, lon: 34.7915 }, // Be'er Sheva
      { lat: 31.000, lon: 34.780 }, // Mashabim / Revivim
      { lat: 30.8730, lon: 34.7920 }, // Sde Boker
      { lat: 30.6100, lon: 34.8020 }, // Mitzpe Ramon
      { lat: 30.250, lon: 34.850 }, // Ramon Crater South / Tzihor
      { lat: 30.000, lon: 34.980 }, // Ketura Junction (connects to 90)
    ],
    connectedCityIds: ['petah-tikva', 'lod', 'ramla', 'rehovot', 'gedera', 'kiryat-gat', 'beer-sheva', 'kibbutz-sde-boker', 'mitzpe-ramon'],
    connectedJunctionIds: ['junc-qastina', 'junc-plugot', 'junc-lehavim'],
    description: 'ציר האורך המרכזי בנגב, חולף בשפלה, בבאר שבע, בשדה בוקר ובמכתש רמון.',
    orientation: 'north-south',
  },
  {
    id: 'road-90',
    number: 90,
    hebrewName: 'כביש 90 (כביש הבקעה, ים המלח והערבה)',
    type: 'highway',
    color: '#06b6d4', // cyan
    strokeWidth: 3.8,
    points: [
      { lat: 33.2780, lon: 35.5780 }, // Metula
      { lat: 33.2073, lon: 35.5696 }, // Kiryat Shmona
      { lat: 32.960, lon: 35.550 }, // Rosh Pina
      { lat: 32.9320, lon: 35.5390 }, // Amiad Junction
      { lat: 32.7922, lon: 35.5312 }, // Tiberias
      { lat: 32.7080, lon: 35.5760 }, // Degania / Tzemach
      { lat: 32.4975, lon: 35.4983 }, // Beit She'an
      { lat: 32.300, lon: 35.520 }, // Central Jordan Valley
      { lat: 31.850, lon: 35.500 }, // Jericho Bypass
      { lat: 31.8120, lon: 35.4950 }, // Beit HaArava Junction
      { lat: 31.4580, lon: 35.3880 }, // Ein Gedi
      { lat: 31.190, lon: 35.365 }, // Ein Bokek
      { lat: 30.9850, lon: 35.3280 }, // Arava Junction
      { lat: 30.8120, lon: 35.2750 }, // Hatzeva
      { lat: 30.6580, lon: 35.2420 }, // Ein Yahav
      { lat: 30.3620, lon: 35.1320 }, // Paran
      { lat: 29.8970, lon: 35.0580 }, // Yotvata
      { lat: 29.5577, lon: 34.9519 }, // Eilat
    ],
    connectedCityIds: ['metula', 'kiryat-shmona', 'rosh-pina', 'tiberias', 'kibbutz-degania', 'beit-shean', 'kibbutz-ein-gedi', 'moshav-hatzeva', 'moshav-ein-yahav', 'moshav-paran', 'kibbutz-yotvata', 'eilat'],
    connectedJunctionIds: ['junc-amiad', 'junc-beit-haarava', 'junc-arava'],
    description: 'הכביש הארוך ביותר בישראל (כ-480 ק"מ), ממטולה בצפון ועד אילת וטאבה בדרום.',
    orientation: 'north-south',
  },

  // ==========================
  // כבישי רוחב וצירים אזוריים
  // ==========================
  {
    id: 'road-5',
    number: 5,
    hebrewName: 'כביש 5 (חוצה שומרון)',
    type: 'highway',
    color: '#ec4899', // pink
    strokeWidth: 3.2,
    points: [
      { lat: 32.1485, lon: 34.8020 }, // Glilot
      { lat: 32.1320, lon: 34.8510 }, // Morasha
      { lat: 32.115, lon: 34.880 }, // Tikva North
      { lat: 32.1060, lon: 34.9620 }, // Kesem
      { lat: 32.115, lon: 35.050 }, // Rosh HaAyin East
      { lat: 32.118, lon: 35.180 }, // Ariel
    ],
    connectedCityIds: ['tel-aviv', 'ramat-hasharon', 'petah-tikva'],
    connectedJunctionIds: ['junc-glilot', 'junc-morasha', 'junc-kesem'],
    description: 'כביש מהיר המחבר את גלילות, מורשה, קסם וראש העין ליהודה ושומרון.',
    orientation: 'east-west',
  },
  {
    id: 'road-431',
    number: 431,
    hebrewName: 'כביש 431 (ראשון לציון - מודיעין)',
    type: 'highway',
    color: '#6366f1', // indigo
    strokeWidth: 3.5,
    points: [
      { lat: 31.970, lon: 34.745 }, // Rishon LeZion West (Ayalon South)
      { lat: 31.960, lon: 34.795 }, // Rishon LeZion Central
      { lat: 31.940, lon: 34.835 }, // Nes Ziona / Be\'er Ya\'akov
      { lat: 31.925, lon: 34.865 }, // Ramla South
      { lat: 31.905, lon: 34.910 }, // Nesher
      { lat: 31.8930, lon: 34.9540 }, // Anava Interchange
      { lat: 31.8903, lon: 35.0104 }, // Modi\'in
    ],
    connectedCityIds: ['rishon-lezion', 'nes-ziona', 'ramla', 'modiin'],
    connectedJunctionIds: ['junc-anava'],
    description: 'אוטוסטרדה מודרנית ומהירה המחברת את דרום גוש דן והשפלה ישירות למודיעין ולירושלים.',
    orientation: 'east-west',
  },
  {
    id: 'road-443',
    number: 443,
    hebrewName: 'כביש 443 (מודיעין - גבעת זאב - ירושלים)',
    type: 'main',
    color: '#84cc16', // lime
    strokeWidth: 3,
    points: [
      { lat: 31.9560, lon: 34.9270 }, // Ben Shemen
      { lat: 31.910, lon: 34.985 }, // Modi\'in North
      { lat: 31.9050, lon: 35.0380 }, // Maccabim
      { lat: 31.880, lon: 35.120 }, // Beit Horon
      { lat: 31.850, lon: 35.170 }, // Givat Ze\'ev
      { lat: 31.815, lon: 35.210 }, // Jerusalem North (Begin North)
    ],
    connectedCityIds: ['lod', 'modiin', 'jerusalem'],
    connectedJunctionIds: ['junc-ben-shemen'],
    description: 'הציר הצפוני המחבר את השפלה ומודיעין לצפון ירושלים דרך מעלה בית חורון.',
    orientation: 'east-west',
  },
  {
    id: 'road-65',
    number: 65,
    hebrewName: 'כביש 65 (ואדי עארה - נחל עירון - עפולה - קדרים)',
    type: 'main',
    color: '#f97316', // orange
    strokeWidth: 3.2,
    points: [
      { lat: 32.440, lon: 34.930 }, // Hadera
      { lat: 32.4820, lon: 35.0340 }, // Iron Interchange (Road 6)
      { lat: 32.515, lon: 35.150 }, // Umm al-Fahm
      { lat: 32.5730, lon: 35.1780 }, // Megiddo Junction
      { lat: 32.6078, lon: 35.2894 }, // Afula
      { lat: 32.685, lon: 35.390 }, // Mount Tabor Foothills
      { lat: 32.7750, lon: 35.4050 }, // Golani Interchange
      { lat: 32.8900, lon: 35.4800 }, // Kadarim Junction
    ],
    connectedCityIds: ['hadera', 'pardes-hanna', 'afula'],
    connectedJunctionIds: ['junc-iron', 'junc-megiddo', 'junc-golani', 'junc-kadarim'],
    description: 'ציר הרוחב האסטרטגי החוצה ממישור החוף (חדרה) דרך ואדי עארה ועמק יזרעאל אל הגליל העליון.',
    orientation: 'east-west',
  },
  {
    id: 'road-70',
    number: 70,
    hebrewName: 'כביש 70 (זכרון יעקב - יקנעם - עמק זבולון - שלומי)',
    type: 'main',
    color: '#14b8a6', // teal
    strokeWidth: 3,
    points: [
      { lat: 32.580, lon: 34.950 }, // Fureidis / Zikhron Yaakov
      { lat: 32.620, lon: 35.020 }, // Elyakim Junction
      { lat: 32.6630, lon: 35.0880 }, // Yokneam
      { lat: 32.7450, lon: 35.1100 }, // Yagur
      { lat: 32.790, lon: 35.160 }, // Somech
      { lat: 32.880, lon: 35.170 }, // Ahihud
      { lat: 32.960, lon: 35.160 }, // Kabri Junction
      { lat: 33.0730, lon: 35.1430 }, // Shlomi
    ],
    connectedCityIds: ['zikhron-yaakov', 'yokneam', 'shlomi'],
    connectedJunctionIds: ['junc-yokneam', 'junc-yagur', 'junc-ahihud', 'junc-kabri'],
    description: 'ציר אורך פנימי מרכזי בצפון, למרגלות הכרמל, עמק זבולון והגליל המערבי.',
    orientation: 'north-south',
  },
  {
    id: 'road-77',
    number: 77,
    hebrewName: 'כביש 77 (רמת ישי - מחלף גולני - טבריה)',
    type: 'main',
    color: '#0284c7', // light blue
    strokeWidth: 3,
    points: [
      { lat: 32.710, lon: 35.170 }, // Yishai Interchange
      { lat: 32.745, lon: 35.250 }, // HaMovil Interchange
      { lat: 32.7750, lon: 35.4050 }, // Golani Interchange
      { lat: 32.785, lon: 35.480 }, // Poria Descent
      { lat: 32.7922, lon: 35.5312 }, // Tiberias
    ],
    connectedCityIds: ['nof-hagalil', 'tiberias'],
    connectedJunctionIds: ['junc-hamovil', 'junc-golani'],
    description: 'הכביש המהיר הראשי המחבר את הגליל התחתון ומחלף גולני ישירות לטבריה ולכנרת.',
    orientation: 'east-west',
  },
  {
    id: 'road-85',
    number: 85,
    hebrewName: 'כביש 85 (עכו - כרמיאל - צומת עמיעד)',
    type: 'main',
    color: '#eab308', // yellow
    strokeWidth: 3.2,
    points: [
      { lat: 32.9278, lon: 35.0818 }, // Akko
      { lat: 32.910, lon: 35.170 }, // Ahihud Junction
      { lat: 32.9199, lon: 35.2959 }, // Karmiel
      { lat: 32.920, lon: 35.420 }, // Rama
      { lat: 32.915, lon: 35.480 }, // Kadarim Junction
      { lat: 32.9320, lon: 35.5390 }, // Amiad Junction
    ],
    connectedCityIds: ['akko', 'karmiel'],
    connectedJunctionIds: ['junc-ahihud', 'junc-kadarim', 'junc-amiad'],
    description: 'עורק התחבורה הראשי בבקעת בית הכרם, המחבר בין עכו, כרמיאל וצומת עמיעד בגליל העליון.',
    orientation: 'east-west',
  },
  {
    id: 'road-89',
    number: 89,
    hebrewName: 'כביש 89 (נהריה - מעלות - צפת - אליפלט)',
    type: 'main',
    color: '#a855f7', // purple
    strokeWidth: 3,
    points: [
      { lat: 33.0059, lon: 35.0941 }, // Nahariya
      { lat: 33.010, lon: 35.150 }, // Kabri Junction
      { lat: 33.0160, lon: 35.2750 }, // Maalot-Tarshiha
      { lat: 32.980, lon: 35.380 }, // Mount Meron Slopes / Sasa
      { lat: 32.9646, lon: 35.4960 }, // Safed
      { lat: 32.955, lon: 35.550 }, // Elifelet Interchange / Rosh Pina
    ],
    connectedCityIds: ['nahariya', 'maalot-tarshiha', 'safed', 'rosh-pina'],
    connectedJunctionIds: ['junc-kabri'],
    description: 'כביש נופי הררי ומרהיב החוצה את הגליל העליון מנהריה ועד צפת ואליפלט.',
    orientation: 'east-west',
  },
  {
    id: 'road-25',
    number: 25,
    hebrewName: 'כביש 25 (נחל עוז - באר שבע - דימונה - הערבה)',
    type: 'main',
    color: '#0ea5e9', // sky
    strokeWidth: 3.2,
    points: [
      { lat: 31.4720, lon: 34.4980 }, // Nahal Oz / Gaza Border
      { lat: 31.4215, lon: 34.5886 }, // Netivot
      { lat: 31.330, lon: 34.670 }, // Gilat Junction
      { lat: 31.2529, lon: 34.7915 }, // Be'er Sheva
      { lat: 31.180, lon: 34.920 }, // Nevatim
      { lat: 31.0694, lon: 35.0333 }, // Dimona
      { lat: 31.020, lon: 35.180 }, // Rotem
      { lat: 30.9850, lon: 35.3280 }, // Arava Junction
    ],
    connectedCityIds: ['kibbutz-nahal-oz', 'netivot', 'beer-sheva', 'dimona'],
    connectedJunctionIds: ['junc-gilat', 'junc-arava'],
    description: 'ציר רוחב עיקרי בדרום הארץ, מגבול רצועת עזה דרך באר שבע ודימונה אל צומת הערבה.',
    orientation: 'east-west',
  },
  {
    id: 'road-31',
    number: 31,
    hebrewName: 'כביש 31 (אשל הנשיא - להבים - ערד - ים המלח)',
    type: 'main',
    color: '#f43f5e', // rose
    strokeWidth: 3,
    points: [
      { lat: 31.320, lon: 34.680 }, // Eshel HaNasi Junction
      { lat: 31.3720, lon: 34.8210 }, // Lehavim Interchange
      { lat: 31.320, lon: 34.920 }, // Hura
      { lat: 31.280, lon: 35.050 }, // Kuseife
      { lat: 31.2589, lon: 35.2128 }, // Arad
      { lat: 31.200, lon: 35.360 }, // Neve Zohar / Dead Sea
    ],
    connectedCityIds: ['arad'],
    connectedJunctionIds: ['junc-lehavim'],
    description: 'הציר הראשי המקשר בין צפון הנגב, ערד ומלונות ים המלח הדרומיים (נווה זוהר ועין בוקק).',
    orientation: 'east-west',
  },
  {
    id: 'road-38',
    number: 38,
    hebrewName: 'כביש 38 (שער הגיא - בית שמש - בית גוברין)',
    type: 'main',
    color: '#65a30d', // lime green
    strokeWidth: 3,
    points: [
      { lat: 31.814, lon: 35.025 }, // Sha'ar HaGai
      { lat: 31.780, lon: 34.995 }, // Mesilat Tzion
      { lat: 31.7470, lon: 34.9881 }, // Beit Shemesh
      { lat: 31.680, lon: 34.960 }, // HaEla Junction
      { lat: 31.610, lon: 34.890 }, // Beit Guvrin
    ],
    connectedCityIds: ['beit-shemesh'],
    connectedJunctionIds: ['junc-shaar-hagai', 'junc-haela'],
    description: 'ציר עמק האלה ושפלת יהודה, מקשר בין כביש 1 (שער הגיא) לבית שמש ולבית גוברין.',
    orientation: 'north-south',
  },
  {
    id: 'road-98',
    number: 98,
    hebrewName: 'כביש 98 (כביש רמת הגולן והחרמון)',
    type: 'main',
    color: '#38bdf8', // sky
    strokeWidth: 3,
    points: [
      { lat: 32.685, lon: 35.660 }, // Hamat Gader
      { lat: 32.740, lon: 35.720 }, // Afik / Kfar Haruv
      { lat: 32.850, lon: 35.800 }, // Haspin / Yonatan
      { lat: 33.020, lon: 35.820 }, // Alonei HaBashan
      { lat: 33.150, lon: 35.810 }, // El-Rom
      { lat: 33.2700, lon: 35.7720 }, // Majdal Shams / Hermon
    ],
    connectedCityIds: ['majdal-shams'],
    connectedJunctionIds: [],
    description: 'ציר האורך המזרחי של רמת הגולן מחמת גדר בדרום ועד מג\'דל שמס והחרמון בצפון.',
    orientation: 'north-south',
  },
  {
    id: 'road-99',
    number: 99,
    hebrewName: 'כביש 99 (קריית שמונה - הבניאס - מסעדה)',
    type: 'main',
    color: '#10b981', // green
    strokeWidth: 2.8,
    points: [
      { lat: 33.2073, lon: 35.5721 }, // Kiryat Shmona
      { lat: 33.220, lon: 35.600 }, // HaGoshrim
      { lat: 33.2320, lon: 35.6320 }, // Dafna
      { lat: 33.2420, lon: 35.6520 }, // Dan
      { lat: 33.248, lon: 35.695 }, // Banias Nature Reserve
      { lat: 33.238, lon: 35.750 }, // Mas'ade Junction
    ],
    connectedCityIds: ['kiryat-shmona', 'kibbutz-dafna', 'kibbutz-dan'],
    connectedJunctionIds: [],
    description: 'כביש מרהיב באצבע הגליל המוביל אל פלגי המים של החצבני, הדן והבניאס וצפון הגולן.',
    orientation: 'east-west',
  },
];
