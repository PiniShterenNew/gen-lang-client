import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Challenge,
  GeoPoint,
  UserProgress,
  MapStyleTheme,
} from '../../types/game';
import {
  ISRAEL_OUTLINE_COORDS,
  REGIONS,
  TOPOGRAPHIC_RELIEF,
} from '../../data/geoData';
import { CITIES } from '../../data/cities';
import { JUNCTIONS } from '../../data/junctions';
import { ROADS } from '../../data/roads';
import { CITY_BOUNDARIES } from '../../data/cityBoundaries';
import {
  calculateDistanceKm,
  calculateBearing,
  getHebrewDirection,
} from '../../utils/geoUtils';
import { Layers, MapPin, Navigation, Info, ShieldAlert, Sparkles, Building2, Trees, Compass } from 'lucide-react';

interface IsraelMapProps {
  currentChallenge?: Challenge;
  playerGuess: GeoPoint | null;
  guessDistKm: number | null;
  showResult: boolean;
  hintLevel: number;
  routeSteps: string[];
  orderedEntities: string[];
  discoveredLandmarks?: string[];
  isSandboxMode: boolean;
  sandboxSelectedEntity: {
    type: 'city' | 'road' | 'junction' | 'region';
    id: string;
  } | null;
  sandboxMeasurePoints: GeoPoint[];
  settings: UserProgress['settings'];
  onMapClick: (point: GeoPoint) => void;
  onEntityClick: (
    entityType: 'city' | 'road' | 'junction' | 'region',
    id: string,
    coords?: GeoPoint
  ) => void;
}

// Tile provider definitions
const TILE_SERVERS: Record<
  MapStyleTheme,
  { url: string; attribution: string; maxZoom: number }
> = {
  'satellite-topography': {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics, CNES/Airbus DS',
    maxZoom: 18,
  },
  'atlas-realistic': {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, Intermap, USGS, METI/NASA',
    maxZoom: 18,
  },
  'tactical-dark': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO, &copy; OpenStreetMap',
    maxZoom: 19,
  },
};

export const IsraelMap: React.FC<IsraelMapProps> = ({
  currentChallenge,
  playerGuess,
  guessDistKm,
  showResult,
  hintLevel,
  routeSteps,
  orderedEntities,
  discoveredLandmarks = [],
  isSandboxMode,
  sandboxSelectedEntity,
  sandboxMeasurePoints,
  settings,
  onMapClick,
  onEntityClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Hovered item for clean non-intrusive floating HUD bar
  const [hoveredEntity, setHoveredEntity] = useState<{
    type: 'city' | 'road' | 'junction' | 'region';
    id: string;
    title: string;
    subTitle: string;
    badge?: string;
    color?: string;
  } | null>(null);

  // Store latest callbacks in refs so the map never re-initializes on callback change
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const onEntityClickRef = useRef(onEntityClick);
  onEntityClickRef.current = onEntityClick;

  // Layer groups
  const outlineLayerRef = useRef<L.LayerGroup | null>(null);
  const regionsLayerRef = useRef<L.LayerGroup | null>(null);
  const topoLayerRef = useRef<L.LayerGroup | null>(null);
  const cityBoundaryLayerRef = useRef<L.LayerGroup | null>(null);
  const roadsLayerRef = useRef<L.LayerGroup | null>(null);
  const junctionsLayerRef = useRef<L.LayerGroup | null>(null);
  const citiesLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const guessLayerRef = useRef<L.LayerGroup | null>(null);
  const hintLayerRef = useRef<L.LayerGroup | null>(null);
  const measureLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTheme, setActiveTheme] = useState<MapStyleTheme>(
    settings.mapTheme || 'satellite-topography'
  );

  // Sync active theme if settings change
  useEffect(() => {
    if (settings.mapTheme && settings.mapTheme !== activeTheme) {
      setActiveTheme(settings.mapTheme);
    }
  }, [settings.mapTheme, activeTheme]);

  // Target point calculation
  const getTargetPoint = useCallback((): GeoPoint | null => {
    if (!currentChallenge) return null;
    if (currentChallenge.targetCityId) {
      const c = CITIES.find((item) => item.id === currentChallenge.targetCityId);
      return c ? { lat: c.lat, lon: c.lon } : null;
    }
    if (currentChallenge.targetJunctionId) {
      const j = JUNCTIONS.find((item) => item.id === currentChallenge.targetJunctionId);
      return j ? { lat: j.lat, lon: j.lon } : null;
    }
    return currentChallenge.targetPoint || null;
  }, [currentChallenge]);

  // Initialize Leaflet Map Instance ONCE ONLY on mount
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Bounds for State of Israel
    const southWest = L.latLng(29.35, 33.85);
    const northEast = L.latLng(33.45, 35.95);
    const israelBounds = L.latLngBounds(southWest, northEast);

    const map = L.map(mapContainerRef.current, {
      center: [31.5, 35.0],
      zoom: 8,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    map.fitBounds(israelBounds, { padding: [20, 20] });

    // Attach base tile layer
    const tileConfig = TILE_SERVERS[activeTheme] || TILE_SERVERS['satellite-topography'];
    const tiles = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = tiles;

    // Create and attach all layer groups in proper z-order
    outlineLayerRef.current = L.layerGroup().addTo(map);
    regionsLayerRef.current = L.layerGroup().addTo(map);
    topoLayerRef.current = L.layerGroup().addTo(map);
    cityBoundaryLayerRef.current = L.layerGroup().addTo(map);
    roadsLayerRef.current = L.layerGroup().addTo(map);
    junctionsLayerRef.current = L.layerGroup().addTo(map);
    citiesLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    hintLayerRef.current = L.layerGroup().addTo(map);
    guessLayerRef.current = L.layerGroup().addTo(map);
    measureLayerRef.current = L.layerGroup().addTo(map);

    // Free click without restrictions
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const clickedPoint: GeoPoint = { lat, lon: lng };
      onMapClickRef.current(clickedPoint);
    });

    mapInstanceRef.current = map;

    // Responsive size handler
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []); // Run ONLY once on mount!

  // Handle Tile Theme Switch dynamically without destroying map instance
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileConfig = TILE_SERVERS[activeTheme] || TILE_SERVERS['satellite-topography'];
    tileLayerRef.current = L.tileLayer(tileConfig.url, {
      maxZoom: tileConfig.maxZoom,
      subdomains: 'abcd',
    }).addTo(map);
  }, [activeTheme]);

  // 1. Country Outline Border Overlay
  useEffect(() => {
    if (!outlineLayerRef.current) return;
    outlineLayerRef.current.clearLayers();

    const latLngs = ISRAEL_OUTLINE_COORDS.map((p) => [p.lat, p.lon] as [number, number]);
    const outline = L.polyline(latLngs, {
      color: '#38bdf8',
      weight: 2,
      opacity: 0.6,
      dashArray: '6, 4',
    });
    outline.addTo(outlineLayerRef.current);
  }, []);

  // 2. Regions Layer
  useEffect(() => {
    if (!regionsLayerRef.current) return;
    regionsLayerRef.current.clearLayers();

    if (!settings.showRegions) return;

    REGIONS.forEach((region) => {
      const latLngs = region.polygon.map((p) => [p.lat, p.lon] as [number, number]);
      const isSelected =
        sandboxSelectedEntity?.type === 'region' && sandboxSelectedEntity.id === region.id;

      const poly = L.polygon(latLngs, {
        color: region.color,
        fillColor: region.fillColor,
        fillOpacity: isSelected ? 0.45 : 0.1,
        weight: isSelected ? 3 : 1.2,
        dashArray: isSelected ? undefined : '4, 4',
      });

      poly.on('mouseover', () => {
        setHoveredEntity({
          type: 'region',
          id: region.id,
          title: region.hebrewName,
          subTitle: region.description,
          badge: 'חבל ארץ',
          color: region.color,
        });
      });

      poly.on('mouseout', () => {
        setHoveredEntity((prev) => (prev?.id === region.id ? null : prev));
      });

      poly.on('click', (e) => {
        const pt = { lat: e.latlng.lat, lon: e.latlng.lng };
        onMapClickRef.current(pt);
        onEntityClickRef.current('region', region.id, pt);
      });

      poly.addTo(regionsLayerRef.current!);
    });
  }, [settings.showRegions, sandboxSelectedEntity]);

  // 3. Topographic Relief Features (Mountains & Craters)
  useEffect(() => {
    if (!topoLayerRef.current) return;
    topoLayerRef.current.clearLayers();

    if (!settings.showElevationRelief) return;

    TOPOGRAPHIC_RELIEF.forEach((topo) => {
      const latLngs = topo.polygon.map((p) => [p.lat, p.lon] as [number, number]);
      const poly = L.polygon(latLngs, {
        color: topo.color,
        fillColor: topo.color,
        fillOpacity: topo.type === 'mountain' ? 0.3 : 0.2,
        weight: 1.5,
        dashArray: topo.type === 'crater' ? '3, 3' : undefined,
      });

      poly.on('mouseover', () => {
        setHoveredEntity({
          type: 'region',
          id: topo.name,
          title: topo.name,
          subTitle: `גובה מרבי: ${topo.elevation}`,
          badge: topo.type === 'mountain' ? 'רכס הרים' : 'מכתש גיאולוגי',
          color: topo.color,
        });
      });

      poly.on('mouseout', () => {
        setHoveredEntity((prev) => (prev?.id === topo.name ? null : prev));
      });

      poly.on('click', (e) => {
        const pt = { lat: e.latlng.lat, lon: e.latlng.lng };
        onMapClickRef.current(pt);
      });

      poly.addTo(topoLayerRef.current!);
    });
  }, [settings.showElevationRelief]);

  // 4. REAL MUNICIPAL CITY BOUNDARY POLYGONS - Authentic Shape on Selection
  useEffect(() => {
    if (!cityBoundaryLayerRef.current) return;
    cityBoundaryLayerRef.current.clearLayers();

    // Identify which city is currently selected or target
    const activeCityId =
      sandboxSelectedEntity?.type === 'city'
        ? sandboxSelectedEntity.id
        : showResult && currentChallenge?.targetCityId
        ? currentChallenge.targetCityId
        : null;

    if (activeCityId) {
      const city = CITIES.find((c) => c.id === activeCityId);
      const boundaryPolygonCoords = CITY_BOUNDARIES[activeCityId];

      if (city && boundaryPolygonCoords && boundaryPolygonCoords.length > 2) {
        const latLngs = boundaryPolygonCoords.map((p) => [p.lat, p.lon] as [number, number]);

        // Outer glow polygon
        L.polygon(latLngs, {
          color: '#38bdf8',
          fillColor: '#0284c7',
          fillOpacity: 0.35,
          weight: 3.5,
          opacity: 0.95,
        }).addTo(cityBoundaryLayerRef.current);

        // Dashed border highlight
        L.polygon(latLngs, {
          color: '#ffffff',
          fillOpacity: 0,
          weight: 1.5,
          dashArray: '5, 5',
          opacity: 0.9,
        }).addTo(cityBoundaryLayerRef.current);

        // Show connected highways in glowing dashed line
        if (city.relatedRoads && city.relatedRoads.length > 0) {
          city.relatedRoads.forEach((roadId) => {
            const rd = ROADS.find((r) => r.id === roadId);
            if (rd) {
              const roadLatLngs = rd.points.map((p) => [p.lat, p.lon] as [number, number]);
              L.polyline(roadLatLngs, {
                color: '#38bdf8',
                weight: 4,
                opacity: 0.6,
                dashArray: '6, 6',
              }).addTo(cityBoundaryLayerRef.current!);
            }
          });
        }
      }
    }
  }, [sandboxSelectedEntity, currentChallenge, showResult]);

  // 5. Major Roads Layer
  useEffect(() => {
    if (!roadsLayerRef.current) return;
    roadsLayerRef.current.clearLayers();

    ROADS.forEach((road) => {
      const latLngs = road.points.map((p) => [p.lat, p.lon] as [number, number]);
      const isRoadActive =
        currentChallenge?.type === 'identify_road' &&
        currentChallenge.correctEntityId === road.id &&
        showResult;

      const isRoadInSandbox =
        sandboxSelectedEntity?.type === 'road' && sandboxSelectedEntity.id === road.id;

      const isRouteHighlight =
        currentChallenge?.type === 'build_route' &&
        currentChallenge.recommendedRoads?.includes(road.id);

      const isHighlighted = isRoadActive || isRoadInSandbox || isRouteHighlight;

      // Hit area for touch/mouse click
      const hitPolyline = L.polyline(latLngs, {
        color: 'transparent',
        weight: 22,
        opacity: 0,
      });

      hitPolyline.on('mouseover', () => {
        setHoveredEntity({
          type: 'road',
          id: road.id,
          title: road.hebrewName,
          subTitle: road.description,
          badge: road.type === 'highway' ? 'כביש מהיר' : 'כביש ראשי',
          color: road.color,
        });
      });

      hitPolyline.on('mouseout', () => {
        setHoveredEntity((prev) => (prev?.id === road.id ? null : prev));
      });

      hitPolyline.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const pt = { lat: e.latlng.lat, lon: e.latlng.lng };
        onEntityClickRef.current('road', road.id, pt);
      });

      // Glow halo if selected/highlighted
      if (isHighlighted) {
        L.polyline(latLngs, {
          color: '#38bdf8',
          weight: road.strokeWidth + 8,
          opacity: 0.7,
        }).addTo(roadsLayerRef.current!);

        L.polyline(latLngs, {
          color: '#10b981',
          weight: road.strokeWidth + 4,
          opacity: 0.95,
        }).addTo(roadsLayerRef.current!);
      }

      // Visual road line
      const visualPolyline = L.polyline(latLngs, {
        color: isHighlighted ? '#ffffff' : road.color,
        weight: isHighlighted ? road.strokeWidth + 2 : road.strokeWidth,
        opacity: 0.95,
      });

      hitPolyline.addTo(roadsLayerRef.current!);
      visualPolyline.addTo(roadsLayerRef.current!);

      // Compact Road number badge in center
      if (settings.showRoadNumbers && road.points.length > 2) {
        const midPoint = road.points[Math.floor(road.points.length / 2)];
        const numberIcon = L.divIcon({
          className: 'road-number-icon',
          html: `<div class="bg-slate-950/90 text-white font-mono font-black text-[9px] px-1.5 py-0.5 rounded border ${
            isHighlighted ? 'border-amber-400 text-amber-300 scale-110 shadow-lg' : 'border-slate-700/80 shadow'
          } select-none transition-transform pointer-events-none">${road.number}</div>`,
          iconSize: [24, 16],
          iconAnchor: [12, 8],
        });
        L.marker([midPoint.lat, midPoint.lon], {
          icon: numberIcon,
          interactive: false,
        }).addTo(roadsLayerRef.current!);
      }
    });
  }, [
    currentChallenge,
    showResult,
    sandboxSelectedEntity,
    settings.showRoadNumbers,
  ]);

  // 6. Junctions Layer
  useEffect(() => {
    if (!junctionsLayerRef.current) return;
    junctionsLayerRef.current.clearLayers();

    if (!settings.showJunctions) return;

    JUNCTIONS.forEach((junc) => {
      const isTarget =
        (currentChallenge?.targetJunctionId === junc.id && showResult) ||
        (sandboxSelectedEntity?.type === 'junction' && sandboxSelectedEntity.id === junc.id);

      const isInRoute = routeSteps.includes(junc.id);

      if (isTarget) {
        L.circle([junc.lat, junc.lon], {
          radius: 3500,
          color: '#fbbf24',
          fillColor: '#f59e0b',
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 4',
        }).addTo(junctionsLayerRef.current!);
      }

      const marker = L.circleMarker([junc.lat, junc.lon], {
        radius: isInRoute || isTarget ? 7 : 4,
        color: isInRoute ? '#34d399' : isTarget ? '#fbbf24' : '#64748b',
        fillColor: isInRoute ? '#10b981' : isTarget ? '#f59e0b' : '#1e293b',
        fillOpacity: 0.95,
        weight: isTarget ? 3 : 2,
      });

      marker.on('mouseover', () => {
        setHoveredEntity({
          type: 'junction',
          id: junc.id,
          title: junc.hebrewName,
          subTitle: junc.description,
          badge: junc.type === 'interchange' ? 'מחלף' : 'צומת',
          color: '#fbbf24',
        });
      });

      marker.on('mouseout', () => {
        setHoveredEntity((prev) => (prev?.id === junc.id ? null : prev));
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const pt = { lat: junc.lat, lon: junc.lon };
        onEntityClickRef.current('junction', junc.id, pt);
      });

      marker.addTo(junctionsLayerRef.current!);
    });
  }, [
    settings.showJunctions,
    currentChallenge,
    showResult,
    sandboxSelectedEntity,
    routeSteps,
  ]);

  // 7. Cities Layer (Optimized, sleek non-overlapping markers with settle type badges)
  useEffect(() => {
    if (!citiesLayerRef.current) return;
    citiesLayerRef.current.clearLayers();

    CITIES.forEach((city) => {
      const isTarget =
        (currentChallenge?.targetCityId === city.id && showResult) ||
        (sandboxSelectedEntity?.type === 'city' && sandboxSelectedEntity.id === city.id);

      const isInRoute = routeSteps.includes(city.id);
      const orderIndex = orderedEntities.indexOf(city.id);
      const isOrdered = orderIndex !== -1;
      const isDiscovered = discoveredLandmarks.includes(city.id);

      // Clean label display strategy:
      // Show labels for major cities (importance 1), target, in-route, or when labels toggle is enabled.
      // Small settlements get a clean compact dot so they don't crowd the screen.
      const showLabel =
        isTarget || isInRoute || isOrdered || (settings.showLabels && city.importance <= 2) || (city.importance === 1);

      const markerColor =
        isTarget
          ? 'bg-sky-400 border-2 border-white shadow-xl shadow-sky-500/80 scale-125 ring-4 ring-sky-400/40'
          : isInRoute
          ? 'bg-emerald-400 border-2 border-white shadow-lg shadow-emerald-500/50 scale-110'
          : isOrdered
          ? 'bg-purple-500 border-2 border-white shadow-lg shadow-purple-500/50 scale-110'
          : city.settlementType === 'kibbutz'
          ? 'bg-lime-400 border border-slate-900 shadow-sm'
          : city.settlementType === 'moshav'
          ? 'bg-amber-400 border border-slate-900 shadow-sm'
          : city.importance === 1
          ? 'bg-white border-2 border-sky-400 shadow-md'
          : isDiscovered
          ? 'bg-sky-200 border border-slate-700'
          : 'bg-slate-300 border border-slate-700';

      const dotSize =
        city.importance === 1 ? 'w-3.5 h-3.5' : city.importance === 2 ? 'w-2.5 h-2.5' : 'w-2 h-2';

      const markerHtml = `
        <div class="relative flex items-center justify-center p-1.5 cursor-pointer select-none" dir="rtl">
          ${
            isTarget || isInRoute
              ? '<div class="absolute w-7 h-7 rounded-full bg-sky-400/50 animate-ping pointer-events-none"></div>'
              : ''
          }
          <div class="${dotSize} rounded-full transition-transform duration-200 ${markerColor}"></div>
          ${
            isOrdered
              ? `<div class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-purple-600 border border-white text-white text-[8px] font-bold flex items-center justify-center pointer-events-none">${
                  orderIndex + 1
                }</div>`
              : ''
          }
          ${
            showLabel
              ? `<div class="absolute right-4 text-[10px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded pointer-events-none ${
                  isTarget
                    ? 'text-sky-200 bg-slate-950 border border-sky-400 shadow-xl font-black scale-110'
                    : city.importance === 1
                    ? 'text-white bg-slate-950/80 border border-sky-500/30 font-black'
                    : 'text-slate-200 bg-slate-900/75 border border-slate-800/80'
                } shadow-sm">${city.hebrewName}</div>`
              : ''
          }
        </div>
      `;

      const cityIcon = L.divIcon({
        className: 'city-node-icon',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([city.lat, city.lon], { icon: cityIcon });

      marker.on('mouseover', () => {
        const typeBadge =
          city.settlementType === 'kibbutz'
            ? 'קיבוץ'
            : city.settlementType === 'moshav'
            ? 'מושב'
            : city.settlementType === 'town'
            ? 'עיירה / מועצה'
            : 'עיר';

        setHoveredEntity({
          type: 'city',
          id: city.id,
          title: city.hebrewName,
          subTitle: city.description,
          badge: typeBadge,
          color: '#38bdf8',
        });
      });

      marker.on('mouseout', () => {
        setHoveredEntity((prev) => (prev?.id === city.id ? null : prev));
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const pt = { lat: city.lat, lon: city.lon };
        onEntityClickRef.current('city', city.id, pt);
      });

      marker.addTo(citiesLayerRef.current!);
    });
  }, [
    currentChallenge,
    showResult,
    sandboxSelectedEntity,
    routeSteps,
    orderedEntities,
    discoveredLandmarks,
    settings.showLabels,
  ]);

  // 8. Route Builder Segments Layer
  useEffect(() => {
    if (!routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (routeSteps.length < 2) return;

    const findCoords = (id: string): [number, number] | null => {
      const c = CITIES.find((item) => item.id === id);
      if (c) return [c.lat, c.lon];
      const j = JUNCTIONS.find((item) => item.id === id);
      if (j) return [j.lat, j.lon];
      return null;
    };

    const latLngs: [number, number][] = [];
    routeSteps.forEach((id) => {
      const pt = findCoords(id);
      if (pt) latLngs.push(pt);
    });

    if (latLngs.length > 1) {
      L.polyline(latLngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85,
      }).addTo(routeLayerRef.current);

      L.polyline(latLngs, {
        color: '#ffffff',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.95,
      }).addTo(routeLayerRef.current);
    }
  }, [routeSteps]);

  // 9. Hint Radar Layer
  useEffect(() => {
    if (!hintLayerRef.current) return;
    hintLayerRef.current.clearLayers();

    const target = getTargetPoint();
    if (hintLevel > 0 && target) {
      const radiusMeters = hintLevel === 1 ? 25000 : 12000;
      L.circle([target.lat, target.lon], {
        radius: radiusMeters,
        color: '#38bdf8',
        fillColor: '#38bdf8',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(hintLayerRef.current);

      if (hintLevel >= 2) {
        L.circle([target.lat, target.lon], {
          radius: 5000,
          color: '#f59e0b',
          fillColor: '#f59e0b',
          fillOpacity: 0.35,
          weight: 2,
        }).addTo(hintLayerRef.current);
      }
    }
  }, [hintLevel, getTargetPoint]);

  // 10. Player Guess & Target Line Layer
  useEffect(() => {
    if (!guessLayerRef.current) return;
    guessLayerRef.current.clearLayers();

    if (!playerGuess) return;

    // Player Guess Marker
    const guessIcon = L.divIcon({
      className: 'player-guess-pin',
      html: `
        <div class="relative flex flex-col items-center select-none pointer-events-none" dir="rtl">
          <div class="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-xl animate-bounce"></div>
          <div class="bg-rose-950/90 border border-rose-500/50 text-rose-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg mt-0.5 whitespace-nowrap">
            הניחוש שלך
          </div>
        </div>
      `,
      iconSize: [50, 32],
      iconAnchor: [25, 6],
    });

    L.marker([playerGuess.lat, playerGuess.lon], {
      icon: guessIcon,
      interactive: false,
    }).addTo(guessLayerRef.current);

    // If result shown and target exists, draw connecting line
    const target = getTargetPoint();
    if (showResult && target) {
      const targetIcon = L.divIcon({
        className: 'target-pin',
        html: `
          <div class="relative flex flex-col items-center select-none pointer-events-none" dir="rtl">
            <div class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-2xl flex items-center justify-center text-[9px]">
              📍
            </div>
            <div class="bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg mt-0.5 whitespace-nowrap">
              יעד מדויק
            </div>
          </div>
        `,
        iconSize: [60, 36],
        iconAnchor: [30, 8],
      });

      L.marker([target.lat, target.lon], {
        icon: targetIcon,
        interactive: false,
      }).addTo(guessLayerRef.current);

      // Connecting line
      L.polyline(
        [
          [playerGuess.lat, playerGuess.lon],
          [target.lat, target.lon],
        ],
        {
          color: '#38bdf8',
          weight: 2.5,
          dashArray: '5, 5',
          opacity: 0.9,
        }
      ).addTo(guessLayerRef.current);

      // Distance and Bearing Badge
      const dist = guessDistKm ?? calculateDistanceKm(playerGuess, target);
      const bearing = calculateBearing(playerGuess, target);
      const dirHebrew = getHebrewDirection(bearing);
      const midLat = (playerGuess.lat + target.lat) / 2;
      const midLon = (playerGuess.lon + target.lon) / 2;

      const badgeIcon = L.divIcon({
        className: 'dist-bearing-badge',
        html: `
          <div class="bg-slate-950/95 border border-sky-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-2xl flex items-center gap-1 whitespace-nowrap pointer-events-none" dir="rtl">
            <span class="text-amber-400 font-mono font-black">${Math.round(dist)} ק"מ</span>
            <span class="text-sky-300">לכיוון ${dirHebrew}</span>
          </div>
        `,
        iconSize: [95, 20],
        iconAnchor: [47, 10],
      });

      L.marker([midLat, midLon], {
        icon: badgeIcon,
        interactive: false,
      }).addTo(guessLayerRef.current);
    }
  }, [playerGuess, showResult, guessDistKm, getTargetPoint]);

  // 11. Sandbox Measure Points Layer
  useEffect(() => {
    if (!measureLayerRef.current) return;
    measureLayerRef.current.clearLayers();

    if (sandboxMeasurePoints.length === 0) return;

    sandboxMeasurePoints.forEach((p) => {
      L.circleMarker([p.lat, p.lon], {
        radius: 5,
        color: '#f59e0b',
        fillColor: '#fbbf24',
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(measureLayerRef.current!);
    });

    if (sandboxMeasurePoints.length >= 2) {
      const p1 = sandboxMeasurePoints[0];
      const p2 = sandboxMeasurePoints[1];
      const dist = calculateDistanceKm(p1, p2);
      const bearing = calculateBearing(p1, p2);
      const dir = getHebrewDirection(bearing);

      L.polyline(
        [
          [p1.lat, p1.lon],
          [p2.lat, p2.lon],
        ],
        {
          color: '#f59e0b',
          weight: 2.5,
          dashArray: '5, 5',
          opacity: 0.9,
        }
      ).addTo(measureLayerRef.current);

      const midLat = (p1.lat + p2.lat) / 2;
      const midLon = (p1.lon + p2.lon) / 2;

      const measureBadge = L.divIcon({
        className: 'measure-badge',
        html: `
          <div class="bg-amber-950/95 border border-amber-400 text-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-lg shadow-2xl flex items-center gap-1 whitespace-nowrap pointer-events-none" dir="rtl">
            <span class="font-mono font-black">${dist.toFixed(1)} ק"מ</span>
            <span>(כיוון ${dir})</span>
          </div>
        `,
        iconSize: [110, 20],
        iconAnchor: [55, 10],
      });

      L.marker([midLat, midLon], {
        icon: measureBadge,
        interactive: false,
      }).addTo(measureLayerRef.current);
    }
  }, [sandboxMeasurePoints]);

  // Quick Region Camera Zoom Presets (Triggered only when the user clicks preset buttons)
  const focusPreset = (region: 'all' | 'north' | 'center' | 'south') => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (region === 'all') {
      map.flyToBounds(
        L.latLngBounds(L.latLng(29.35, 33.85), L.latLng(33.45, 35.95)),
        { duration: 0.8, padding: [20, 20] }
      );
    } else if (region === 'north') {
      map.flyTo([32.85, 35.35], 9.5, { duration: 0.8 });
    } else if (region === 'center') {
      map.flyTo([31.95, 34.95], 10, { duration: 0.8 });
    } else if (region === 'south') {
      map.flyTo([30.7, 34.9], 8.5, { duration: 0.8 });
    }
  };

  // Zoom control buttons
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => focusPreset('all');

  // Currently displayed entity for the Inspector HUD (either hovered or sandbox selected)
  const displayedInspectorEntity = hoveredEntity || (sandboxSelectedEntity ? (() => {
    if (sandboxSelectedEntity.type === 'city') {
      const c = CITIES.find((item) => item.id === sandboxSelectedEntity.id);
      if (c) {
        const badge = c.settlementType === 'kibbutz' ? 'קיבוץ' : c.settlementType === 'moshav' ? 'מושב' : 'עיר';
        return { type: 'city' as const, id: c.id, title: c.hebrewName, subTitle: c.description, badge, color: '#38bdf8' };
      }
    } else if (sandboxSelectedEntity.type === 'road') {
      const r = ROADS.find((item) => item.id === sandboxSelectedEntity.id);
      if (r) return { type: 'road' as const, id: r.id, title: r.hebrewName, subTitle: r.description, badge: 'כביש', color: r.color };
    } else if (sandboxSelectedEntity.type === 'junction') {
      const j = JUNCTIONS.find((item) => item.id === sandboxSelectedEntity.id);
      if (j) return { type: 'junction' as const, id: j.id, title: j.hebrewName, subTitle: j.description, badge: 'צומת / מחלף', color: '#fbbf24' };
    } else if (sandboxSelectedEntity.type === 'region') {
      const reg = REGIONS.find((item) => item.id === sandboxSelectedEntity.id);
      if (reg) return { type: 'region' as const, id: reg.id, title: reg.hebrewName, subTitle: reg.description, badge: 'חבל ארץ', color: reg.color };
    }
    return null;
  })() : null);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-slate-950">
      {/* Real Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

      {/* Real Map Tile Style Switcher Floating Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 p-1 rounded-2xl shadow-2xl text-xs">
        <button
          onClick={() => setActiveTheme('satellite-topography')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTheme === 'satellite-topography'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="תצלומי לווין אמיתיים ברזולוציה גבוהה (Esri World Imagery)"
        >
          <span>🛰️</span>
          <span className="hidden sm:inline">לווין אמיתי</span>
        </button>

        <button
          onClick={() => setActiveTheme('atlas-realistic')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTheme === 'atlas-realistic'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="מפה טופוגרפית אמיתית (Esri Topo / Streets)"
        >
          <span>🏔️</span>
          <span className="hidden sm:inline">טופוגרפי</span>
        </button>

        <button
          onClick={() => setActiveTheme('tactical-dark')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            activeTheme === 'tactical-dark'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="מפה טקטית לילה כהה (Carto Dark)"
        >
          <span>🌌</span>
          <span className="hidden sm:inline">לילה</span>
        </button>
      </div>

      {/* Zoom / Viewport Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-1.5 shadow-2xl text-slate-200">
        <button
          onClick={handleZoomIn}
          title="הגדל זום (+)"
          className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-slate-800 active:bg-slate-700 text-base font-bold transition-all text-sky-400 cursor-pointer"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          title="הקטן זום (-)"
          className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-slate-800 active:bg-slate-700 text-base font-bold transition-all text-sky-400 cursor-pointer"
        >
          -
        </button>
        <button
          onClick={handleResetView}
          title="כל הארץ"
          className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-slate-800 active:bg-slate-700 text-[10px] font-bold transition-all text-slate-300 cursor-pointer"
        >
          ארץ
        </button>
        <div className="h-[1px] bg-slate-800 my-0.5" />
        <button
          onClick={() => focusPreset('north')}
          title="מיקוד צפון"
          className="px-1.5 py-1 text-[9px] font-bold rounded-lg hover:bg-slate-800 text-emerald-400 transition-colors cursor-pointer"
        >
          צפון
        </button>
        <button
          onClick={() => focusPreset('center')}
          title="מיקוד מרכז"
          className="px-1.5 py-1 text-[9px] font-bold rounded-lg hover:bg-slate-800 text-blue-400 transition-colors cursor-pointer"
        >
          מרכז
        </button>
        <button
          onClick={() => focusPreset('south')}
          title="מיקוד דרום"
          className="px-1.5 py-1 text-[9px] font-bold rounded-lg hover:bg-slate-800 text-amber-400 transition-colors cursor-pointer"
        >
          דרום
        </button>
      </div>

      {/* Floating Sleek Non-Intrusive HUD Inspector (Replaces bulky on-map tooltips) */}
      {displayedInspectorEntity && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] sm:w-auto bg-slate-950/90 backdrop-blur-xl border border-sky-500/40 px-4 py-2.5 rounded-2xl shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2 pointer-events-none"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
              style={{ backgroundColor: displayedInspectorEntity.color ? `${displayedInspectorEntity.color}33` : 'rgba(56,189,248,0.2)' }}
            >
              {displayedInspectorEntity.badge === 'קיבוץ' ? (
                <Trees className="w-4 h-4 text-lime-400" />
              ) : displayedInspectorEntity.badge === 'מושב' ? (
                <Trees className="w-4 h-4 text-amber-400" />
              ) : displayedInspectorEntity.type === 'road' ? (
                <Navigation className="w-4 h-4 text-amber-400" />
              ) : displayedInspectorEntity.type === 'junction' ? (
                <MapPin className="w-4 h-4 text-amber-400" />
              ) : displayedInspectorEntity.type === 'region' ? (
                <Compass className="w-4 h-4 text-sky-400" />
              ) : (
                <Building2 className="w-4 h-4 text-sky-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white drop-shadow-sm truncate">
                  {displayedInspectorEntity.title}
                </span>
                {displayedInspectorEntity.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-300 whitespace-nowrap">
                    {displayedInspectorEntity.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                {displayedInspectorEntity.subTitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scale & North Indicator */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 px-3 py-2 rounded-2xl text-slate-300 shadow-xl text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full border border-sky-500/50 flex items-center justify-center relative shadow-[0_0_10px_rgba(56,189,248,0.2)]">
            <span className="text-[9px] font-black text-sky-400 absolute -top-1">N</span>
            <div className="w-0.5 h-3 bg-gradient-to-b from-sky-400 to-rose-500 rounded-full" />
          </div>
          <span className="text-[10px] font-semibold text-slate-300">צפון</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-700/80" />
        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
          <Layers className="w-3 h-3" />
          <span>GIS חי</span>
        </div>
      </div>
    </div>
  );
};
