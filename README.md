# Animation Handler Simulator

A React-based application for managing and simulating animation states and transitions in real-time. This tool allows you to load animation clips via CSV and control their playback with various emotional states.

## Features

- 🎬 Real-time animation state management
- 📊 CSV-based clip data loading
- 🎭 Emotion-based transitions
- 🖱️ Drag and drop file upload
- 🔄 State transition management
- 📝 Live clip logging

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository

```powershell
git clone "https://github.com/Kadoinkus/Animation-Handler.git"
cd animation-handler-simulator
```

2. Install dependencies

```powershell
npm install
```

3. Start the development server

```powershell
npm run dev
```

## Usage

1. Launch the application
2. Upload a CSV file containing clip data (use the drag & drop zone or file input)
3. Use the control buttons to:
   - Start/Pause animation playback
   - Switch between states (Sleep, Wait, React, Type)
   - Select emotional variations for typing state

### CSV Format

The CSV file should contain the following columns:

- `clip`: The name of the animation clip
- `weight`: (optional) The weight of the clip (default: 3)
- `duration`: (optional) The duration in frames (default: 24)

Example:

```csv
clip,weight,duration
sleep_idle_L,3,24
wait_2react_T,3,24
```

## Project Structure

```
animation-handler-simulator/
├── src/
│   ├── components/      # React components
│   ├── constants/       # Shared constants
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # CSS styles
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application
│   └── main.jsx        # Entry point
└── CSV/                # Sample CSV files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting
- `npm run format` - Format code

## Tech Stack

- React
- Vite
- CSS Modules
- Standard.js for linting
