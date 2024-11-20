import React from "react";

const ResultsList = ({ results }) => {
    return (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h2>Search Results</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {results.map((result, index) => (
                    <li key={index} style={{ margin: "10px 0", padding: "10px", background: "#fff", border: "1px solid #ddd" }}>
                        <strong>{result.title}</strong>
                        <p>{result.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResultsList;
