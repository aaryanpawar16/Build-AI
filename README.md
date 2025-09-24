BuildAI — No-Code Website Builder (README)

Live demo: https://buildai-no-code-plat-siy0.bolt.host/

A modern, drag-and-drop no-code website builder aimed at non-technical entrepreneurs. BuildAI combines an intuitive visual site builder with AI-assisted content generation and a simple e-commerce dashboard — all shipped as a frontend-focused app using localStorage for persistence (no external DB required).

Table of contents

Overview

Features

Tech stack

Getting started (local development)

Project structure

Seeding & data persistence

Deployment

Usage notes & tips

Contributing

Troubleshooting

License & contact

Overview

BuildAI is a TypeScript + React + Vite single-page app that provides:

a drag-and-drop page builder to create pages visually,

AI-assisted content generation for headings, copy and images (integrated prompts / local mock),

an E-commerce dashboard to add/manage products and orders,

persistence using localStorage (mock seed data included), and

lightweight animations and polish using Framer Motion.

The app intentionally avoids any remote database or hosted backend — everything is stored locally so you can run it offline or deploy a static build.

Features

Visual/droppable components (sections, hero, features, product cards)

AI content generator (mockable — replace with your preferred AI integration)

Product management: add/edit/delete products, simple inventory flags

Cart & checkout flow that stores orders locally (no payment provider integration)

E-commerce dashboard to view orders and product stats

Export/Import site JSON (to back up or transfer content)

Responsive layout and accessible controls

Seed/mock dataset to get started quickly

Tech stack

Language: TypeScript

Framework: React + React Router

Bundler: Vite

Styling: Tailwind CSS

Animations: Framer Motion

Persistence: localStorage (mock seed data)

Icons: lucide-react (or similar)


Seeding & data persistence

BuildAI uses localStorage to store sites, products, and orders. The repository includes a seed file (e.g. src/lib/seed.ts) with example pages and product data.

When you first run the app, it checks for existing data in localStorage.

If none exists, it loads the seed dataset.

Use Export to download your site JSON and Import to restore it.

If you want to reset the app state in the browser, open the dev console and run:

localStorage.clear();
location.reload();

Deployment

This repository builds to static assets — it can be deployed to any static host: Vercel, Netlify, GitHub Pages, Bolt, Surge, etc.

Deploy to Bolt

Bolt (bolt.host) can directly host the static build. Common flow:

Push code to a Git provider (e.g. GitHub).

Connect repo to Bolt and set build command: npm run build and publish directory: dist.

Set environment variables if you add any server or API integration later.

Since BuildAI uses localStorage, no server or database is required.

Usage notes & extension points

Enable a real AI service: Replace the mock AI content function with calls to your chosen provider. For client safety, either implement a minimal backend to proxy requests (recommended) or use a serverless function.

Persistent hosting: To share edited sites between users, add a simple backend (Node/Express or serverless) and a DB. Otherwise, distribute site JSON exports.

Payments: For live payments, integrate Stripe/PayPal on a secure server side.

Multi-user: Add authentication (Auth0, Firebase Auth, or custom) and user-scoped storage.

Contributing

Contributions welcome! Suggested workflow:

Fork the repo

Create a feature branch: git checkout -b feat/awesome

Commit small, focused changes and open a PR describing the change

Keep changes focused: UI, bugfix, doc updates are all great

Please run linters and formatters before opening PRs.

Troubleshooting

App fails to start / dependency errors: delete node_modules and reinstall:

rm -rf node_modules package-lock.json
npm install

Live demo: https://buildai-no-code-plat-siy0.bolt.host/
