# ASB Dividend Planner

Estimate ASB dividend income with monthly minimum balance calculations, automatic reinvestment, and contribution limits. Built with SolidJS and Tailwind CSS.

## Quick Start

1. Install dependencies
	- npm install
	- pnpm install
	- yarn install

2. Run the dev server
	- npm run dev
	- pnpm dev
	- yarn dev

3. Open the app
	- http://localhost:3000

## Scripts

- npm run dev: Start Vite dev server
- npm run build: Build production assets to dist
- npm run serve: Preview the production build locally

## System Overview

### Core Features

- Dividend projection by year and month
- Monthly minimum balance calculation
- Automatic reinvestment and contribution limits
- Editable monthly contributions with reset
- Light/Dark mode toggle persisted in localStorage

### UI Structure

- App shell and theming: src/App.tsx
- Inputs: src/components/InputCard.tsx
- Summary totals: src/components/SummaryCard.tsx
- Yearly detail table: src/components/YearlyBreakdownTable.tsx

### Calculation Engine

- Dividend and schedule logic: src/libs/dividend.ts
- Month labels: src/libs/months.ts

### Styling

- Tailwind v4 via @import in src/style.css
- Custom color scales (primary, accent) defined in @theme
- Class-based dark mode via .dark on the app root

## Build & Deploy

Run npm run build to generate the dist folder. Deploy dist to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Tech Stack

- SolidJS
- Vite
- Tailwind CSS v4
- TypeScript
