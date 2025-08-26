export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface GameState {
  history: ChatMessage[];
  turns: number;
}

export interface ScenarioText {
  greetings: string;
  main_logic: string;
  events: string;
}