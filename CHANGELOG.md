# Changelog

All notable changes to this project will be documented in this file.

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
## [0.1.3] - 2026-04-23

### Added
- **Admin Login Overhaul**: Redesigned the login portal with a premium aesthetic, featuring glassmorphism, floating background elements, and high-contrast typography.
- **Sonner Toast Integration**: Upgraded to the modern `Sonner` toast provider for a unified, sleek notification experience across the admin interface.
- **Dynamic Theme Controls**: Integrated a persistent theme selector directly into the login experience for immediate Light/Dark/System mode switching.

### Changed
- **Design System Standardization**: Implemented the `muted-foreground` design token and refined semantic color variables in `globals.css` for superior legibility.
- **Component UI Refresh**: Optimized `Button`, `Input`, `Card`, and `Badge` components to strictly adhere to the updated monochromatic-leaning design system.
- **Administrative Aesthetics**: Refined the Sidebar and Header layouts with improved glassmorphism and subtle micro-animations (e.g., `animate-float`).

### Fixed
- **Security Hardening**: Standardized backend authentication error messages to a generic "Invalid credentials" to prevent potential account enumeration.
- **Environment Awareness**: Improved API host resolution logic in the login flow to support diverse local development environments.

---

## [0.1.2] - 2026-04-22

### Added
- **Safety Confirmation Workflow**: Implemented a reusable `ConfirmationModal` for critical administrative actions (Suspend, Delete, Terminate) to prevent accidental data loss.
- **Enhanced Audit Metrics**: Integrated detailed `Joined` and `Updated` timestamps into player profiles, featuring full date/time strings synced directly with the database.
- **Dynamic Action States**: Added logic to the administrative console to detect and display "Suspended" status, disabling redundant actions for better UX.

### Changed
- **Player Details Overhaul**: Refactored `PlayerDetailsModal` into a high-density, single-column stacked layout for superior data readability on both mobile and desktop.
- **Terminology Update**: Rebranded "Terminate" to "Suspend" across the administrative dashboard to better align with platform policy.
- **UI Density Optimization**: Improved modal spacing and padding (`p-4 sm:p-6`) to maximize screen real estate for administrative tasks.
- **Color Palette Refinement**: Updated `globals.css` with a curated "Kaizen Teal" palette and improved card background contrast for better visual hierarchy.
- **Badge Visibility**: Optimized the "PRO TIER" and status badges to ensure high contrast and readability in Light Mode.

### Fixed
- **JSX Compilation Error**: Resolved a structural error in the admin modal where multiple parent elements were incorrectly nested.
- **Data Field Mapping**: Fixed a bug where join and update dates were not displaying by correctly mapping to `account_created` and `account_updated` schema fields.
- **Icon Redundancy**: Cleaned up the appearance dropdown by removing unnecessary checkmark icons for a cleaner, minimalist aesthetic.

---

## [0.1.1] - 2026-04-22

### Added
- **Global Theme Management**: Implemented a robust `ThemeProvider` supporting System, Light, and Dark modes.
- **Appearance Dropdown**: Replaced the simple theme toggle with a professional dropdown menu in the header for explicit theme selection.
- **System Sync**: Added real-time synchronization with OS color schemes when in "Auto" mode.
- **Theme Persistence**: Integrated `localStorage` to ensure user theme preferences and sidebar states persist across sessions.

### Changed
- **Design System Refinement**: Globally reduced border radius (from 3xl to 2xl, and xl to lg) for a sharper, more professional look.
- **Glassmorphism Update**: Enhanced the `.glass` utility to be theme-aware, providing proper translucent backgrounds in dark mode.
- **Component UI**: Updated `Button`, `Input`, `Badge`, and `Card` components with dedicated dark mode variants to eliminate "flashbang" effects.
- **Sidebar UX**: Optimized the sidebar toggle mechanism and logo visibility for collapsed states.

### Fixed
- **Tailwind 4 Dark Mode**: Resolved an issue where `dark:` utilities were not responding to the `.dark` class by correctly configuring the Tailwind 4 custom variant.
- **Color Responsiveness**: Fixed hardcoded white backgrounds in buttons and action menus that were causing visibility issues in dark mode.
- **Layout Stability**: Resolved lint errors related to missing toggle functions and improved responsive auto-collapse behavior.

---

## [0.1.0] - 2026-04-22

### Added
- **KAIZEN Admin Web Portal**: Initialized a dedicated administrative dashboard in `/admin` for system management.
- **Admin Backend Infrastructure**: Created `AdminModule` and `AuthModule` in the NestJS backend to handle secure administrative access.
- **Authentication System**: Implemented secure login logic with JWT and password hashing using `bcryptjs`.
- **Account Types**: Added `TYPE` table and integrated `type_id` into the `ACCOUNT` model to distinguish between standard users and administrators.
- **Admin Controllers**: Developed endpoints for administrative tasks and dashboard statistics.

### Changed
- **Database Schema**: Updated the Prisma schema to include account type relations and enhanced account metadata.
- **Prisma Service**: Refined database connection logic and error handling in `PrismaService`.
- **App Module**: Integrated new `Admin` and `Auth` modules into the core application logic.
- **Project Structure**: Updated `.gitignore` to manage new frontend and backend build artifacts.

### Fixed
- **Bcrypt Compatibility**: Resolved issues with native `bcrypt` by migrating to `bcryptjs` for consistent cross-platform performance.
- **Database Connectivity**: Stabilized backend-to-database connections during server initialization.

---

## [0.0.2] - 2026-04-22

### Added
- **Backend Infrastructure**: Implemented `PrismaModule` and `PrismaService` using `@prisma/adapter-pg` for improved PostgreSQL driver compatibility.
- **Database Seeding**: Created a comprehensive `seed.ts` script to populate lookup tables including Account Statuses, Subscription Tiers, Roles, and Task Statuses.
- **Global API Configuration**: Enabled CORS and global `ValidationPipe` in NestJS for secure and validated frontend communication.

### Changed
- **Prisma Configuration**: Updated `prisma.config.ts` to support automated database seeding and optimized connection handling.

---

## [0.0.1] - 2026-04-22

### Added
- **Backend Architecture**: Initialized **NestJS** application in `/backend` providing a modular and scalable structure.
- **Frontend Architecture**: Initialized **Expo** (React Native) application in `/frontend` with TypeScript and Expo Router.
- **Database Schema**: Configured **Prisma ORM** with a comprehensive `schema.prisma` covering 30+ tables (Accounts, Squads, Quests, Tasks, Shop, and Pets).
- **Styling System**: Configured **NativeWind** (Tailwind CSS) v4 for professional and responsive UI development.
- **Navigation Layout**: Implemented a custom Tab navigation system featuring Dashboard, Squads, Shop, and Profile views.
- **Health Monitoring**: Integrated a `/health` endpoint in the backend to monitor service status.
- **Project Organization**: Established a clean root structure with dedicated `.gitignore`.

---

## [Initial Commit] - 2026-04-22
### Added
- **ERD**: Created `ERD/v1/Productivity App_ User Side.jpeg` and `ERD/v1/Productivity App_ Group Side.jpeg` covering system architecture, ERD, and database schema.
- **Project Documentation**: Created comprehensive `KAIZEN APP PLANNING.md` covering system architecture, ERD, and database schema.
- **README**: Initial `README.md` with project overview, core features, and technology stack.
- **Project Structure**: Established the foundation for the Kaizen gamified productivity application.
- **Changelog**: Initialized `CHANGELOG.md` to track project evolution.

---
