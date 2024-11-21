import React, { useState } from "react";
import { fetchGrants } from "../api/grantsApi";

const GrantsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [region, setRegion] = useState(""); // Region filter
    const [eligibility, setEligibility] = useState(""); // Eligibility filter
    const [grants, setGrants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const resultsPerPage = 10;

    const eligibilities = [
        "Nonprofit organizations",
        "Educational institutions",
        "Individuals",
        "Small businesses",
    ]; // Example options

    const handleSearch = async (page = 1) => {
        try {
            const offset = (page - 1) * resultsPerPage;
            const data = await fetchGrants(searchTerm, resultsPerPage, offset, region, eligibility);
            setGrants(data.grants);
            setTotalResults(data.total_results);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching grants:", error);
        }
    };

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
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    className="form-select"
                >
                    <option value="">All Eligibilities</option>
                    {eligibilities.map((option) => (
                        <option key={option} value={option}>
                            {option}
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
                                    <strong>Eligibility:</strong> {grant.eligibility || "N/A"}
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>No grants found.</p>
            )}
        </div>
    );
};

export default GrantsList;
