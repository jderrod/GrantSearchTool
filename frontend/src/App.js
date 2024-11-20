import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";

const App = () => {
    const [results, setResults] = useState([]);

    const handleSearch = async (query) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/grants");
            const data = await response.json();

            // Filter results based on the query
            const filteredResults = data.filter((grant) =>
                grant.title.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filteredResults);
        } catch (error) {
            console.error("Error fetching grants:", error);
        }
    };

    return (
        <div>
            <h1>Grant Search Tool</h1>
            <SearchBar onSearch={handleSearch} />
            <ResultsList results={results} />
        </div>
    );
};

export default App;
