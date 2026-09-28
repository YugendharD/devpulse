import { useState, useRef, useEffect } from "react";

function SearchBar({ onSearch }) {
  const [username, setUsername] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    function handleKey(event) {
      const tag = document.activeElement?.tagName;
      if (event.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (username.trim() !== "") {
      onSearch(username.trim());
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
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