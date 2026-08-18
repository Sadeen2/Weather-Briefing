# Cirra Frontend

This folder contains the standalone Cirra weather frontend built with React, Vite, Tailwind CSS, Framer Motion, and Lucide React.

## Why this is a standalone frontend

The Weather Briefing MCP server communicates over stdio, which browser code cannot call directly. The UI therefore uses a minimal demo service layer that mirrors the MCP tool contracts and keeps the frontend architecture ready for a thin local bridge later if you want live MCP requests from the browser.

## Run

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Build check

`npm run build`
