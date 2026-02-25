# FINVERSE AI Development Rules

## Tech Stack
- **Framework**: React 18 with Vite and TypeScript for high-performance frontend development.
- **Styling**: Tailwind CSS using a custom "Neon-Glassmorphism" design system defined in `src/index.css`.
- **UI Components**: shadcn/ui (Radix UI) for accessible, unstyled primitives customized with glass effects.
- **Animations**: Framer Motion for all transitions, micro-interactions, and layout animations.
- **Icons**: Lucide React for consistent, scalable vector iconography.
- **Charts**: Recharts for data visualization, styled to match the neon aesthetic.
- **Routing**: React Router (v6) for client-side navigation.
- **State Management**: TanStack Query (React Query) for server state and data fetching.
- **Backend Simulation**: Express.js (Node.js) for the Treasury Node relay system.

## Development Guidelines

### 1. Component Architecture
- **Atomic Design**: Keep components small and focused. Create new files in `src/components/` for any reusable UI element.
- **Glassmorphism**: Use the `<GlassCard />` component or `glass-card` / `glass-card-hover` Tailwind classes for containers.
- **Responsive Design**: Always use mobile-first Tailwind classes (e.g., `sm:`, `md:`, `lg:`).

### 2. Styling & Theming
- **Colors**: Use CSS variables defined in `index.css` (e.g., `text-primary`, `text-neon-emerald`, `bg-background`).
- **Typography**: Use `font-sans` for general text and `mono` (JetBrains Mono) for financial figures and data.
- **Consistency**: Do not hardcode hex values; always use the Tailwind theme tokens.

### 3. Library Usage Rules
- **Icons**: Always use `lucide-react`. Do not install other icon libraries.
- **Animations**: Use `framer-motion` for any element that moves or fades. Avoid raw CSS transitions where possible for complex logic.
- **Data Viz**: Use `recharts`. Ensure charts use the theme colors (Primary Blue, Neon Emerald, Neon Rose).
- **Forms**: Use `react-hook-form` combined with `zod` for validation.

### 4. Financial Logic
- **Engines**: All financial calculations (EMI, SIP, Tax, Credit) must reside in `src/lib/financialEngines.ts` to ensure a single source of truth.
- **Formatting**: Use `toLocaleString()` for currency display and keep precision consistent (usually 0 or 2 decimal places).

### 5. Backend Integration
- **Treasury Node**: Any "transactional" or "relay" actions should interface with the Express server on Port 8001 as seen in `src/components/ActionModals.tsx`.
