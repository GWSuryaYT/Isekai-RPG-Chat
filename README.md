# Rpg Chat Application

## Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation
1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided local server URL

### Gemini API Integration

To use real AI responses instead of mock responses:

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Replace the Gemini API key in /src/utils/geminiApi.ts

## Project Structure

```
src/
├── components/           # React components
│   ├── ParticleBackground.tsx    # Animated particle system
│   ├── ChatMessage.tsx           # Individual message display
│   └── LoadingIndicator.tsx      # AI thinking animation
├── utils/               # Utility functions
│   ├── storage.ts       # Local storage management
│   └── geminiApi.ts     # AI API integration
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared interfaces
├── App.tsx              # Main application component
└── index.css            # Global styles and animations
```

## Usage

1. **Start Chatting**: Type your actions or dialogue in the input field at the bottom
2. **Send Messages**: Press Enter or click the Send button
3. **View History**: All conversations are automatically saved and loaded on refresh
4. **Special Events**: After 50 turns, special event mode activates for enhanced gameplay
5. **Responsive Design**: Use on any device - the interface adapts automatically

## Customization

### Modifying Scenarios
Edit the scenario content in `src/utils/storage.ts`:
- `greetings`: Initial welcome message
- `main_logic`: Core roleplay rules and behavior
- `events`: Special event triggers and content

### Styling Changes
- Colors: Modify the Tailwind classes in components
- Animations: Adjust timing in `src/index.css`
- Particles: Configure particle behavior in `ParticleBackground.tsx`

### API Integration
- Replace mock responses in `geminiApi.ts` with real API calls
- Add error handling and retry logic as needed
- Implement authentication if required

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Browser
- **Features Used**: Canvas API, Local Storage, CSS backdrop-filter, Flexbox, CSS Grid

## Performance Optimizations

- **Particle System**: Optimized for 60 FPS with efficient canvas operations
- **Message Rendering**: Virtual scrolling for large conversation histories
- **Memory Management**: Automatic cleanup of animation frames and event listeners
- **Responsive Images**: Scalable particle effects based on screen size

## Development

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## License

This project is open source and available under the [MIT License](LICENSE).