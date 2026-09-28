import Tilt from "./Tilt";

function RepoList({ repos }) {
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  if (topRepos.length === 0) {
    return <p className="status-message">No public repositories found.</p>;
  }

  return (
    <div className="repo-list">
      <h3>Repositories</h3>
      <div className="repo-grid">
        {topRepos.map((repo) => (
          <Tilt
            as="a"
            className="repo-card"
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            max={6}
            key={repo.id}
          >
            <h4>{repo.name}</h4>
            <p>{repo.description || "No description"}</p>
            <div className="repo-meta">
              <span>{repo.language || "—"}</span>
              <span>⭐ {repo.stargazers_count}</span>
            </div>
          </Tilt>
        ))}
      </div>
    </div>
  );
}

export default RepoList;