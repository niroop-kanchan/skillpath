# Skillpath — Junior Developer Assignment

A responsive single-page learning platform built in Framer. The courses section is implemented as a React/TypeScript Code Component and consumes the provided live APIs.

## Features

* Live course data from the provided API
* Country-based INR/USD pricing
* Correct paise/cents conversion
* Loading skeletons
* Course API error handling
* Zero-results state
* Separate country API failure handling
* Search and price sorting
* Retry functionality
* Refundable course badges
* Dynamic course count
* Course-card hover interaction
* Responsive 3-column, 2-column, and 1-column layouts
* Framer property controls for accent color and card radius

## APIs

Course data:
https://syncsphere-hiv6.onrender.com/assignment/course-data

Country data:
https://syncsphere-hiv6.onrender.com/assignment/country-code

## Published Framer Site

https://skillpathbyniroop.framer.website/#footer

## Short Note

I built Skillpath as a responsive single-page learning platform in Framer, with the courses section implemented as a React/TypeScript Code Component. It fetches live course and country data from the provided APIs and handles loading, API errors, zero results, currency failures, search, sorting, retry behavior, and responsive layouts.

The main challenge was handling the intentionally unreliable APIs, especially when the course request succeeds while the country request fails. I chose to keep valid course data visible while clearly indicating that pricing is temporarily unavailable.

With two more days, I would further refine the visual system, improve the mobile navigation, and add a more advanced course discovery experience.

## AI Usage

I used ChatGPT during development for React/API implementation guidance, debugging, and implementation ideas. I reviewed and tested the final implementation in Framer and adapted it to the assignment requirements.

## Shared AI Conversation
https://chatgpt.com/share/6a7ff78e-e5b0-83ee-a78a-6a835419e5b5
