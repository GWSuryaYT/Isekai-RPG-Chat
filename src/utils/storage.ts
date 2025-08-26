import { GameState, ScenarioText } from '../types';

const STATE_KEY = 'isekai_game_state';
const SCENARIO_FILES = {
  greetings: '/scenario/greeting.txt',
  main_logic: '/scenario/main_logic.txt',
  events: '/scenario/events.txt'
};

// Load text file with fallback (matching Python load_text function)
const loadText = async (filename: string, fallback: string = ""): Promise<string> => {
  try {
    const response = await fetch(filename);
    if (response.ok) {
      return (await response.text()).trim();
    }
    return fallback;
  } catch (error) {
    console.warn(`Failed to load ${filename}, using fallback`);
    return fallback;
  }
};

export const saveState = (state: GameState): void => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const loadState = (): GameState => {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        history: parsed.history || [],
        turns: parsed.turns || 0
      };
    }
  } catch (error) {
    console.error('Failed to load state:', error);
  }
  
  return { history: [], turns: 0 };
};

export const loadScenario = async (): Promise<ScenarioText> => {
  // Load scenario files (matching Python load_scenario function)
  const [greetings, main_logic, events] = await Promise.all([
    loadText(SCENARIO_FILES.greetings, "Welcome to the isekai world!"),
    loadText(SCENARIO_FILES.main_logic, "Follow roleplay rules."),
    loadText(SCENARIO_FILES.events, "Generate special events when needed.")
  ]);

  return {
    greetings,
    main_logic,
    events
  };
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STATE_KEY);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};