# 🎯 Habit Tracker Frontend

A modern, high-performance web application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Material UI**. Designed to help users track, build, and maintain healthy habits with real-time socket updates, AI-assisted coaching, rich data analytics, and interactive roadmaps.

---

## 📖 About The Project

**Habit Tracker** is a full-featured web application designed to help individuals build consistency, eliminate bad routines, and achieve personal milestones through intelligent habit management and data-driven insights.

### 💡 Why Habit Tracker?
Building new habits and staying consistent over time can be challenging. Generic notes apps or simple checklists often lack motivation, visual progress feedback, and structured guidance. **Habit Tracker** solves this by providing:

- **🤖 AI-Assisted Coaching**: Interactive goal setting and step-by-step guidance to turn ambitious aspirations into realistic daily habits.
- **🗺️ Goal Roadmaps**: Visual milestone tracking so users can break down long-term personal goals into actionable phases.
- **📊 Visual Progress & Streak Analytics**: Comprehensive charts and streak tracking powered by ApexCharts and MUI X-Charts to keep users motivated.
- **⚡ Real-Time WebSocket Sync**: Instant cross-device synchronization with Socket.io so your progress is always up to date.
- **🌗 Customisable UI & Themes**: Fluid dark/light mode, custom glassmorphism styling, and floating background gradients for a premium user experience.

Whether your target is fitness, learning, productivity, or mindfulness, **Habit Tracker** provides the structure, accountability, and insights needed to cultivate lasting habits.

---

## 🌟 Key Features

- **🎯 Comprehensive Habit Management**: Create, track, edit, and organize habits with custom schedules and completion logs.
- **🤖 AI Coach & Goal Setter**: AI-driven guidance to set SMART goals and generate personalized habit formation roadmaps.
- **🗺️ Interactive Roadmaps**: Visual progress roadmaps allowing users to track long-term milestone achievements.
- **📊 Rich Data Visualizations**: Detailed charts powered by **ApexCharts** and **MUI X-Charts** analyzing habit completion trends, streaks, and patterns.
- **⚡ Real-Time Socket Synchronization**: Integrated with **Socket.io** for instant notifications and multi-device state updates.
- **🔐 Secure Authentication**: JWT authentication flow with automated access/refresh token rotation and Redux slice persistence.
- **🌗 Dark & Light Theme**: Seamless theme toggling with custom glassmorphism effects and animated background gradients.
- **🌐 Offline Network Status**: Automatic connectivity detection displaying real-time offline status notices.
- **💬 Feedback & Reviews**: Embedded review system for user feedback and ratings.

---

## 🛠️ Tech Stack & Dependencies

### Core Framework & Build Tools
- **React 19** - Modern UI library
- **TypeScript 5.9** - Static type checking
- **Vite 7** - Ultra-fast development server & bundler
- **React Router DOM 7** - Client-side navigation & protected routing

### State Management & Data Fetching
- **Redux Toolkit & React-Redux** - Global application state management (Auth, Theme, Settings)
- **TanStack React Query v5** - Server-state management, caching, and async data fetching
- **Axios** - HTTP client with request/response interceptors & auto token refresh

### Real-Time & Communication
- **Socket.io Client** - WebSockets for real-time events and user synchronization

### UI, Styling & Animations
- **Tailwind CSS v4** - Utility-first styling framework
- **Material UI (MUI v7)** & **Emotion** - Accessible design components
- **Framer Motion** & **Animate.css** - Micro-interactions, transitions, and fluid UI animations
- **Lottie React** - Animated vector assets
- **React Icons** & **React Toastify** - Icon sets and interactive toast notifications

### Data Visualization
- **ApexCharts** & **React-ApexCharts** - Interactive time-series and progress graphs
- **MUI X-Charts** - Custom analytical chart layouts

---

## 📁 Project Structure

```text
habit-tracker/
├── public/                 # Static assets & favicon
├── src/
│   ├── api/                # Axios instance, interceptors, & API endpoints
│   ├── assets/             # Images, SVGs, & media files
│   ├── components/
│   │   ├── ai/             # AI Coach components & goal setup steps
│   │   ├── auth/           # Login/Signup forms & authentication UI
│   │   ├── charts/         # ApexCharts & MUI X-Charts components
│   │   ├── customSettings/ # User preferences & settings controls
│   │   ├── dashboard/      # Main dashboard modules (Track, History, Roadmap, Analysis, Calendar)
│   │   ├── home/           # Landing page elements
│   │   ├── loaders/        # Page loaders & skeleton placeholders
│   │   ├── pages/          # Main application views (Dashboard, Settings, Reviews, HomePage)
│   │   └── shared/         # Reusable UI components & offline status banner
│   ├── redux/              # Redux store configuration & slices (Auth, Theme, etc.)
│   ├── socket/             # Socket.io connection & event handling
│   ├── App.tsx             # Root application component & router setup
│   ├── index.css           # Global styles & theme definitions
│   └── main.tsx            # Application entry point
├── package.json            # Project dependencies & scripts
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `yarn` / `pnpm`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/meghaofficial/habit-tracker.git
   cd habit-tracker-project/habit-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the `habit-tracker` folder (or update existing) with your backend API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

---

## 💻 Running the Application

### Concurrent Mode (Frontend + Backend)
Run both the React frontend dev server and Node.js backend server simultaneously:
```bash
npm run dev
```

### Frontend Only
To run only the Vite development server for the frontend:
```bash
npm run start:frontend
```
*(or `npm run dev-test`)*

### Backend Only
To start the backend service from the frontend workspace:
```bash
npm run start:backend
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## ⚙️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs frontend and backend concurrently |
| `npm run start:frontend` | Starts Vite dev server for frontend |
| `npm run start:backend` | Starts backend server from `../habit-tracker-backend` |
| `npm run build` | Compiles TypeScript and builds production distribution (`dist/`) |
| `npm run preview` | Serves the production build locally for testing |
| `npm run lint` | Executes ESLint to check for code quality and linting errors |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
