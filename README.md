# SquadUp

SquadUp is a responsive trip-planning app for organizing travel with friends. It brings trip groups, places to visit, itineraries, tasks, packing lists, expenses, and memories into one workspace.

> **Project status:** The interface and authentication flow are implemented. Most trip-planning content is currently sample data or saved only in the current browser; it is not yet a shared, multi-user trip database.

## Features

- Responsive dashboard and navigation designed for desktop and mobile.
- Email/password and Google sign-in through Supabase Auth.
- Profile name, email, default currency, and notification preference controls.
- Light and dark themes, with the selected theme remembered in browser storage.
- Trip dashboard with overview cards, trip counts, planned trips, and previous-trip examples.
- Interactive destination map using Leaflet and OpenStreetMap tiles, with visited/planned filters and selectable destination pins.
- Group workspace with overview, member examples, places, itinerary, tasks, checklist, expenses, settlement, and memories sections.
- Personal and group packing checklists, including item completion and member assignment controls.
- Place suggestions, sample itinerary activities, task boards, expense summaries, settlement examples, and memory cards.
- Header notifications entry point and profile menu.
- SquadUp logo, browser favicon, and Apple touch icon.

## Technology stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript (strict mode) |
| Styling | Tailwind CSS 4 and application-specific CSS |
| Authentication | Supabase Auth with `@supabase/ssr` and `@supabase/supabase-js` |
| Map | Leaflet 1.9, React Leaflet 5, OpenStreetMap tile service |
| Icons | Lucide React |
| Utilities | `clsx`, `tailwind-merge`, and `date-fns` |
| Code quality | ESLint 9 and TypeScript |

## Pages and app sections

### Routes

| Route | Purpose |
|---|---|
| `/` | Public landing page introducing SquadUp and linking to sign-in. |
| `/auth` | Create-account and sign-in experience, including Google OAuth and email/password. |
| `/auth/callback` | Server route that exchanges the Supabase OAuth code for a session. |
| `/welcome` | Onboarding flow for a new or returning user. |
| `/home` | Authenticated application shell and trip-planning workspace. Redirects unauthenticated visitors to `/auth`. |

### Sections in the `/home` workspace

- **Home:** Overview, Trips, Places, Tasks, and Expenses tabs. Trips includes taken/planned counts, sample trip cards, and the interactive destination map.
- **Groups:** Group list and create-group flow. A group opens a workspace with its own section navigation.
- **Group workspace:** Overview, Places, Itinerary, Tasks, Checklist, Expenses, Settlement, and Memories.
- **Discover:** Suggested places and a form for adding a suggestion.
- **Checklist:** Personal or group packing list, item completion, and assignment/member controls.
- **Tasks:** Sample tasks and task-board UI.
- **Itinerary:** Day-based trip schedule and activity creation UI.
- **Expenses:** Expense overview and category breakdown.
- **Settlement:** Example balances and repayment summary.
- **Memories:** Trip memory cards and photo-upload UI.
- **Notifications:** Updates list, opened from the bell in the header.
- **Profile & Settings:** Profile editing, default currency, notification preference, and sign out.

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version.
- npm.
- A Supabase project for sign-in and protected `/home` access.

### Install dependencies

```powershell
npm install
```

### Configure Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` in the project root.
3. In **Project Settings → API**, set the project URL and publishable key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

4. In Supabase **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to the redirect URLs.
5. To use Google sign-in, enable the Google provider under **Authentication → Providers → Google**. Set Google Cloud's authorized redirect URI to the callback URL shown by Supabase. Keep the Google OAuth client secret in Supabase; do not put it in a `NEXT_PUBLIC_` variable.
6. Configure email confirmation and SMTP in Supabase as needed. Supabase's default email service may only deliver to project-authorized addresses during development.
7. Restart the dev server after changing environment variables.

Never commit `.env.local`, Supabase service-role keys, OAuth client secrets, or other credentials. The repository ignores `.env*` files other than `.env.example`.

### Run locally

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Other scripts:

```powershell
npm run lint
npm run build
npm run start
```

## Data and integration status

- **Persisted with Supabase:** Authentication session and user profile/onboarding metadata, including profile name and preferences.
- **Saved in the current browser:** Personal/group checklist items, group checklist member names, checklist assignments, and selected theme. Browser-local content does not sync to another device or another group member.
- **Sample UI data:** Trips, group membership, trip places, itinerary activities, tasks, expenses, settlements, memories, and notifications. These examples are not yet backed by shared trip tables.
- **Map:** The map is interactive, but its destination pins use sample place coordinates. OpenStreetMap tiles require an internet connection. Follow the selected tile provider's attribution, usage policy, and capacity limits before deploying to production.
- **Live location:** Member location sharing is not implemented.

## Roadmap and future enhancements

The following are planned possibilities, not currently implemented features:

1. **Shared trip backend:** Design Supabase tables and row-level security for groups, memberships, destinations, itineraries, tasks, checklists, expenses, and memories so authorized group members can collaborate across devices.
2. **Real trip map data:** Store destination coordinates with trips, add places from the map, and show each group's visited and planned destinations instead of sample pins.
3. **Consent-based live location sharing:** Let each traveler explicitly start and stop sharing, show sharing status and duration, restrict access to trip members, and delete or expire location data automatically. Never enable location sharing by default.
4. **Invitations and notifications:** Send group invites and provide real notifications for trip changes, assignments, and expenses.
5. **Expense workflows:** Add real expense entry, receipt attachments, currency conversion, and clear settlement/repayment tracking.
6. **Trip memories:** Upload and share photos in a trip gallery with appropriate storage permissions.
7. **Group party games:** Add optional in-trip games such as **Imposter** and **Dumb Charades**, including room setup, private prompts/roles, turn management, and group voting.
8. **Production readiness:** Add automated tests, accessibility checks, error/empty states, and a production-ready map tile provider.

## Project structure

```text
app/
  auth/                  Sign-in and sign-up
  auth/callback/         Supabase OAuth callback
  components/            Shared UI components, including the interactive map
  home/                  Authenticated home route
  welcome/               Onboarding route
  globals.css            Global styles and responsive layouts
  layout.tsx             Root layout and page metadata
  page.tsx               Landing UI and application workspace components
lib/
  supabase/              Supabase browser/server clients and configuration
  design-tokens.ts       Shared design tokens
  utils.ts               Shared utility functions
public/                  Logo and public static assets
```
