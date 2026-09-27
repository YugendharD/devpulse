import { useState } from "react";

function SearchBar({ onSearch }) {
  const [username, setUsername] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (username.trim() !== "") {
      onSearch(username.trim());
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a GitHub username..."
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;