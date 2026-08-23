import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { IsraelMap } from './components/Map/IsraelMap';
import { MapControls } from './components/Map/MapControls';
import { ChallengePanel } from './components/Challenges/ChallengePanel';
import { ExplorePanel } from './components/Sandbox/ExplorePanel';
import { TopBar } from './components/Header/TopBar';
import { StatsModal } from './components/Modals/StatsModal';
import { HelpModal } from './components/Modals/HelpModal';
import { LandingScreen } from './components/Screens/LandingScreen';
import { ProfileSetupScreen } from './components/Screens/ProfileSetupScreen';
import { LevelSettingsScreen } from './components/Screens/LevelSettingsScreen';

export default function App() {
  const {
    currentScreen,
    navigateTo,
    updateProfile,
    setDifficulty,
    setMapTheme,
    progress,
    currentChallenge,
    currentChallengeIndex,
    totalChallenges,
    isSandboxMode,
    sandboxSelectedEntity,
    sandboxMeasurePoints,
    playerGuess,
    guessDistKm,
    guessScore,
    gradeHebrew,
    feedbackText,
    showResult,
    hintLevel,
    selectedOptionId,
    orderedEntities,
    routeSteps,
    routeStatus,
    setIsSandboxMode,
    setSandboxMeasurePoints,
    handleMapClick,
    handleEntityClick,
    handleSelectOption,
    nextChallenge,
    prevChallenge,
    selectStage,
    revealHint,
    toggleSetting,
    resetAllProgress,
    setOrderedEntities,
    setRouteSteps,
  } = useGameState();

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Listen to order selection event from custom button
  useEffect(() => {
    const handleOrderSelect = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        handleEntityClick('city', customEvent.detail);
      }
    };

    window.addEventListener('order-select', handleOrderSelect);
    return () => window.removeEventListener('order-select', handleOrderSelect);
  }, [handleEntityClick]);

  // Screen 1: Landing Page
  if (currentScreen === 'landing') {
    return (
      <LandingScreen
        progress={progress}
        onStartFlow={() => navigateTo('login_name')}
        onQuickSandbox={() => navigateTo('sandbox')}
      />
    );
  }

  // Screen 2: Login & Name Selection
  if (currentScreen === 'login_name') {
    return (
      <ProfileSetupScreen
        currentProfile={progress.profile}
        onSaveProfile={(name, avatar) => {
          updateProfile(name, avatar);
          navigateTo('level_settings');
        }}
        onBack={() => navigateTo('landing')}
      />
    );
  }

  // Screen 3: Levels, Difficulty & Map Settings
  if (currentScreen === 'level_settings') {
    return (
      <LevelSettingsScreen
        progress={progress}
        onSetDifficulty={setDifficulty}
        onSetMapTheme={setMapTheme}
        onSelectStage={selectStage}
        onToggleSound={() => toggleSetting('soundEnabled')}
        onStartGame={() => navigateTo('game')}
        onBack={() => navigateTo('login_name')}
      />
    );
  }

  // Screen 4: Active Gameplay & Interactive Realistic Map
  return (
    <div
      dir="rtl"
      className="w-full h-[100vh] overflow-hidden bg-slate-950 flex flex-col font-sans text-slate-100 antialiased selection:bg-sky-500 selection:text-white"
    >
      {/* Top Header Bar */}
      <TopBar
        progress={progress}
        currentStageId={currentChallenge.stage}
        isSandboxMode={isSandboxMode}
        onSelectStage={selectStage}
        onToggleSandbox={() => setIsSandboxMode(!isSandboxMode)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onGoHome={() => navigateTo('landing')}
        onOpenSettings={() => navigateTo('level_settings')}
        onToggleSound={() => toggleSetting('soundEnabled')}
      />

      {/* Main Workspace Area (Desktop Split: Large Interactive Map + Side Challenge Panel) */}
      <div className="flex-1 min-h-0 relative flex flex-col md:flex-row overflow-hidden">
        {/* Central Map Canvas Area */}
        <div 
          className="relative w-full h-[50%] min-h-[260px] md:h-full md:flex-1 bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 z-0"
          style={{ touchAction: 'none' }}
        >
          {/* Interactive SVG Map */}
          <IsraelMap
            currentChallenge={currentChallenge}
            playerGuess={playerGuess}
            guessDistKm={guessDistKm}
            showResult={showResult}
            hintLevel={hintLevel}
            routeSteps={routeSteps}
            orderedEntities={orderedEntities}
            discoveredLandmarks={progress.discoveredLandmarks}
            isSandboxMode={isSandboxMode}
            sandboxSelectedEntity={sandboxSelectedEntity}
            sandboxMeasurePoints={sandboxMeasurePoints}
            settings={progress.settings}
            onMapClick={handleMapClick}
            onEntityClick={handleEntityClick}
          />

          {/* Floating Map Layers Control Toolbar */}
          <div className="absolute top-4 right-4 z-20">
            <MapControls
              settings={progress.settings}
              onToggleSetting={toggleSetting}
            />
          </div>
        </div>

        {/* Side Panel: Challenge Controller or Free Sandbox Explorer */}
        {isSandboxMode ? (
          <ExplorePanel
            selectedEntity={sandboxSelectedEntity}
            measurePoints={sandboxMeasurePoints}
            onClearMeasure={() => setSandboxMeasurePoints([])}
            onExitSandbox={() => setIsSandboxMode(false)}
          />
        ) : (
          <ChallengePanel
            challenge={currentChallenge}
            currentIndex={currentChallengeIndex}
            totalChallenges={totalChallenges}
            progress={progress}
            playerGuess={playerGuess}
            guessDistKm={guessDistKm}
            guessScore={guessScore}
            gradeHebrew={gradeHebrew}
            feedbackText={feedbackText}
            showResult={showResult}
            hintLevel={hintLevel}
            selectedOptionId={selectedOptionId}
            orderedEntities={orderedEntities}
            routeSteps={routeSteps}
            routeStatus={routeStatus}
            onNext={nextChallenge}
            onPrev={prevChallenge}
            onRevealHint={revealHint}
            onSelectOption={handleSelectOption}
            onResetOrder={() => setOrderedEntities([])}
            onResetRoute={() =>
              setRouteSteps(currentChallenge.startNodeId ? [currentChallenge.startNodeId] : [])
            }
            onSelectRouteNode={(nodeId) => handleEntityClick('junction', nodeId)}
          />
        )}
      </div>

      {/* Progress & Mastery Stats Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        progress={progress}
        onResetProgress={resetAllProgress}
      />

      {/* Help & Orientation Guide Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
