import { GameState, ScenarioText } from '../types';

const GEMINI_API_KEY = "PUT UR GEMINI API KEY HERE";
const MODEL_NAME = "gemini-2.5-flash-lite";
const MAX_HISTORY = 20;
const EVENT_TRIGGER = 50;

export const geminiChat = async (state: GameState, scenario: ScenarioText): Promise<string> => {
  try {
    // Determine system context based on turn count (matching Python logic)
    let systemContext: string;
    
    if (state.turns === 0) {
      // First turn → greetings + main_logic
      systemContext = scenario.greetings + "\n" + scenario.main_logic;
    } else if (state.turns >= EVENT_TRIGGER) {
      // After EVENT_TRIGGER → main_logic + events
      systemContext = scenario.main_logic + "\n" + scenario.events;
    } else {
      // Normal turns → main_logic only
      systemContext = scenario.main_logic;
    }

    // Build conversation text (matching Python concatenation approach)
    let conversation = systemContext + "\n\n";
    
    // Add recent history (last MAX_HISTORY messages)
    const recentHistory = state.history.slice(-MAX_HISTORY);
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        conversation += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        conversation += `AI: ${msg.content}\n`;
      }
    }

    // Add current user input to prompt
    if (state.history.length > 0 && state.history[state.history.length - 1].role === 'user') {
      conversation += `User: ${state.history[state.history.length - 1].content}\nAI:`;
    }

    const body = {
      contents: [{ parts: [{ text: conversation }] }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 512 
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('[DEBUG] Gemini raw response:', JSON.stringify(data, null, 2));
      return '[Error: No response from Gemini]';
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return '[Error: Failed to connect to Gemini API]';
  }
};