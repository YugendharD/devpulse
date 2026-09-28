
import { useState, useEffect } from "react";

import Constellation from "./components/Constellation";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import Tilt from "./components/Tilt";

import "./App.css";

const REPO_URL = "https://github.com/YugendharD/devpulse";
const PORTFOLIO_URL = "https://yugendhard.github.io/portfolio/";

const FEATURED = [
  {
    user: "torvalds",
    name: "Linus Torvalds",
    note: "Creator of Linux and Git",
  },
  {
    user: "gaearon",
    name: "Dan Abramov",
    note: "Co-creator of Redux",
  },
  {
    user: "yyx990803",
    name: "Evan You",
    note: "Creator of Vue and Vite",
  },
  {
    user: "sindresorhus",
    name: "Sindre Sorhus",
    note: "Prolific npm package author",
  },
  {
    user: "tj",
    name: "TJ Holowaychuk",
    note: "Creator of Express",
  },
  {
    user: "addyosmani",
    name: "Addy Osmani",
    note: "Chrome and web performance",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Search",
    text: "Type any public GitHub username, or pick a developer above.",
  },
  {
    number: "02",
    title: "Fetch live",
    text: "The profile and repository list are requested from the GitHub API in parallel.",
  },
  {
    number: "03",
    title: "Explore",
    text: "See followers, the language mix and the most-starred repositories in one dashboard.",
  },
];

function App() {
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setProfile(null);
      setRepos([]);

      try {
        const safeUsername = encodeURIComponent(username);

        const [profileRes, reposRes] = await Promise.all([
          fetch(
            `https://api.github.com/users/${safeUsername}`
          ),
          fetch(
            `https://api.github.com/users/${safeUsername}/repos?per_page=100`
          ),
        ]);

        if (
          profileRes.status === 403 ||
          reposRes.status === 403
        ) {
          throw new Error(
            "GitHub API rate limit reached. Please try again in a few minutes."
          );
        }

        if (profileRes.status === 404) {
          throw new Error(
            "User not found. Please check the GitHub username."
          );
        }

        if (!profileRes.ok) {
          throw new Error(
            "Unable to fetch the GitHub profile."
          );
        }

        if (!reposRes.ok) {
          throw new Error(
            "Unable to fetch GitHub repositories."
          );
        }

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        if (cancelled) return;

        setProfile(profileData);
        setRepos(
          Array.isArray(reposData) ? reposData : []
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [username]);

  function handleSearch(searchedUsername) {
    const cleanUsername = searchedUsername.trim();

    if (!cleanUsername) return;

    setUsername(cleanUsername);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleHome() {
    setUsername(null);
    setProfile(null);
    setRepos([]);
    setError(null);
    setLoading(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <Constellation />

      <div className="app">
        <nav className="topbar">
          <button
            className="brand"
            type="button"
            onClick={handleHome}
          >
            <span className="brand-dot"></span>
            DevPulse
          </button>

          <div className="topbar-links">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>

            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          </div>
        </nav>

        <main className="main">
          <section
            className={`hero ${username ? "compact" : ""}`}
          >
            <span className="badge">
              Live data from the GitHub API
            </span>

            <h1>DevPulse</h1>

            <p className="hero-sub">
              Live GitHub analytics for any developer
            </p>

            <SearchBar onSearch={handleSearch} />

            <p className="hint">
              Press <kbd>/</kbd> to focus the search box
            </p>

            {error && (
              <p className="status-message error">
                {error}
              </p>
            )}
          </section>

          {!username && (
            <>
              <section className="section">
                <div className="section-label">
                  <span>01</span>
                  <span>Explore a developer</span>
                </div>

                <div className="dev-grid">
                  {FEATURED.map((dev) => (
                    <Tilt
                      as="button"
                      type="button"
                      className="dev-card"
                      key={dev.user}
                      max={6}
                      onClick={() =>
                        handleSearch(dev.user)
                      }
                    >
                      <img
                        className="dev-avatar"
                        src={`https://github.com/${dev.user}.png?size=96`}
                        alt={`${dev.name} GitHub avatar`}
                        width="52"
                        height="52"
                        loading="lazy"
                      />

                      <div className="dev-text">
                        <strong>{dev.name}</strong>
                        <span>@{dev.user}</span>
                        <em>{dev.note}</em>
                      </div>
                    </Tilt>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-label">
                  <span>02</span>
                  <span>How it works</span>
                </div>

                <div className="steps">
                  {STEPS.map((step) => (
                    <Tilt
                      className="step"
                      key={step.number}
                      max={5}
                    >
                      <span className="step-number">
                        {step.number}
                      </span>

                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </Tilt>
                  ))}
                </div>
              </section>
            </>
          )}

          {loading && (
            <div className="skeleton-card">
              <div className="skeleton-avatar"></div>

              <div className="skeleton-line skeleton-title"></div>

              <div className="skeleton-line skeleton-subtitle"></div>

              <div className="skeleton-stats">
                <div className="skeleton-line skeleton-stat"></div>
                <div className="skeleton-line skeleton-stat"></div>
                <div className="skeleton-line skeleton-stat"></div>
              </div>
            </div>
          )}

          {profile && (
            <div className="results">
              <aside className="results-side">
                <ProfileCard profile={profile} />
                <LanguageChart repos={repos} />
              </aside>

              <section className="results-main">
                <RepoList repos={repos} />
              </section>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>
            Built by Yugendhar Dommaraju · React + Vite ·
            GitHub REST API
          </p>

          <p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Source code
            </a>

            {" · "}

            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;