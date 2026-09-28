import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import Tilt from "./components/Tilt";
import "./App.css";

const FEATURES = [
  {
    title: "Profile",
    text: "Followers, following and public repo count at a glance.",
  },
  {
    title: "Languages",
    text: "The language mix across all of their public repositories.",
  },
  {
    title: "Repositories",
    text: "Their most-starred projects, linked straight to GitHub.",
  },
];

function App() {
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function handleMove(event) {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      appRef.current?.style.setProperty("--px", x.toFixed(3));
      appRef.current?.style.setProperty("--py", y.toFixed(3));
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    if (!username) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setProfile(null);
      setRepos([]);

      try {
        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`),
        ]);

        if (profileRes.status === 403) {
          throw new Error(
            "GitHub API rate limit reached. Please try again in a few minutes."
          );
        }

        if (!profileRes.ok) {
          throw new Error("User not found");
        }

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        setProfile(profileData);
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  function handleSearch(searchedUsername) {
    setUsername(searchedUsername);
  }

  return (
    <div className="app" ref={appRef}>
      <header className="app-header">
        <div className="orb" aria-hidden="true">
          <div className="orb-core"></div>
          <div className="orb-ring orb-ring-1"></div>
          <div className="orb-ring orb-ring-2"></div>
          <div className="orb-ring orb-ring-3"></div>
        </div>

        <span className="badge">Live data from the GitHub API</span>
        <h1>DevPulse</h1>
        <p>Live GitHub analytics for any developer</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {!username && (
        <div className="empty-state">
          <p className="chips-label">
            Try a developer, or press <kbd>/</kbd> to search:
          </p>
          <div className="example-chips">
            {["torvalds", "gaearon", "yyx990803"].map((name) => (
              <button key={name} onClick={() => handleSearch(name)}>
                {name}
              </button>
            ))}
          </div>

          <div className="feature-grid">
            {FEATURES.map((feature) => (
              <Tilt className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </Tilt>
            ))}
          </div>
        </div>
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
      {error && <p className="status-message error">{error}</p>}

      {profile && (
        <>
          <ProfileCard profile={profile} />
          <LanguageChart repos={repos} />
          <RepoList repos={repos} />
        </>
      )}
    </div>
  );
}

export default App;