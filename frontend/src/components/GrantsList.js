import React, { useState } from "react";
import { fetchGrants } from "../api/grantsApi";

const GrantsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [region, setRegion] = useState(""); // Region filter
    const [state, setState] = useState(""); // State filter
    const [eligibility, setEligibility] = useState(""); // Eligibility filter
    const [grants, setGrants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const resultsPerPage = 10;

    const regions = ["All", "USA", "Europe", "Asia", "Africa"]; // Example regions
    const eligibilities = [
        "All",
        "Nonprofit organizations",
        "Educational institutions",
        "Individuals",
        "Small businesses",
    ]; // Example eligibilities

    const handleSearch = async (page = 1, resetPage = false) => {
        try {
            const offset = (resetPage ? 0 : (page - 1)) * resultsPerPage;
            const selectedRegion = region === "All" ? "" : region;
            const selectedEligibility = eligibility === "All" ? "" : eligibility;

            const data = await fetchGrants(
                searchTerm,
                resultsPerPage,
                offset,
                selectedRegion,
                selectedEligibility,
                state
            );

            setGrants(data.grants);
            setTotalResults(data.total_results);

            // Reset the page number only if it's a new search
            if (resetPage) {
                setCurrentPage(1);
            } else {
                setCurrentPage(page);
            }
        } catch (error) {
            console.error("Error fetching grants:", error);
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
                    <option value="">All Regions</option>
                    {regions.map((reg) => (
                        <option key={reg} value={reg}>
                            {reg}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="form-control"
                    placeholder="Enter state (e.g., California)"
                />
            </div>
            <div className="mb-3">
                <select
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="form-select"
                >
                    {eligibilities.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={() => handleSearch(1, true)}
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
                                    <strong>Geographic Scope:</strong>{" "}
                                    {grant.geographic_scope || "N/A"}
                                </p>
                                <p>
                                    <strong>Eligibility:</strong>{" "}
                                    {grant.eligibility || "N/A"}
                                </p>
                                <p>
                                    <strong>Application Guidelines:</strong>{" "}
                                    {grant.application_guidelines || "Not specified"}
                                </p>
                                <a
                                    href={grant.application_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Apply Here
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                            onClick={() => handleSearch(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handleSearch(currentPage + 1)}
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
