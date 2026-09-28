# DevPulse

Live GitHub analytics dashboard. Enter a username and get profile stats, a language breakdown and top repositories, pulled from the GitHub REST API.

**Live:** https://devpulse-zeta-five.vercel.app

## What it does

- Fetches a public GitHub profile and its repository list in parallel
- Shows followers, following and public repository count
- Ranks primary languages across the user's repositories
- Lists the six most-starred repositories with description, language and star count
- Tells an unknown username (404) apart from an API rate limit (403) and reports which one occurred

Only public, unauthenticated endpoints are used. No accounts, no tokens, no backend.

## Interface

- Full-screen canvas background: dots drift, link to nearby dots, and connect to the cursor. Clicking empty space adds dots (capped)
- Cards tilt toward the cursor with a light glare
- Skeleton placeholder while data loads
- Keyboard shortcut: `/` focuses the search box
- Two-column results layout on desktop, single column below 900px
- Featured developers on the front page load avatars from `github.com/<user>.png`, which does not count against the API rate limit

## Decisions

**Parallel requests.** The profile and repository list are independent. `Promise.all` makes load time equal to the slower request, not the sum of both.

**Stale responses are discarded.** Each fetch runs inside an effect with a `cancelled` flag set on cleanup. A slow response for an old search cannot overwrite the result of a newer one.

**Partial failure degrades.** If the profile loads but the repository request fails, the page renders the profile with an empty repository list instead of crashing.

**No charting library.** The language breakdown is horizontal bars with a percentage. A `div` with a CSS `width` does that at zero bundle cost.

**No particle library.** The background is one file using the Canvas 2D API. Dot count scales with viewport area and is capped at 150.

**Tilt without re-renders.** Mouse movement writes CSS custom properties directly to the element through a ref. React never re-renders on `mousemove`.

**Reduced motion is honoured.** With `prefers-reduced-motion: reduce`, the canvas draws one static frame, tilt and animations are disabled, and the mouse listeners are not attached.

**Two runtime dependencies.** `react` and `react-dom`. No state library, no CSS framework, no router.

## Known limits

- **Rate limit:** the unauthenticated API allows 60 requests per hour per IP. Each search uses 2 requests, so roughly 30 searches per hour.
- **First 100 repositories only.** There is no pagination. For users with more than 100 public repositories, the language breakdown and top repositories are computed from the first 100 the API returns.
- **Language share is by repository count**, using each repository's primary language. It is not measured in bytes or lines of code.
- **Forks are included** in the repository list and language counts.
- **No caching.** Every search hits the API again.
- **No automated tests.**
- **Cursor effects need a mouse.** On touch devices the background animates, but tilt and cursor links do nothing.

## Stack

React (Vite) · JavaScript · plain CSS (Grid, Flexbox, custom properties) · Canvas 2D · GitHub REST API · Vercel

## Structure

```
src/
├── components/
│   ├── Constellation.jsx   canvas background
│   ├── SearchBar.jsx       input and "/" shortcut
│   ├── ProfileCard.jsx     avatar, bio, stats
│   ├── LanguageChart.jsx   language ranking
│   ├── RepoList.jsx        top repositories
│   └── Tilt.jsx            reusable tilt wrapper
├── App.jsx                 state, data fetching, layout
├── App.css
├── index.css
└── main.jsx
```

## Run locally

Requires Node.js 22 (developed on 22.18).

```bash
git clone https://github.com/YugendharD/devpulse.git
cd devpulse
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deployment

Hosted on Vercel and connected to the `main` branch. Every push to `main` redeploys automatically.

## Contact

- Email: yugendhardommaraju06@gmail.com
- LinkedIn: https://www.linkedin.com/in/yugendhar-dommaraju-15b051327/
- Portfolio: https://yugendhard.github.io/portfolio/