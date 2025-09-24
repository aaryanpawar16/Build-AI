# BuildAI — No-Code Website Builder

**Live demo:** [https://buildai-no-code-plat-siy0.bolt.host/](https://buildai-no-code-plat-siy0.bolt.host/)

A modern, drag-and-drop no-code website builder aimed at non-technical entrepreneurs.  
BuildAI combines an intuitive visual site builder with AI-assisted content generation and a simple e-commerce dashboard — all shipped as a frontend-focused app using **localStorage** for persistence (no external DB required).

## 🔎 Overview
BuildAI is a TypeScript + React + Vite single-page app that provides:

- a **drag-and-drop page builder** to create pages visually  
- **AI-assisted content generation** for headings, copy and images (integrated prompts / local mock)  
- an **E-commerce dashboard** to add/manage products and orders  
- **persistence using localStorage** (mock seed data included)  
- **lightweight animations** and polish using Framer Motion  

👉 The app intentionally avoids any remote database or hosted backend — everything is stored locally so you can run it offline or deploy a static build.

---

## 🚀 Features
- Visual/droppable components (sections, hero, features, product cards)  
- AI content generator (mockable — replace with your preferred AI integration)  
- Product management: add/edit/delete products, simple inventory flags  
- Cart & checkout flow (orders stored locally, no payments)  
- E-commerce dashboard with products & stats  
- Export/Import site JSON (backup or transfer content)  
- Responsive layout & accessible controls  
- Seed/mock dataset to get started quickly  

---

## 🛠 Tech stack
- **Language:** TypeScript  
- **Framework:** React + React Router  
- **Bundler:** Vite  
- **Styling:** Tailwind CSS  
- **Animations:** Framer Motion  
- **Persistence:** localStorage (mock seed data)  
- **Icons:** lucide-react (or similar)  

---

## 📦 Seeding & data persistence
BuildAI uses **localStorage** to store sites, products, and orders.  

- On first run, if no data exists, it loads seed data (see `src/lib/seed.ts`).  
- Use **Export** to download your site JSON and **Import** to restore it.  
- To reset state manually, run in browser console:

```js
localStorage.clear();
location.reload();
