import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: "center", marginTop: "20px" }}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search grants..."
                style={{ width: "300px", padding: "10px" }}
            />
            <button type="submit" style={{ marginLeft: "10px", padding: "10px 20px" }}>
                Search
            </button>
        </form>
    );
};

export default SearchBar;
