# Task Manager — Frontend

A responsive task management app built with React, Tailwind CSS, and Vite. Includes a live weather widget powered by the OpenWeatherMap API.

## Live Demo

https://task-manager-f-delta.vercel.app/

## Tech Stack

- React
- Vite
- Tailwind CSS v4
- react-toastify (notifications)

## Features

- Add, edit, delete, and mark tasks as completed
- Filter tasks by All / Active / Completed
- Live progress tracker showing completion percentage
- Weather widget with city search and input validation
- Toast notifications for all actions


## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/shahnawazgull/task-manager-f
cd task-manager-f
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npm run dev
```

The app will run on `http://localhost:5173` by default.

### 4. Build for production

```bash
npm run build
```

## Backend Connection

This frontend connects to the deployed backend at:

```
https://task-manager-b-uaf0.onrender.com
```

This is set directly inside `services/task.service.js` and `services/weather.service.js`.

## Deployment

Deployed on [Vercel](https://vercel.com).

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`