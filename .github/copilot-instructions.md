# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js TypeScript application for Order Management and Field Sales Activities system with the following key features:

### Order Management

- List detailed customer orders
- Order status tracking (new, in process, completed, canceled)
- Order history tracking per store
- Reports for total orders per store and overall

### Field Sales Activities

- Field visit proof with photo uploads and GPS location (geotagging)
- Visit history for each sales representative to stores
- Visual dashboard for target achievements (user profile)

## Architecture Guidelines

- Use Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Modern React patterns with hooks and functional components
- Clean, responsive design suitable for mobile and desktop use

## Code Style Preferences

- Use functional components with hooks
- Implement proper TypeScript interfaces for all data structures
- Follow Next.js best practices for routing and data fetching
- Use Tailwind CSS utility classes for styling
- Implement proper error handling and loading states
- Create reusable components where appropriate

## Special Considerations

- GPS location handling for field activities
- Photo upload functionality for visit proof
- Dashboard charts and visualizations
- Mobile-responsive design for field sales use
- Order status management and tracking
- Report generation capabilities
