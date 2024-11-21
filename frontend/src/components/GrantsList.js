import React, { useState } from "react";
import { fetchGrants } from "../api/grantsApi";

const GrantsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [region, setRegion] = useState(""); // State for the region filter
    const [grants, setGrants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const resultsPerPage = 10;

    const regions = ["All", "USA", "Europe", "Africa", "Asia", "Oceania"]; // Example regions

    const handleSearch = async (page = 1) => {
        try {
            const offset = (page - 1) * resultsPerPage;
            const selectedRegion = region === "All" ? "" : region;
            const data = await fetchGrants(searchTerm, resultsPerPage, offset, selectedRegion);
            setGrants(data.grants);
            setTotalResults(data.total_results);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching grants:", error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
            handleSearch(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handleSearch(currentPage - 1);
        }
    };

    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Grant Search Tool</h1>
            <div className="mb-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    placeholder="Enter search term"
                />
            </div>
            <div className="mb-3">
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="form-select"
                >
                    {regions.map((reg) => (
                        <option key={reg} value={reg}>
                            {reg}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={() => handleSearch(1)}
                className="btn btn-primary mb-4"
            >
                Search
            </button>
            <h2>Search Results</h2>
            {grants.length > 0 ? (
                <>
                    <ul className="list-group mb-3">
                        {grants.map((grant, index) => (
                            <li key={index} className="list-group-item">
                                <h5>{grant.funder_name}</h5>
                                <p>{grant.description}</p>
                                <p>
                                    <strong>Geographic Scope:</strong> {grant.geographic_scope || "N/A"}
                                </p>
                                <p>
                                    <strong>Application Procedures:</strong>{" "}
                                    {grant.app_procedures_text || "Not specified"}
                                </p>
                                <a
                                    href={grant.app_procedures_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Application Details
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-secondary"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p>No grants found.</p>
            )}
        </div>
    );
};

export default GrantsList;
