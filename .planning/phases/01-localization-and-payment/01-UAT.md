---
status: testing
phase: 01-localization-and-payment
source: 01-SUMMARY.md
started: 2026-04-18T11:42:00Z
updated: 2026-04-18T11:42:00Z
---

## Current Test

number: 1
name: Language Toggle and Navbar
expected: |
  Toggling the language between English and Hindi in the Navbar translates the texts on the secondary booking pages (Hotels, Trains, Buses).
awaiting: user response

## Tests

### 1. Language Toggle and Navbar
expected: Toggling the language between English and Hindi in the Navbar translates the texts on the secondary booking pages (Hotels, Trains, Buses).
result: pending

### 2. Hotels Page Localization & Booking Flow
expected: On the Hotels page, labels like Check-in, Guests, and Select Room are localized. Clicking Select Room navigates to the Payment page with the correct hotel amount and service title.
result: pending

### 3. Trains Page Localization & Booking Flow
expected: On the Trains page, station inputs and Live Availability status are localized. Clicking Select navigates to the Payment page with the correct train amount and journey title.
result: pending

### 4. Buses Page Localization & Booking Flow
expected: On the Buses page, Seats Left! and View Seats labels are localized. Clicking View Seats navigates to the Payment page with the correct bus amount and service title.
result: pending

### 5. Payment Page Localization & Context
expected: The Payment page checkout summary is bilingual based on the selected language, and it accurately reflects the dynamic amount and selected service details passed from the previous booking page.
result: pending

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0

## Gaps

