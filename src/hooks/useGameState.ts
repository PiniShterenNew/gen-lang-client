import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Challenge,
  GeoPoint,
  UserProgress,
  AppScreen,
  DifficultyLevel,
  MapStyleTheme,
  UserProfile,
} from '../types/game';
import { CHALLENGES } from '../data/challenges';
import { STAGES } from '../data/stages';
import { CITIES } from '../data/cities';
import { JUNCTIONS } from '../data/junctions';
import {
  calculateDistanceKm,
  calculateLocateScore,
} from '../utils/geoUtils';
import { soundFX } from '../utils/soundUtils';

const STORAGE_KEY = 'israel_geo_game_v2_mental_map';

const DEFAULT_PROFILE: UserProfile = {
  name: 'סייר שטח',
  avatar: '🧭',
  title: 'מתלמד מפות',
  experience: 0,
  level: 1,
  totalMasteryPercent: 0,
};

const DEFAULT_PROGRESS: UserProgress = {
  profile: DEFAULT_PROFILE,
  difficulty: 'beginner',
  currentStage: 1,
  totalScore: 0,
  streak: 0,
  completedChallenges: {},
  masteredEntities: {},
  discoveredLandmarks: ['jerusalem', 'tel-aviv', 'haifa', 'beer-sheva', 'eilat'],
  completedStages: [],
  settings: {
    showLabels: true,
    showRegions: true,
    showRoadNumbers: true,
    showJunctions: true,
    showGrid: false,
    showElevationRelief: true,
    soundEnabled: true,
    mapTheme: 'satellite-topography',
    timerEnabled: false,
  },
};

export function useGameState() {
  // Navigation Flow State: 'landing' -> 'login_name' -> 'level_settings' -> 'game' | 'sandbox'
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          profile: { ...DEFAULT_PROFILE, ...(parsed.profile || {}) },
          settings: { ...DEFAULT_PROGRESS.settings, ...(parsed.settings || {}) },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [sandboxSelectedEntity, setSandboxSelectedEntity] = useState<{
    type: 'city' | 'road' | 'junction' | 'region';
    id: string;
  } | null>(null);
  const [sandboxMeasurePoints, setSandboxMeasurePoints] = useState<GeoPoint[]>([]);

  // Active challenge state
  const currentChallenge: Challenge = CHALLENGES[currentChallengeIndex] || CHALLENGES[0];
  
  // Locate mode state
  const [playerGuess, setPlayerGuess] = useState<GeoPoint | null>(null);
  const [guessDistKm, setGuessDistKm] = useState<number | null>(null);
  const [guessScore, setGuessScore] = useState<number | null>(null);
  const [accuracyGrade, setAccuracyGrade] = useState<string | null>(null);
  const [gradeHebrew, setGradeHebrew] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // Spatial Options mode state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Spatial Order mode state
  const [orderedEntities, setOrderedEntities] = useState<string[]>([]);

  // Route mode state
  const [routeSteps, setRouteSteps] = useState<string[]>([]);
  const [routeStatus, setRouteStatus] = useState<'idle' | 'in_progress' | 'valid' | 'invalid'>('idle');

  // Sync sound manager muted state
  useEffect(() => {
    soundFX.setMuted(!progress.settings.soundEnabled);
  }, [progress.settings.soundEnabled]);

  // Save progress to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Reset challenge interaction state when moving to next challenge
  const resetInteraction = useCallback(() => {
    setPlayerGuess(null);
    setGuessDistKm(null);
    setGuessScore(null);
    setAccuracyGrade(null);
    setGradeHebrew(null);
    setFeedbackText(null);
    setShowResult(false);
    setHintLevel(0);
    setAttemptsCount(0);
    setSelectedOptionId(null);
    setOrderedEntities([]);
    setRouteSteps(currentChallenge.startNodeId ? [currentChallenge.startNodeId] : []);
    setRouteStatus('idle');
  }, [currentChallenge]);

  useEffect(() => {
    resetInteraction();
  }, [currentChallengeIndex, resetInteraction]);

  // Flow Navigation
  const navigateTo = (screen: AppScreen) => {
    soundFX.playClick();
    setCurrentScreen(screen);
    if (screen === 'sandbox') {
      setIsSandboxMode(true);
    } else if (screen === 'game') {
      setIsSandboxMode(false);
    }
  };

  // Update Player Profile (Name & Avatar)
  const updateProfile = (name: string, avatar: string) => {
    soundFX.playClick();
    setProgress((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        name: name.trim() || 'סייר שטח',
        avatar,
      },
    }));
  };

  // Set Difficulty Level & Preconfigure settings
  const setDifficulty = (difficulty: DifficultyLevel) => {
    soundFX.playClick();
    setProgress((prev) => {
      let newSettings = { ...prev.settings };
      if (difficulty === 'beginner') {
        newSettings = {
          ...newSettings,
          showLabels: true,
          showRegions: true,
          showRoadNumbers: true,
          showJunctions: true,
          showElevationRelief: true,
        };
      } else if (difficulty === 'advanced') {
        newSettings = {
          ...newSettings,
          showLabels: false,
          showRegions: true,
          showRoadNumbers: true,
          showJunctions: true,
          showElevationRelief: true,
        };
      } else if (difficulty === 'pro_navigator') {
        newSettings = {
          ...newSettings,
          showLabels: false,
          showRegions: false,
          showRoadNumbers: false,
          showJunctions: false,
          showElevationRelief: true,
          timerEnabled: true,
        };
      }

      return {
        ...prev,
        difficulty,
        settings: newSettings,
      };
    });
  };

  // Update Map Theme / Realism Style
  const setMapTheme = (mapTheme: MapStyleTheme) => {
    soundFX.playClick();
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        mapTheme,
      },
    }));
  };

  // Handle map click
  const handleMapClick = (clickPoint: GeoPoint) => {
    if (isSandboxMode) {
      soundFX.playPinDrop();
      if (sandboxMeasurePoints.length >= 2) {
        setSandboxMeasurePoints([clickPoint]);
      } else {
        setSandboxMeasurePoints((prev) => [...prev, clickPoint]);
      }
      return;
    }

    if (showResult) return; // already evaluated

    if (currentChallenge.type === 'locate') {
      soundFX.playPinDrop();
      setPlayerGuess(clickPoint);
      setAttemptsCount((prev) => prev + 1);

      // Find target coordinates
      let targetPoint: GeoPoint | null = null;
      let targetId: string | undefined = undefined;

      if (currentChallenge.targetCityId) {
        targetId = currentChallenge.targetCityId;
        const city = CITIES.find((c) => c.id === currentChallenge.targetCityId);
        if (city) targetPoint = { lat: city.lat, lon: city.lon };
      } else if (currentChallenge.targetJunctionId) {
        targetId = currentChallenge.targetJunctionId;
        const junc = JUNCTIONS.find((j) => j.id === currentChallenge.targetJunctionId);
        if (junc) targetPoint = { lat: junc.lat, lon: junc.lon };
      } else if (currentChallenge.targetPoint) {
        targetPoint = currentChallenge.targetPoint;
      }

      if (targetPoint) {
        const distKm = calculateDistanceKm(clickPoint, targetPoint);
        const result = calculateLocateScore(distKm, currentChallenge.toleranceKm || 10);
        
        // Deduct points slightly if hints were used
        const finalScore = Math.max(10, Math.round(result.score * (1 - hintLevel * 0.15)));

        setGuessDistKm(distKm);
        setGuessScore(finalScore);
        setAccuracyGrade(result.accuracyGrade);
        setGradeHebrew(result.gradeHebrew);
        setFeedbackText(result.feedbackText);
        setShowResult(true);

        if (finalScore >= 80) {
          soundFX.playBullseye();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else if (finalScore >= 50) {
          soundFX.playGoodScore();
        } else {
          soundFX.playTryAgain();
        }

        // Record progress & mark discovered landmark
        recordChallengeCompletion(currentChallenge.id, finalScore, distKm, targetId);
      }
    }
  };

  // Handle entity click on map
  const handleEntityClick = (
    entityType: 'city' | 'road' | 'junction' | 'region',
    entityId: string,
    coords?: GeoPoint
  ) => {
    if (isSandboxMode) {
      soundFX.playClick();
      if (coords) {
        if (sandboxMeasurePoints.length >= 2) {
          setSandboxMeasurePoints([coords]);
        } else {
          setSandboxMeasurePoints((prev) => [...prev, coords]);
        }
      }
      setSandboxSelectedEntity({ type: entityType, id: entityId });
      return;
    }

    if (showResult) return;

    // 1. In locate mode: clicking ANY place/marker on the map directly evaluates as the guess
    if (currentChallenge.type === 'locate') {
      let clickPoint: GeoPoint | null = coords || null;
      if (!clickPoint) {
        if (entityType === 'city') {
          const c = CITIES.find((item) => item.id === entityId);
          if (c) clickPoint = { lat: c.lat, lon: c.lon };
        } else if (entityType === 'junction') {
          const j = JUNCTIONS.find((item) => item.id === entityId);
          if (j) clickPoint = { lat: j.lat, lon: j.lon };
        }
      }
      if (clickPoint) {
        handleMapClick(clickPoint);
      }
      return;
    }

    // 2. In identify_road mode: clicking a road directly on the map submits the choice
    if (currentChallenge.type === 'identify_road') {
      if (entityType === 'road') {
        handleSelectOption(entityId);
      }
      return;
    }

    // 3. In identify_junction mode: clicking a junction directly on the map submits the choice
    if (currentChallenge.type === 'identify_junction') {
      if (entityType === 'junction') {
        handleSelectOption(entityId);
      }
      return;
    }

    // 4. In spatial options / direction / nearest / between: clicking the entity selects it if it is one of the options
    if (
      currentChallenge.type === 'spatial_direction' ||
      currentChallenge.type === 'spatial_nearest' ||
      currentChallenge.type === 'spatial_between'
    ) {
      const matchingOpt = currentChallenge.options?.find((o) => o.id === entityId);
      if (matchingOpt) {
        handleSelectOption(entityId);
        return;
      }
    }

    // 5. In spatial_order mode: clicking a city adds it to the sequence
    if (currentChallenge.type === 'spatial_order') {
      if (entityType !== 'city') return;
      if (orderedEntities.includes(entityId)) return;
      
      const newOrdered = [...orderedEntities, entityId];
      setOrderedEntities(newOrdered);
      soundFX.playRouteStep();

      const targetOrder = currentChallenge.orderEntityIds || [];
      if (newOrdered.length === targetOrder.length) {
        // Evaluate order
        const isCorrect = newOrdered.every((id, idx) => id === targetOrder[idx]);
        const score = isCorrect ? 100 : 35;
        setGuessScore(score);
        setShowResult(true);
        if (isCorrect) {
          soundFX.playBullseye();
          setGradeHebrew('סדר גיאוגרפי מושלם! 👏');
          setFeedbackText('מיקמת את כל היישובים בסדר המדויק מצפון לדרום!');
          confetti({ particleCount: 75, spread: 60 });
        } else {
          soundFX.playTryAgain();
          setGradeHebrew('סדר לא מדויק 🧭');
          setFeedbackText('חלק מהערים אינן בסדר הנכון. שים לב לקווי הרוחב.');
        }
        recordChallengeCompletion(currentChallenge.id, score);
      }
      return;
    }

    // 6. In build_route mode: clicking a junction or city adds it to route
    if (currentChallenge.type === 'build_route') {
      if (entityType !== 'city' && entityType !== 'junction') return;
      if (routeSteps.includes(entityId)) return;

      const newRoute = [...routeSteps, entityId];
      setRouteSteps(newRoute);
      soundFX.playRouteStep();

      // Check if reached destination
      if (entityId === currentChallenge.targetNodeId) {
        const validRoutes = currentChallenge.validRoutes || [];
        const matchesValid = validRoutes.some((vr) => {
          return (
            vr[0] === newRoute[0] &&
            vr[vr.length - 1] === newRoute[newRoute.length - 1] &&
            newRoute.length >= 3
          );
        });

        const score = matchesValid ? 100 : 70;
        setGuessScore(score);
        setRouteStatus(matchesValid ? 'valid' : 'invalid');
        setShowResult(true);

        if (matchesValid) {
          soundFX.playRouteSuccess();
          setGradeHebrew('הגעת ליעד בהצלחה! 🚗💨');
          setFeedbackText('בנית מסלול נסיעה מעולה ומחובר גיאוגרפית!');
          confetti({ particleCount: 90, spread: 80 });
        } else {
          soundFX.playGoodScore();
          setGradeHebrew('מסלול חלקי 🗺️');
          setFeedbackText('הגעת ליעד, אך המסלול יכול להיות ישיר והגיוני יותר.');
        }
        recordChallengeCompletion(currentChallenge.id, score);
      }
      return;
    }
  };

  // Submit option choice for multiple-choice spatial challenges
  const handleSelectOption = (optionId: string) => {
    if (showResult) return;
    setSelectedOptionId(optionId);

    const opt = currentChallenge.options?.find((o) => o.id === optionId);
    const isCorrect = !!opt?.isCorrect;
    const score = isCorrect ? Math.max(20, Math.round(100 * (1 - hintLevel * 0.2))) : 0;

    setGuessScore(score);
    setShowResult(true);

    if (isCorrect) {
      soundFX.playBullseye();
      setGradeHebrew('תשובה נכונה! 🎯');
      setFeedbackText(currentChallenge.spatialExplanation);
      confetti({ particleCount: 65, spread: 55 });
    } else {
      soundFX.playTryAgain();
      setGradeHebrew('לא מדויק 🧭');
      setFeedbackText(currentChallenge.spatialExplanation);
    }

    recordChallengeCompletion(currentChallenge.id, score);
  };

  // Record completion
  const recordChallengeCompletion = (chId: string, score: number, accuracyKm?: number, discoveredEntityId?: string) => {
    setProgress((prev) => {
      const existing = prev.completedChallenges[chId];

      const newCompleted = {
        ...prev.completedChallenges,
        [chId]: {
          challengeId: chId,
          completed: true,
          score: Math.max(score, existing?.score || 0),
          accuracyKm,
          attempts: (existing?.attempts || 0) + 1,
          completedAt: Date.now(),
          timeSpentSec: 10,
        },
      };

      // Calculate total score
      const totalScore = (Object.values(newCompleted) as { score: number }[]).reduce(
        (sum: number, item) => sum + (item ? item.score : 0),
        0
      );
      const streak = score >= 70 ? prev.streak + 1 : 0;

      // Discovered landmarks update
      const newDiscovered = [...prev.discoveredLandmarks];
      if (discoveredEntityId && !newDiscovered.includes(discoveredEntityId)) {
        newDiscovered.push(discoveredEntityId);
      }

      // Check completed stages
      const completedStages = STAGES.filter((st) =>
        st.challengeIds.every((id) => newCompleted[id]?.score >= 60)
      ).map((st) => st.id);

      // Mastery Percentage
      const totalChallengesCount = CHALLENGES.length;
      const completedCount = Object.keys(newCompleted).length;
      const totalMasteryPercent = Math.min(100, Math.round((completedCount / totalChallengesCount) * 100));

      // Profile XP & Level
      const experience = totalScore * 10;
      const level = Math.floor(experience / 500) + 1;
      let title = 'מתלמד מפות';
      if (level >= 5) title = 'אלוף המפה המנטלית 🏆';
      else if (level >= 3) title = 'נווט שטח בכיר 🧭';
      else if (level >= 2) title = 'סייר גיאוגרפי מתקדם 🗺️';

      return {
        ...prev,
        profile: {
          ...prev.profile,
          experience,
          level,
          title,
          totalMasteryPercent,
        },
        discoveredLandmarks: newDiscovered,
        completedChallenges: newCompleted,
        totalScore,
        streak,
        completedStages,
      };
    });
  };

  const nextChallenge = () => {
    soundFX.playClick();
    if (currentChallengeIndex < CHALLENGES.length - 1) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      setCurrentChallengeIndex(0);
    }
  };

  const prevChallenge = () => {
    soundFX.playClick();
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex((prev) => prev - 1);
    }
  };

  const selectChallengeById = (id: string) => {
    const idx = CHALLENGES.findIndex((c) => c.id === id);
    if (idx !== -1) {
      setCurrentChallengeIndex(idx);
      setIsSandboxMode(false);
    }
  };

  const selectStage = (stageId: number) => {
    soundFX.playClick();
    const stage = STAGES.find((s) => s.id === stageId);
    if (stage && stage.challengeIds.length > 0) {
      selectChallengeById(stage.challengeIds[0]);
    }
  };

  const revealHint = () => {
    soundFX.playHint();
    setHintLevel((prev) => Math.min(prev + 1, 2));
  };

  const toggleSetting = (key: keyof UserProgress['settings']) => {
    soundFX.playClick();
    setProgress((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key],
      },
    }));
  };

  const resetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
    setCurrentChallengeIndex(0);
    resetInteraction();
  };

  return {
    currentScreen,
    navigateTo,
    updateProfile,
    setDifficulty,
    setMapTheme,
    progress,
    currentChallenge,
    currentChallengeIndex,
    totalChallenges: CHALLENGES.length,
    isSandboxMode,
    sandboxSelectedEntity,
    sandboxMeasurePoints,
    playerGuess,
    guessDistKm,
    guessScore,
    accuracyGrade,
    gradeHebrew,
    feedbackText,
    showResult,
    hintLevel,
    attemptsCount,
    selectedOptionId,
    orderedEntities,
    routeSteps,
    routeStatus,
    setIsSandboxMode,
    setSandboxSelectedEntity,
    setSandboxMeasurePoints,
    handleMapClick,
    handleEntityClick,
    handleSelectOption,
    nextChallenge,
    prevChallenge,
    selectChallengeById,
    selectStage,
    revealHint,
    toggleSetting,
    resetInteraction,
    resetAllProgress,
    setOrderedEntities,
    setRouteSteps,
  };
}
