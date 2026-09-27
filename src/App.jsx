import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import "./App.css";

function App() {
  const [username, setUsername] = useState(null);
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="app">
      <header className="app-header">
        <h1>DevPulse</h1>
        <p>Live GitHub analytics for any developer</p>
      </header>

      <SearchBar onSearch={handleSearch} />

      {loading && <p className="status-message">Loading...</p>}
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