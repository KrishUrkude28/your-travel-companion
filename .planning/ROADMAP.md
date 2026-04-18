# ROADMAP

## Milestone 1: Localization & Polish (Current)

- [x] Phase 1: Multi-language Support (English/Hindi) & Dynamic Payment Flow
- [x] Phase 2: PWA & Search Autocomplete

## Milestone 2: Live Integration

- [x] Phase 3: Real API Integration & UX Polish
- [ ] Phase 4: Production Deployment

## Phase Details

### Phase 1: Multi-language Support (English/Hindi) & Dynamic Payment Flow
**Goal**: Implement Hindi language support across all modules and dynamic payment data flow.
**Depends on**: Nothing
**Success Criteria**:
  1. Localization toggles between English and Hindi across Hotels, Trains, and Buses modules.
  2. Dynamic booking amount and service type successfully passed to the Payment gateway.
**Plans**: 1
Plans:
- [x] 01-01: Implement i18n & dynamic routing state for payments.

### Phase 2: PWA & Search Autocomplete
**Goal**: Enhance the app with offline progressive web app support and geocoding-powered autocomplete for searches.
**Depends on**: Phase 1
**Success Criteria**:
  1. User can install the application to their home screen on mobile.
  2. Search inputs suggest destinations as the user types.
**Plans**: 2
Plans:
- [x] 02-01: Update Vite PWA manifest and configure service worker.
- [x] 02-02: Implement search autocomplete across forms.

### Phase 3: Real API Integration (Amadeus/Razorpay)
**Goal**: Connect to live travel and payment endpoints.
**Depends on**: Phase 2
**Success Criteria**:
  1. Flights and Hotels use real data APIs.
  2. Mock payment replaces dummy values with Razorpay standard test credentials.
**Plans**: TBD

### Phase 4: Production Deployment
**Goal**: Finalize build, environment vars, and deploy.
**Depends on**: Phase 3
**Success Criteria**:
  1. Application deployed and live.
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Localization | 1/1 | Complete | 2026-04-18 |
| 2. PWA & Autocomplete | 2/2 | Complete | 2026-04-18 |
| 3. API Integration | 0/0 | Not started | - |
| 4. Production | 0/0 | Not started | - |
