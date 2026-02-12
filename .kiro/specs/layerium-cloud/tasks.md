# Implementation Plan: Layerium Cloud

## Overview

This implementation plan breaks down the Layerium Cloud SaaS platform into discrete, incremental coding tasks. Each task builds on previous work, ensuring no orphaned code. The plan follows a foundation-first approach: project setup → design system → database → authentication → marketing pages → user dashboard → admin panel.

**Tech Stack:**
- Next.js 15 (App Router with React Server Components)
- React 19 (with Server Actions and use() hook)
- TypeScript 5.x
- Tailwind CSS v4 (CSS-first configuration)
- Supabase (Auth, Database, RLS)
- Framer Motion (subtle animations)
- Zod (validation)
- fast-check (property-based testing)

## Tasks

- [x] 1. Project Setup and Configuration
  - [x] 1.1 Initialize Next.js 15 project with TypeScript, React 19, and App Router
    - Run `npx create-next-app@latest` with TypeScript, Tailwind CSS v4, App Router, and src directory disabled
    - Use React 19 (included with Next.js 15)
    - Configure `next.config.ts` for image domains and environment variables
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Configure Tailwind CSS v4 with custom design system
    - Add Google Fonts (Google Sans, DM Sans, Outfit, Work Sans) to layout using next/font
    - Configure Tailwind v4 using CSS-first configuration in `app/globals.css` with @theme directive
    - Define exact color palette (#cafc4f, #ffe4db, #fcf7f3, #f0ede8, #1e1f26) as CSS variables
    - Add custom font families and design tokens using @theme
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.3 Set up project structure and dependencies
    - Create folder structure: `components/ui`, `components/marketing`, `components/dashboard`, `components/admin`, `lib`, `hooks`, `types`
    - Install dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `framer-motion`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`
    - Create utility functions (`cn` for className merging)
    - Note: Tailwind v4 is included with create-next-app, no separate install needed
    - _Requirements: 1.1_

  - [x] 1.4 Configure Supabase client utilities
    - Create `lib/supabase/client.ts` for browser client
    - Create `lib/supabase/server.ts` for server components
    - Create `lib/supabase/admin.ts` for admin operations
    - Set up environment variables template (`.env.example`)
    - _Requirements: 14.1_

- [x] 2. Design System Components
  - [x] 2.1 Create Button component with variants
    - Implement pill-shaped buttons with px-6 py-3 padding
    - Add variants: primary (#cafc4f), secondary (outlined), ghost, link
    - Integrate Framer Motion for subtle hover animations (scale 1.02)
    - _Requirements: 1.4, 16.1_

  - [x] 2.2 Create Card component
    - Implement card with soft shadows and thin borders
    - Add variants for feature cards, pricing cards, testimonial cards
    - Use Surface 1 (#fcf7f3) and Surface 2 (#f0ede8) backgrounds
    - _Requirements: 1.7_

  - [x] 2.3 Create Input and Form components
    - Implement text input, select, textarea with consistent styling
    - Add form field wrapper with label and error message support
    - Integrate Zod validation display
    - _Requirements: 13.6_

  - [x] 2.4 Create Accordion component for FAQ
    - Implement collapsible accordion with Framer Motion animations
    - Support single and multiple open items
    - Style with design system colors
    - _Requirements: 6.4, 16.3_

  - [x] 2.5 Create additional UI components
    - Badge component for status indicators
    - Avatar component for user images
    - Table component for data display
    - Modal/Dialog component
    - Toast/Notification component
    - _Requirements: 1.7, 1.8_

  - [x] 2.6 Write property test for Button component accessibility
    - **Property 20: Interactive Element ARIA**
    - Verify all button variants have appropriate ARIA attributes
    - **Validates: Requirements 15.4**

- [x] 3. Database Schema and Types
  - [x] 3.1 Create TypeScript type definitions
    - Define `types/database.ts` with all entity interfaces (User, PricingPlan, Server, Order, Ticket, TicketMessage, ActivityLog)
    - Define `types/api.ts` with API response types
    - Define `types/pricing.ts` with currency and region types
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 3.2 Create Supabase database schema ✅ COMPLETE
    - Write SQL migration for profiles table (extends auth.users) ✅
    - Write SQL migration for pricing_plans table with regional pricing ✅
    - Write SQL migration for servers table with status tracking ✅
    - Write SQL migration for orders table ✅
    - Write SQL migration for tickets and ticket_messages tables ✅
    - Write SQL migration for activity_logs table ✅
    - Add indexes for query performance ✅
    - Add updated_at triggers ✅
    - Added: datacenters, os_templates, payment_methods, app_settings tables ✅
    - Added: Auto-profile creation on signup trigger ✅
    - Added: Auto-generated order/invoice/ticket numbers ✅
    - Added: Referral code generation ✅
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [x] 3.3 Implement Row Level Security policies ✅ COMPLETE
    - Create RLS policies for profiles (own profile access, admin access) ✅
    - Create RLS policies for pricing_plans (public read, admin write) ✅
    - Create RLS policies for servers (own servers, admin view all) ✅
    - Create RLS policies for orders (own orders, admin view all) ✅
    - Create RLS policies for tickets and messages (own tickets, admin manage all) ✅
    - Create RLS policies for activity_logs (own logs, admin view all) ✅
    - Added: RLS for datacenters, os_templates, payment_methods, app_settings ✅
    - _Requirements: 13.1_

  - [ ] 3.4 Write property test for RLS enforcement
    - **Property 15: Row Level Security Enforcement**
    - Test that users can only access their own data
    - Test that admins can access all data
    - **Validates: Requirements 13.1**

- [x] 4. Validation Schemas
  - [x] 4.1 Create Zod validation schemas
    - Implement `lib/validations/auth.ts` (login, register, password reset)
    - Implement `lib/validations/server.ts` (create, update, actions)
    - Implement `lib/validations/ticket.ts` (create ticket, add message)
    - Implement `lib/validations/pricing.ts` (admin plan management)
    - _Requirements: 13.6_

  - [ ] 4.2 Write property test for input validation
    - **Property 18: Input Validation with Zod**
    - Test that invalid inputs are rejected with appropriate errors
    - Test that valid inputs pass validation
    - **Validates: Requirements 13.6**

- [x] 5. Edge Middleware and Geo Detection
  - [x] 5.1 Implement Edge Middleware for geo detection
    - Create `middleware.ts` with IP-based country detection
    - Map countries to currencies (PK → PKR, USD countries → USD)
    - Set geo headers and cookies for downstream use
    - Implement fallback to USD for unknown regions
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [x] 5.2 Create pricing utility functions
    - Implement `lib/utils/geo.ts` with `determineCurrency` function
    - Implement `lib/utils/pricing.ts` for price formatting by currency
    - Create `hooks/use-pricing.ts` for client-side currency access
    - _Requirements: 2.4, 2.5_

  - [ ] 5.3 Write property test for geo-based currency detection
    - **Property 1: Geo-Based Currency Detection**
    - Test Pakistan maps to PKR
    - Test USD countries map to USD
    - Test unknown countries default to USD
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.6, 5.2**

- [ ] 6. Checkpoint - Foundation Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify Tailwind config, Supabase connection, and middleware work correctly.

- [x] 7. Authentication System
  - [x] 7.1 Create authentication pages layout
    - Create `app/(auth)/layout.tsx` with centered card design
    - Style with design system (background #ffe4db, card #fcf7f3)
    - _Requirements: 1.1, 1.2_

  - [x] 7.2 Implement login page
    - Create `app/(auth)/login/page.tsx` with email/password form
    - Integrate Supabase auth signInWithPassword
    - Add OAuth buttons for Google and GitHub
    - Handle errors with clear messages
    - Redirect to dashboard on success
    - _Requirements: 7.1, 7.2, 7.4_

  - [x] 7.3 Implement registration page
    - Create `app/(auth)/register/page.tsx` with registration form
    - Validate with Zod schema (email, password strength, full name)
    - Create user profile in Supabase on successful registration
    - Handle errors with clear messages
    - _Requirements: 7.1, 7.3, 7.4_

  - [x] 7.4 Implement password reset flow
    - Create `app/(auth)/forgot-password/page.tsx`
    - Create `app/(auth)/reset-password/page.tsx`
    - Integrate Supabase password reset emails
    - _Requirements: 7.6_

  - [x] 7.5 Create auth middleware and session management
    - Create auth callback route for OAuth
    - Implement session refresh in middleware
    - Create `hooks/use-auth.ts` for auth state
    - _Requirements: 7.5_

  - [ ] 7.6 Write property test for user registration
    - **Property 5: User Registration Profile Creation**
    - Test that registration creates profile with correct data
    - Test role defaults to 'USER'
    - **Validates: Requirements 7.3**

  - [ ] 7.7 Write property test for auth error handling
    - **Property 6: Authentication Error Handling**
    - Test invalid credentials return error messages
    - Test malformed input returns validation errors
    - **Validates: Requirements 7.4**

- [x] 8. Marketing Website - Layout and Hero
  - [x] 8.1 Create marketing layout
    - Create `app/(marketing)/layout.tsx` with header and footer
    - Implement responsive navigation with logo "Layerium Cloud"
    - Add navigation links: Features, Pricing, Locations, Login, Get Started
    - Style header with sticky positioning and blur backdrop
    - _Requirements: 1.1, 1.8_

  - [x] 8.2 Implement Hero section
    - Create `components/marketing/hero.tsx`
    - Add headline "High-Performance VPS & RDP Hosting"
    - Add sub-headline about uptime, NVMe, global locations
    - Add "View Plans" button (scrolls to pricing)
    - Add "Deploy Server" button (links to deployment)
    - Add abstract server illustration (SVG, no gradients)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6_

  - [x] 8.3 Implement Footer
    - Create `components/marketing/footer.tsx`
    - Add Layerium Cloud branding
    - Add navigation columns: Product, Company, Resources, Legal
    - Add social icons (clean, minimal style)
    - Add copyright notice
    - _Requirements: 6.5_

- [x] 9. Marketing Website - Features Section
  - [x] 9.1 Implement Features section
    - Create `components/marketing/features.tsx`
    - Define 8 features: NVMe SSD, Instant Deployment, Root Access, Global Datacenters, IPv4+IPv6, Secure Firewall, DDoS Protection, 24/7 Support
    - Create feature card component with icon, title, description
    - Use Lucide icons (Server, Cloud, Cpu, HardDrive, Globe, Shield, Lock, Headphones)
    - Arrange in responsive grid (4x2 on desktop, 2x4 on tablet, 1x8 on mobile)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 9.2 Write property test for feature display completeness
    - **Property 2: Feature Display Completeness**
    - Test each feature has icon, title, and description
    - **Validates: Requirements 4.3**

- [x] 10. Marketing Website - Pricing Section
  - [x] 10.1 Create pricing data fetching
    - Create server action to fetch pricing plans from Supabase
    - Filter by type (VPS/RDP) and is_active
    - Include currency-specific pricing based on geo detection
    - _Requirements: 5.3, 2.4_

  - [x] 10.2 Implement Pricing section
    - Create `components/marketing/pricing.tsx`
    - Add tabs for VPS and RDP plans
    - Create pricing card component showing: plan name, price (with currency), RAM, CPU, Storage, Bandwidth, Locations
    - Highlight popular plans
    - Add "Deploy Now" pill button on each card
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_

  - [ ] 10.3 Write property test for pricing display completeness
    - **Property 3: Pricing Plan Display Completeness**
    - Test each plan displays all required fields
    - Test Deploy Now button is present
    - **Validates: Requirements 5.4, 5.5**

- [x] 11. Marketing Website - Additional Sections
  - [x] 11.1 Implement Why Choose Us section
    - Create `components/marketing/why-choose-us.tsx`
    - Add 5 value propositions with icons and descriptions
    - Style as horizontal cards or alternating layout
    - _Requirements: 6.1_

  - [x] 11.2 Implement Datacenter Locations section
    - Create `components/marketing/datacenters.tsx`
    - Display 6 locations: USA, Germany, Singapore, Netherlands, UAE, Pakistan
    - Show flag icons and latency indicators
    - Optional: Add world map visualization
    - _Requirements: 6.2_

  - [x] 11.3 Implement Testimonials section
    - Create `components/marketing/testimonials.tsx`
    - Display 4 testimonials with avatar, name, region, review, rating
    - Style as carousel or grid
    - _Requirements: 6.3_

  - [ ] 11.4 Write property test for testimonial display completeness
    - **Property 4: Testimonial Display Completeness**
    - Test each testimonial has all required fields
    - **Validates: Requirements 6.3**

  - [x] 11.5 Implement FAQ section
    - Create `components/marketing/faq.tsx`
    - Add 8-10 common questions about VPS/RDP hosting
    - Use Accordion component with smooth animations
    - _Requirements: 6.4_

- [x] 12. Marketing Website - Assembly
  - [x] 12.1 Assemble marketing homepage
    - Create `app/(marketing)/page.tsx`
    - Compose all sections: Hero, Features, Pricing, Why Choose Us, Datacenters, Testimonials, FAQ
    - Add smooth scroll behavior for anchor links
    - Ensure proper spacing between sections
    - _Requirements: 3.1-6.5_

  - [ ] 12.2 Write property test for image accessibility
    - **Property 19: Image Accessibility**
    - Test all images have non-empty alt attributes
    - **Validates: Requirements 15.2**

- [ ] 13. Checkpoint - Marketing Website Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify responsive design across breakpoints.
  - Test geo-based pricing display.

- [-] 14. User Dashboard - Layout and Overview
  - [x] 14.1 Create dashboard layout
    - Create `app/(dashboard)/layout.tsx` with sidebar navigation
    - Implement sidebar with links: Dashboard, Servers, Billing, Support
    - Add user profile dropdown in header
    - Protect routes with auth middleware
    - _Requirements: 8.1, 13.2_

  - [x] 14.2 Implement Dashboard home page
    - Create `app/(dashboard)/dashboard/page.tsx`
    - Display server count and list preview
    - Display usage metrics summary (mock data initially)
    - Display open tickets count
    - Display next invoice info (if billing enabled)
    - Add quick action buttons
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 14.3 Write property test for dashboard count accuracy
    - **Property 7: Dashboard Count Accuracy**
    - Test server count matches database
    - Test ticket count matches open tickets
    - **Validates: Requirements 8.1, 8.3**

- [ ] 15. User Dashboard - Server Management
  - [x] 15.1 Create server list page
    - Create `app/(dashboard)/servers/page.tsx`
    - Fetch user's servers from Supabase
    - Display server cards with status, hostname, IP, location
    - Add "Deploy New Server" button
    - _Requirements: 9.1_

  - [x] 15.2 Create server detail page
    - Create `app/(dashboard)/servers/[id]/page.tsx`
    - Display server stats: CPU, RAM, Disk usage (mock or real)
    - Display IP information and reverse DNS
    - Display OS template and location
    - _Requirements: 9.1, 9.6_

  - [ ] 15.3 Implement server control actions
    - Add Start, Stop, Restart buttons with confirmation
    - Create API routes for server actions
    - Update server status in Supabase
    - Log actions to activity_logs
    - _Requirements: 9.2, 9.8_

  - [ ] 15.4 Implement server configuration
    - Add hostname change form
    - Add password change form (hashed storage)
    - Add reverse DNS configuration
    - _Requirements: 9.5_

  - [ ] 15.5 Implement OS rebuild functionality
    - Create OS template selector
    - Add rebuild confirmation modal
    - Create API route for rebuild action
    - _Requirements: 9.3, 9.4_

  - [ ] 15.6 Implement activity logs display
    - Create activity log component
    - Fetch logs for specific server
    - Display action, timestamp, details
    - _Requirements: 9.7_

  - [ ] 15.7 Write property test for server action state transitions
    - **Property 9: Server Action State Transitions**
    - Test start → running, stop → stopped, restart → running
    - **Validates: Requirements 9.8**

  - [ ] 15.8 Write property test for server information display
    - **Property 8: Server Information Display**
    - Test all server info fields are displayed
    - **Validates: Requirements 9.1, 9.6, 9.7**

- [ ] 16. User Dashboard - Billing
  - [x] 16.1 Create billing page
    - Create `app/(dashboard)/billing/page.tsx`
    - Display transaction history table
    - Show order details: amount, currency, status, date
    - _Requirements: 10.1_

  - [ ] 16.2 Implement invoice display
    - Create invoice detail view
    - Add download invoice functionality (PDF generation or placeholder)
    - _Requirements: 10.2_

  - [ ] 16.3 Implement payment methods section
    - Create placeholder payment method management
    - If Stripe configured: integrate Stripe Elements
    - If not: show placeholder UI
    - _Requirements: 10.3, 10.5_

  - [ ] 16.4 Write property test for billing transaction display
    - **Property 10: Billing Transaction Display**
    - Test all orders are displayed with required fields
    - **Validates: Requirements 10.1, 10.4**

- [ ] 17. User Dashboard - Support Tickets
  - [ ] 17.1 Create tickets list page
    - Create `app/(dashboard)/support/page.tsx`
    - Display user's tickets with status, subject, priority, date
    - Add "Create Ticket" button
    - _Requirements: 11.2_

  - [ ] 17.2 Implement create ticket form
    - Create ticket creation modal or page
    - Include subject, category, priority, initial message
    - Validate with Zod schema
    - _Requirements: 11.1_

  - [ ] 17.3 Create ticket detail page
    - Create `app/(dashboard)/support/[id]/page.tsx`
    - Display ticket info: subject, category, priority, status
    - Display conversation thread
    - Add reply form for open tickets
    - _Requirements: 11.3, 11.4, 11.5_

  - [ ] 17.4 Write property test for ticket conversation integrity
    - **Property 11: Ticket Conversation Integrity**
    - Test all messages are displayed in order
    - Test adding message increases count by one
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5**

- [ ] 18. Checkpoint - User Dashboard Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Test all dashboard functionality with mock data.
  - Verify RLS policies work correctly.

- [ ] 19. Admin Panel - Layout and Dashboard
  - [ ] 19.1 Create admin layout with role protection
    - Create `app/(admin)/layout.tsx` with admin sidebar
    - Implement role check middleware (ADMIN only)
    - Add navigation: Dashboard, Users, Orders, Plans, Servers, Tickets
    - _Requirements: 12.8, 13.4_

  - [ ] 19.2 Write property test for role-based access control
    - **Property 14: Role-Based Access Control**
    - Test USER role gets 403 on admin routes
    - Test ADMIN role gets access
    - **Validates: Requirements 12.8, 13.4**

  - [ ] 19.3 Create admin dashboard
    - Create `app/(admin)/admin/page.tsx`
    - Display key metrics: total users, active servers, revenue, open tickets
    - Add recent activity feed
    - _Requirements: 12.6_

- [ ] 20. Admin Panel - User Management
  - [ ] 20.1 Create users list page
    - Create `app/(admin)/admin/users/page.tsx`
    - Display users table with: email, name, role, created date, status
    - Add search and filter functionality
    - Implement pagination
    - _Requirements: 12.1, 12.7_

  - [ ] 20.2 Create user detail/edit page
    - Create `app/(admin)/admin/users/[id]/page.tsx`
    - Display user profile and activity
    - Allow role changes (USER ↔ ADMIN)
    - Allow account disable/enable
    - _Requirements: 12.1_

- [ ] 21. Admin Panel - Order Management
  - [ ] 21.1 Create orders list page
    - Create `app/(admin)/admin/orders/page.tsx`
    - Display orders table with: user, plan, amount, status, date
    - Add filters by status, date range
    - Implement pagination
    - _Requirements: 12.2, 12.7_

  - [ ] 21.2 Create order detail page
    - Create `app/(admin)/admin/orders/[id]/page.tsx`
    - Display full order details
    - Allow status updates (pending → completed, refunded)
    - _Requirements: 12.2_

- [ ] 22. Admin Panel - Pricing Plan Management
  - [ ] 22.1 Create pricing plans list page
    - Create `app/(admin)/admin/plans/page.tsx`
    - Display plans table with: name, type, prices, status
    - Add create new plan button
    - _Requirements: 12.3_

  - [ ] 22.2 Implement plan CRUD operations
    - Create plan creation form
    - Create plan edit form
    - Implement delete with confirmation
    - Validate with Zod schema
    - _Requirements: 12.3_

  - [ ] 22.3 Write property test for admin CRUD operations
    - **Property 12: Admin Pricing Plan CRUD**
    - Test CREATE adds exactly one plan
    - Test UPDATE modifies only specified fields
    - Test DELETE removes exactly one plan
    - **Validates: Requirements 12.3**

  - [ ] 22.4 Write property test for admin table pagination
    - **Property 13: Admin Table Pagination**
    - Test pagination returns correct number of items
    - Test total pages calculation
    - **Validates: Requirements 12.7**

- [ ] 23. Admin Panel - Server and Ticket Management
  - [ ] 23.1 Create servers management page
    - Create `app/(admin)/admin/servers/page.tsx`
    - Display all servers across users
    - Show status, user, plan, location
    - Allow admin actions on servers
    - _Requirements: 12.4_

  - [ ] 23.2 Create tickets management page
    - Create `app/(admin)/admin/tickets/page.tsx`
    - Display all tickets with filters
    - Allow status changes and assignment
    - _Requirements: 12.5_

  - [ ] 23.3 Implement admin ticket responses
    - Add staff reply functionality
    - Mark replies as is_staff_reply
    - Allow ticket closure
    - _Requirements: 12.5_

- [ ] 24. API Routes and Security
  - [ ] 24.1 Create API route handlers
    - Create `app/api/servers/route.ts` (list, create)
    - Create `app/api/servers/[id]/route.ts` (get, update, delete)
    - Create `app/api/servers/[id]/actions/route.ts` (start, stop, restart, rebuild)
    - Create `app/api/tickets/route.ts` (list, create)
    - Create `app/api/tickets/[id]/route.ts` (get, update)
    - Create `app/api/tickets/[id]/messages/route.ts` (list, create)
    - Create `app/api/admin/*` routes for admin operations
    - _Requirements: 13.2_

  - [ ] 24.2 Implement error handling
    - Create `app/api/utils/error-handler.ts`
    - Handle Zod validation errors
    - Handle Supabase errors
    - Return consistent error responses
    - _Requirements: 13.5_

  - [ ] 24.3 Implement rate limiting middleware
    - Create rate limiting utility
    - Apply to API routes
    - Configure limits per endpoint
    - _Requirements: 13.3_

  - [ ] 24.4 Write property test for API authentication
    - **Property 16: API Route Authentication**
    - Test unauthenticated requests return 401
    - **Validates: Requirements 13.2**

  - [ ] 24.5 Write property test for rate limiting
    - **Property 17: Rate Limiting**
    - Test requests over limit return 429
    - **Validates: Requirements 13.3**

- [ ] 25. Server Deployment Flow
  - [ ] 25.1 Create deployment page
    - Create `app/(dashboard)/deploy/page.tsx`
    - Display plan selection (from pricing)
    - Add location selector
    - Add OS template selector
    - Add hostname input
    - _Requirements: 3.6, 9.4_

  - [ ] 25.2 Implement deployment process
    - Create order on plan selection
    - Integrate payment flow (Stripe or placeholder)
    - Create server record on successful payment
    - Set initial status to 'provisioning'
    - _Requirements: 9.8, 10.5_

- [ ] 26. Final Polish and Accessibility
  - [ ] 26.1 Implement page transitions
    - Add Framer Motion page transitions
    - Keep animations subtle and professional
    - _Requirements: 16.2_

  - [ ] 26.2 Accessibility audit and fixes
    - Add semantic HTML throughout
    - Ensure keyboard navigation works
    - Add ARIA labels where needed
    - Test with screen reader
    - _Requirements: 15.1, 15.3, 15.4_

  - [ ] 26.3 Performance optimization
    - Optimize images with next/image
    - Implement loading states
    - Minimize layout shift
    - _Requirements: 15.5, 15.6, 15.7_

  - [ ] 26.4 Mobile responsiveness review
    - Test all pages on mobile breakpoints
    - Fix any responsive issues
    - Ensure touch targets are adequate
    - _Requirements: 15.6_

- [ ] 27. Final Checkpoint - Project Complete
  - Ensure all tests pass, ask the user if questions arise.
  - Run Lighthouse audit and verify scores.
  - Test complete user flows: registration → deployment → management.
  - Verify admin panel functionality.

## Notes

- All tasks are required for comprehensive test coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (20 properties total)
- Unit tests validate specific examples and edge cases
- Server provisioning logic is mocked - real provisioning would require integration with a VPS provider API
