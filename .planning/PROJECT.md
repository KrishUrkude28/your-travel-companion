# TravelSathi

## What This Is

TravelSathi is a multi-language travel booking companion designed for high-performance and cultural accessibility. It features AI-powered day-by-day trip planning, real-time-simulated flight/hotel/train/bus search, and an OLED-optimized pure black dark mode for battery efficiency.

## Core Value

Empower travelers with culturally localized, AI-driven itineraries and a seamless booking experience that feels premium and responsive.

## Requirements

### Validated

- ✓ **AI Trip Planner** — (Llama 3.3 70B via Groq)
- ✓ **Multi-Currency Support** — (INR, USD, EUR)
- ✓ **Interactive Maps** — (Leaflet integration)
- ✓ **Live Weather Widget** — (Open-Meteo)
- ✓ **Core Booking Dashboard** — (Supabase synced)
- ✓ **Multi-Language Support** — (English and Hindi localization)
- ✓ **Dynamic Payment Flow** — (Context-aware simulated checkout)

### Active

- [ ] **PWA Support** — Offline manifest and service worker
- [ ] **Search Autocomplete** — Geocoding-powered destination suggestions
- [ ] **Price Comparison** — Side-by-side travel table
- [ ] **WhatsApp Share** — One-click itinerary sharing
- [ ] **PDF Export** — Export AI plans to PDF

### Out of Scope

- [Real API Integration] — Deferred: Moving from simulated to live Amadeus/Razorpay APIs is targeted for the next milestone.

## Context

The project is built with React, Vite, and TailwindCSS (though focusing on Vanilla CSS for premium styling). It utilizes a pure black (#000000) design system for OLED mobile devices. Localization is handled via i18next.

---
*Last updated: 2026-04-18 after Phase 1 (Localization)*
