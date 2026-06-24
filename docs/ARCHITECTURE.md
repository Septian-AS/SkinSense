# SkinSense - Technical Architecture

## Project Overview

SkinSense adalah aplikasi web vanilla JavaScript yang mengintegrasikan TensorFlow.js dengan Teachable Machine untuk analisis jenis kulit real-time dengan rekomendasi skincare yang dipersonalisasi.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  public/index.html                       │
│                   (Single Entry Point)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   CDN Dependencies   CSS System    JS Modules
   (TF.js, TM,    (Tailwind CDN) (Modular Arch.)
    Chart.js)       assets/       js/
                    styles/       modules/
                    main.css
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom design system (Purple & Pink theme)
- **JavaScript (ES6+)**: Modular architecture
- **Vanilla JS**: No frameworks (lightweight, fast)

### Libraries
- **TensorFlow.js**: ML inference in browser
- **Teachable Machine**: ML model training & export
- **Chart.js**: Analytics visualization
- **Tailwind CSS**: Initial styling (via CDN)

### Architecture Pattern
- **Module Pattern**: Encapsulation & namespace
- **IIFE (Immediately Invoked Function Expressions)**: Privacy & scope
- **Event-Driven**: User interactions trigger flows

## File Structure & Responsibilities

### Entry Point
```
public/index.html
├── Semantic HTML structure
├── External library CDN links
└── Script imports (in order: config → modules → main)
```

### Configuration Layer
```
js/config.js
├── MODEL_PATH & URLs
├── Inference settings (thresholds, sizes)
├── Storage configuration
├── SKINCARE_RULES (all recommendations data)
├── PHOTOGRAPHY_TIPS (carousel content)
└── Constants & magic numbers
```

### Module Layer (Separation of Concerns)

#### Storage Module (js/modules/storage.js)
Responsible for:
- LocalStorage management
- History persistence
- Stats calculation
- Data export (JSON/CSV)

```javascript
StorageModule.saveAnalysis(skinType, confidence)
StorageModule.getHistory()
StorageModule.getHistoryStats()
```

#### Recommendations Module (js/modules/recommendations.js)
Responsible for:
- Skincare rule retrieval
- Recommendations rendering
- HTML generation for results

```javascript
RecommendationsModule.getSkinCareRules(skinType)
RecommendationsModule.renderRecommendations(skinType)
```

#### Model Module (js/modules/model.js)
Responsible for:
- ML model loading
- Inference (prediction)
- Model state management

```javascript
ModelModule.loadModel()
ModelModule.predict(imageElement)
ModelModule.isModelLoaded()
```

#### Webcam Module (js/modules/webcam.js)
Responsible for:
- Webcam initialization & cleanup
- Frame capture
- Quality metrics (brightness, face detection)

```javascript
WebcamModule.startWebcam()
WebcamModule.captureFrame()
WebcamModule.getQualityMetrics(canvas)
```

#### Analyzer Module (js/modules/analyzer.js)
Responsible for:
- Image analysis orchestration
- Result processing & ranking
- Result validation
- Confidence interpretation

```javascript
AnalyzerModule.analyzeImage(canvas)
AnalyzerModule.validateResult(prediction)
```

#### UI Module (js/modules/ui.js)
Responsible for:
- DOM manipulation
- State display updates
- User feedback
- Event binding
- Modal & notification management

```javascript
UIModule.displayResult(skinType, confidence, predictions)
UIModule.updateHistory()
UIModule.updateAnalytics()
UIModule.showNotification(message, type)
```

### Main Application Layer
```
js/main.js
├── initApp() - Initialize all modules
├── setupEventListeners() - Wire up events
├── toggleWebcam() - Webcam flow
├── captureAndAnalyze() - Main analysis flow
├── clearHistory() - Data management
└── resetUI() - State reset
```

### Styling Layer
```
assets/styles/main.css
├── CSS Variables (colors, sizing, animations)
├── Global styles (typography, layout)
├── Component styles (buttons, cards, modals)
├── Responsive design (mobile-first)
├── Animations & transitions
└── Print styles
```

## Data Flow

### 1. Application Initialization
```
Document Loaded
    ↓
DOMContentLoaded Event
    ↓
initApp()
    ├─ ModelModule.loadModel()
    ├─ UIModule.showLoadingState()
    ├─ setupEventListeners()
    ├─ UIModule.initTipsCarousel()
    ├─ UIModule.updateHistory()
    ├─ UIModule.updateAnalytics()
    └─ Ready for user interaction
```

### 2. Webcam Capture Flow
```
User clicks "Enable Camera"
    ↓
toggleWebcam()
    ├─ WebcamModule.startWebcam()
    ├─ Start quality monitoring
    │   ├─ WebcamModule.getQualityMetrics()
    │   ├─ UIModule.updateFaceIndicator()
    │   └─ UIModule.updateBrightnessIndicator()
    └─ Enable capture button
```

### 3. Analysis Flow
```
User clicks "Capture & Analyze"
    ↓
captureAndAnalyze()
    ├─ WebcamModule.captureFrame()
    ├─ WebcamModule.stopWebcam()
    ├─ AnalyzerModule.analyzeImage(canvas)
    │   └─ ModelModule.predict(canvas)
    ├─ AnalyzerModule.validateResult(prediction)
    ├─ StorageModule.saveAnalysis()
    ├─ UIModule.displayResult()
    ├─ UIModule.updateHistory()
    ├─ UIModule.updateAnalytics()
    │   └─ Chart rendering
    └─ UIModule.showNotification()
```

### 4. Result Display
```
displayResult(skinType, confidence, predictions)
    ├─ Update confidence ring (SVG animation)
    ├─ Update prediction bars (with percentages)
    ├─ Display skin description
    ├─ RecommendationsModule.renderRecommendations()
    │   ├─ Morning routine steps
    │   ├─ Night routine steps
    │   ├─ Do's (green box)
    │   ├─ Don'ts (red box)
    │   └─ Warning (amber box)
    └─ Scroll to results section
```

## State Management

### Global State (Modules)
```javascript
// ModelModule
let model = null;
let isLoaded = false;

// WebcamModule
let webcam = null;
let isActive = false;
let animationFrameId = null;

// UIModule
let currentSkinType = null;
let trendChartInstance = null;

// main.js
let isWebcamActive = false;
let qualityMonitorId = null;
```

### Persistent State (LocalStorage)
```
localStorage.skinsense_history = [
  {
    id: timestamp,
    date: "22/06/2026 14:30",
    result: "Normal",
    confidence: "87%",
    timestamp: 1718975400000
  }
]
```

## Key Design Patterns

### 1. Module Pattern (Encapsulation)
```javascript
const ModuleName = (() => {
    // Private variables
    let privateVar = null;

    // Private functions
    const privateFunc = () => { };

    // Public API
    return {
        publicMethod: () => { }
    };
})();
```

**Why**: Prevents global namespace pollution, encapsulates private state

### 2. Single Responsibility Principle
- Each module has one reason to change
- Model = ML operations only
- Webcam = camera operations only
- UI = display operations only

### 3. Event-Driven Architecture
```
User Action → Event Listener → Handler Function
    (click)    (addEventListener)   (toggleWebcam)
         ↓
    Business Logic → State Update → UI Rendering
```

## Performance Considerations

### 1. Model Loading
- Loaded once on app init
- Cached by browser
- Async operation (doesn't block UI)

### 2. Real-time Monitoring
- Uses `requestAnimationFrame` for smooth updates
- Cleanup with `cancelAnimationFrame` on stop
- Quality metrics calculated efficiently

### 3. DOM Manipulation
- Minimal reflows/repaints
- Use `innerHTML` for bulk updates
- `insertAdjacentHTML` for incremental updates

### 4. Charts
- Chart.js instance destroyed & recreated on update
- Only rendered when analytics section visible
- Max 7 days of data

## Error Handling

### Model Loading Errors
```javascript
try {
    await ModelModule.loadModel()
} catch (error) {
    UIModule.showModelError(error.message)
    // Graceful fallback
}
```

### Webcam Access Errors
```javascript
try {
    await WebcamModule.startWebcam()
} catch (error) {
    UIModule.showNotification('Cannot access webcam', 'error')
}
```

### Analysis Errors
```javascript
try {
    await AnalyzerModule.analyzeImage(canvas)
} catch (error) {
    UIModule.showNotification('Analysis failed', 'error')
    resetUI()
}
```

## Security Considerations

✅ **What we do:**
- All processing in browser (no data sent to server)
- LocalStorage for local persistence only
- HTTPS required for production (browser security)
- No tracking or analytics

⚠️ **Limitations:**
- Webcam privacy depends on OS/browser
- LocalStorage can be cleared by user/browser
- No user authentication

## Accessibility Features

- Semantic HTML5 tags
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG standards
- Button states clearly indicated

## Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14.5+)
- Edge: ✅ Full support

**Requirements:**
- JavaScript enabled
- Webcam access
- LocalStorage support
- ES6+ support

## Future Improvements

1. **Service Worker**: Offline support
2. **WebGL Acceleration**: Faster inference
3. **Batch Processing**: Multiple photos
4. **Backend Integration**: Cloud storage for history
5. **Mobile App**: React Native/Flutter port
6. **Advanced ML**: Ensemble models for higher accuracy
7. **Internationalization**: Multi-language support
8. **Dark Mode**: Theme toggle

## Deployment Guide

### Local Development
```bash
python3 -m http.server 8000 --directory .
# Visit http://localhost:8000/public/
```

### Production (Static Hosting)
1. Upload `public/` folder contents to web server
2. Configure HTTPS (required for webcam)
3. Set appropriate cache headers for static assets
4. Optional: CDN for model weights

### Environment Variables
```
.env.example:
VITE_API_URL=https://api.example.com (for future)
VITE_ENV=production
```

---

**Last Updated**: 2026-06-22
**Version**: 1.1.0
