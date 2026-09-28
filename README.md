# DevPulse — Live GitHub Analytics Dashboard

**Live:** [devpulse-zeta-five.vercel.app](https://devpulse-zeta-five.vercel.app)

Enter any GitHub username and get a real-time dashboard of their public developer activity: profile stats, language breakdown, and top repositories, all pulled live from GitHub's REST API.

## What it does

- **Live profile lookup** — avatar, bio, followers/following/repo counts, fetched on demand for any public GitHub user
- **Language breakdown** — aggregates every public repo's primary language into a ranked percentage bar chart, computed client-side from raw API data
- **Top repositories** — the user's most-starred repos with description, language, and star count, linking directly to GitHub
- **Skeleton loading state** — a shimmer placeholder matching the real layout, instead of a spinner or blank gap
- **Failure handling** — tells a nonexistent username (404) apart from GitHub's API rate limit (403) and shows an accurate message for each
- **Responsive** down to 375px width

## Why no charting library

The language breakdown is a handful of horizontal bars with a percentage label. A `<div>` with a CSS `width` per language does this with zero added bundle size. A charting library pays off for complex visualizations (multi-axis, interactive tooltips, animated transitions); this isn't that, so it isn't used.

## Why `Promise.all`

The profile and repo list are two independent API calls. Fetching them one after the other means waiting for both round-trips end to end. `Promise.all` fires both at once, so load time is bounded by the slower request, not the sum of both.

## A known constraint

GitHub's unauthenticated REST API allows 60 requests/hour per IP. The app detects a 403 response specifically and shows a clear message instead of a generic failure. An authenticated version would raise the limit to 5,000/hour, but it needs a backend to keep the token private, which is outside the scope of this frontend project.

## Stack

`React` (Vite) · vanilla `CSS` (Grid, Flexbox, custom properties) · GitHub REST API

## Structure

```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── ProfileCard.jsx
│   ├── LanguageChart.jsx
│   └── RepoList.jsx
├── App.jsx
├── App.css
└── index.css
```

## Running locally

```bash
git clone https://github.com/YugendharD/devpulse.git
cd devpulse
npm install
npm run dev
```

## Contact

- **Email:** yugendhardommaraju06@gmail.com
- **LinkedIn:** [yugendhar-dommaraju](https://www.linkedin.com/in/yugendhar-dommaraju-15b051327/)
- **Portfolio:** [yugendhard.github.io/portfolio](https://yugendhard.github.io/portfolio/)