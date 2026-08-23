export interface GeoPoint {
  lat: number;
  lon: number;
}

export type RegionId =
  | 'galil-elyon'
  | 'galil-tahton'
  | 'golan'
  | 'coastal-north'
  | 'coastal-center'
  | 'shfela'
  | 'jerusalem-mountains'
  | 'jordan-valley'
  | 'northern-negev'
  | 'central-negev'
  | 'arava-eilat';

export interface Region {
  id: RegionId;
  hebrewName: string;
  englishName: string;
  color: string;
  fillColor: string;
  center: GeoPoint;
  polygon: GeoPoint[];
  description: string;
}

export interface City {
  id: string;
  hebrewName: string;
  englishName: string;
  lat: number;
  lon: number;
  regionId: RegionId;
  importance: 1 | 2 | 3; // 1 = major anchor, 2 = regional hub, 3 = secondary / settlement
  settlementType?: 'city' | 'town' | 'kibbutz' | 'moshav' | 'village';
  description: string;
  spatialHint: string;
  relatedRoads: string[];
  boundaryPolygon?: GeoPoint[];
}

export interface Junction {
  id: string;
  hebrewName: string;
  englishName: string;
  lat: number;
  lon: number;
  regionId: RegionId;
  type: 'interchange' | 'junction'; // מחלף / צומת
  connectedRoadIds: string[];
  description: string;
}

export interface RoadSegment {
  fromNodeId: string;
  toNodeId: string;
  coords: GeoPoint[];
  distanceKm: number;
}

export interface Road {
  id: string;
  number: number;
  hebrewName: string;
  type: 'highway' | 'main' | 'regional';
  color: string;
  strokeWidth: number;
  points: GeoPoint[];
  connectedCityIds: string[];
  connectedJunctionIds: string[];
  description: string;
  orientation: 'north-south' | 'east-west' | 'diagonal';
}

export type ChallengeType =
  | 'locate'
  | 'spatial_direction'
  | 'spatial_order'
  | 'spatial_nearest'
  | 'spatial_between'
  | 'build_route'
  | 'identify_road'
  | 'identify_junction';

export interface Challenge {
  id: string;
  stage: number;
  type: ChallengeType;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  instruction: string;
  subInstruction?: string;
  
  // For 'locate' mode
  targetCityId?: string;
  targetJunctionId?: string;
  targetPoint?: GeoPoint;
  toleranceKm?: number; // threshold for 100% score (e.g. 15km)
  
  // For 'spatial_direction' or 'spatial_nearest' or 'spatial_between'
  referenceEntityId?: string;
  options?: {
    id: string;
    label: string;
    entityType: 'city' | 'road' | 'junction' | 'region';
    isCorrect: boolean;
  }[];
  correctEntityId?: string;
  
  // For 'spatial_order' (e.g. arrange 4 cities from North to South)
  orderEntityIds?: string[]; // entities to order
  orderDirection?: 'north-to-south' | 'south-to-north' | 'west-to-east';
  
  // For 'build_route'
  startNodeId?: string;
  targetNodeId?: string;
  startNodeName?: string;
  targetNodeName?: string;
  validRoutes?: string[][]; // valid sequences of node/road IDs
  recommendedRoads?: string[];
  
  // Educational hints & context
  spatialExplanation: string;
  hint: string;
  learningTags: string[];
}

export interface Stage {
  id: number;
  hebrewTitle: string;
  englishTitle: string;
  description: string;
  iconName: string;
  requiredCompletedCount: number;
  color: string;
  challengeIds: string[];
}

export interface UserChallengeAttempt {
  challengeId: string;
  completed: boolean;
  score: number; // 0 - 100
  accuracyKm?: number;
  attempts: number;
  completedAt: number;
  timeSpentSec: number;
}

export type DifficultyLevel = 'beginner' | 'advanced' | 'pro_navigator';
export type AppScreen = 'landing' | 'login_name' | 'level_settings' | 'game' | 'sandbox';
export type MapStyleTheme = 'satellite-topography' | 'atlas-realistic' | 'tactical-dark';

export interface UserProfile {
  name: string;
  avatar: string;
  title: string;
  experience: number;
  level: number;
  totalMasteryPercent: number;
}

export interface UserProgress {
  profile: UserProfile;
  difficulty: DifficultyLevel;
  currentStage: number;
  totalScore: number;
  streak: number;
  completedChallenges: Record<string, UserChallengeAttempt>;
  masteredEntities: Record<string, number>; // 0 to 100%
  discoveredLandmarks: string[]; // List of discovered landmarks/cities for mental map fog-of-war
  completedStages: number[];
  settings: {
    showLabels: boolean;
    showRegions: boolean;
    showRoadNumbers: boolean;
    showJunctions: boolean;
    showGrid: boolean;
    showElevationRelief: boolean;
    soundEnabled: boolean;
    mapTheme: MapStyleTheme;
    timerEnabled: boolean;
  };
}

export interface MapViewport {
  zoom: number;
  panX: number;
  panY: number;
}
