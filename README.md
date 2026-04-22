# 🌊 KAIZEN | Gamified Social Productivity App

[![Status](https://img.shields.io/badge/Status-In--Development-orange?style=for-the-badge)](https://github.com/Dani9809/kaizen)
[![Platform](https://img.shields.io/badge/Platform-Cross--Platform-blue?style=for-the-badge)](https://github.com/Dani9809/kaizen)

**Kaizen** (改善) is a premium, offline-first productivity application designed to turn self-improvement into a collaborative adventure. By combining personal goal tracking with group accountability and gamified virtual pets, Kaizen ensures that your journey towards continuous improvement is both consistent and rewarding.

---

## ✨ Core Features

### 🎮 Gamified Productivity
- **Collective Pet:** Every squad (group) shares a virtual pet that thrives on the group's collective streak.
- **Quest System:** Complete daily solo and group quests to earn rewards and experience.
- **Evolution:** Level up your species and pets through consistent habits.

### 👥 Squad Accountability
- **Group Quests:** Tasks that require participation from all members to succeed.
- **Real-time Nudges:** Send instant notifications to "nudge" squad members who are falling behind.
- **Accountability Logs:** Transparent tracking of who contributed to group goals.

### 🔋 Advanced Mechanics
- **Offline-First Sync:** Track tasks anywhere, anytime. Changes sync automatically when you're back online.
- **Streak Freeze:** High-stakes accountability with a strategic "Freeze" mechanism to protect streaks during emergencies.
- **Midnight Cron Engine:** Automated task generation and streak evaluation at the start of every day.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React Native (Expo), Next.js |
| **Backend** | Node.js (NestJS) |
| **Database** | PostgreSQL |
| **Sync Engine** | WatermelonDB / PowerSync |
| **ORM** | Prisma / TypeORM |
| **Real-time** | Socket.io |
| **Task Queue** | Redis, BullMQ |
| **Auth** | Supabase Auth / Clerk |
| **Payments** | Stripe, RevenueCat |

---

## 🏗️ System Architecture

Kaizen utilizes a robust **Hybrid Architecture** to ensure reliability and performance:

1.  **Client Layer:** Offline-first mobile experience using local SQLite storage.
2.  **Sync Layer:** Intelligent background synchronization between local state and the cloud.
3.  **Application Layer:** A structured NestJS API handling business logic, gamification, and shop transactions.
4.  **Worker Layer:** A dedicated Cron engine for daily task rotation and accountability checks.

---

## 📈 Roadmap

- [ ] Core Authentication & Profile Management
- [ ] Offline-First Task Engine
- [ ] Group (Squad) Creation & Management
- [ ] Virtual Pet & Gamification Logic
- [ ] Shop & Inventory System
- [ ] Real-time Nudge System
- [ ] Premium Subscription Integration

---

<p align="center">
  <i>"Continuous improvement is better than delayed perfection."</i>
</p>