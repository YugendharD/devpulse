function LanguageChart({ repos }) {
  const languageCounts = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(languageCounts).reduce((sum, count) => sum + count, 0);

  const languages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (languages.length === 0) {
    return null;
  }

  return (
    <div className="language-chart">
      <h3>Top Languages</h3>
      {languages.map(([language, count]) => {
        const percent = Math.round((count / total) * 100);
        return (
          <div className="language-row" key={language}>
            <div className="language-label">
              <span>{language}</span>
              <span>{percent}%</span>
            </div>
            <div className="language-bar-bg">
              <div className="language-bar-fill" style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LanguageChart;