import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import ChatMessage from './components/ChatMessage';
import LoadingIndicator from './components/LoadingIndicator';
import { ChatMessage as ChatMessageType, GameState, ScenarioText } from './types';
import { loadState, saveState, loadScenario } from './utils/storage';
import { geminiChat } from './utils/geminiApi';

const EVENT_TRIGGER = 50;

function App() {
  const [state, setState] = useState<GameState>({ history: [], turns: 0 });
  const [scenario, setScenario] = useState<ScenarioText | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedState = loadState();
        const scenarioData = await loadScenario();
        
        setState(savedState);
        setScenario(scenarioData);

        // If it's a new session, add the greeting
        if (!savedState.history.length) {
          const greeting: ChatMessageType = {
            role: 'assistant',
            content: scenarioData.greetings,
            timestamp: Date.now()
          };
          const newState = {
            ...savedState,
            history: [greeting],
            turns: 0
          };
          setState(newState);
          saveState(newState);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !scenario) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    const newState = {
      ...state,
      history: [...state.history, userMessage],
      turns: state.turns
    };

    setState(newState);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await geminiChat(newState, scenario);
      const aiMessage: ChatMessageType = {
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };

      const finalState = {
        ...newState,
        history: [...newState.history, aiMessage],
        turns: newState.turns + 1
      };

      setState(finalState);
      saveState(finalState);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };

      const errorState = {
        ...newState,
        history: [...newState.history, errorMessage],
        turns: newState.turns + 1
      };

      setState(errorState);
      saveState(errorState);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Sparkles className="w-8 h-8 animate-spin" />
          <span className="text-xl font-medium">Initializing Isekai World...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
          radial-gradient(
            ellipse 100% 80% at 40% -20%,
            rgba(0, 123, 255, 0.5) 25%,
            rgba(0, 38, 255, 0.25) 35%,
            rgba(0, 123, 255, 0.12) 40%,
            transparent 60%
          )
        `
        }}
      />

      {/* Snow particles on top of glow */}
      <div className="absolute inset-0 z-10">
        <ParticleBackground />
      </div>

      <div className="relative z-20 flex flex-col h-screen max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-black bg-opacity-20 backdrop-blur-lg border-b border-white border-opacity-10 p-4">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-blue-300" />
            <div>
              <h1 className="text-2xl font-bold text-white">Isekai Adventure</h1>
              <p className="text-blue-200 text-sm">
                Turn {state.turns} {state.turns >= EVENT_TRIGGER && '• Special Event Mode Active'}
              </p>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-transparent"
        >
          {state.history.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isLastMessage={index === state.history.length - 1}
            />
          ))}
          
          {isLoading && <LoadingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-black bg-opacity-20 backdrop-blur-lg border-t border-white border-opacity-10 p-4">
          <div className="flex items-end space-x-3 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your action or dialogue..."
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-blue-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 min-h-[48px] max-h-32 scrollbar-thin scrollbar-thumb-blue-600"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#2563eb transparent'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-blue-500/25"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          
          {state.turns === EVENT_TRIGGER && (
            <div className="mt-3 p-3 bg-yellow-500 bg-opacity-20 border border-yellow-400 border-opacity-30 rounded-lg">
              <p className="text-yellow-200 text-sm font-medium flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Special Event Mode Activated! Unique events may now occur in your adventure.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top glow line */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent z-50 opacity-40">
        <div className="h-full bg-gradient-to-r from-white/10 to-blue-400/20 w-full" />
      </div>
    </div>
  );
}

export default App;