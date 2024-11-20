import React, { useState } from "react";
import { fetchGrants } from "../api/grantsApi";

const GrantsList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [grants, setGrants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const resultsPerPage = 10;

    const handleSearch = async (page = 1) => {
        try {
            const offset = (page - 1) * resultsPerPage;
            const data = await fetchGrants(searchTerm, resultsPerPage, offset);
            setGrants(data.grants);
            setTotalResults(data.total_results);
            setCurrentPage(page);
            console.log("Grants state updated:", data.grants);
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
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search term"
                    className="form-control mb-3"
                />
                <button onClick={() => handleSearch(1)} className="btn btn-primary">
                    Search
                </button>
            </div>
            <h2 className="mb-4">Search Results</h2>
            {grants.length > 0 ? (
                <>
                    <div className="row">
                        {grants.map((grant, index) => (
                            <div className="col-md-6 mb-4" key={index}>
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-primary">{grant.grantee}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">
                                            {grant.region_served}
                                        </h6>
                                        <p className="card-text">
                                            <strong>Purpose:</strong> {grant.purpose}
                                        </p>
                                        <p className="card-text">
                                            <strong>Amount:</strong> $
                                            {grant.amount_committed.toLocaleString()}
                                        </p>
                                        <p className="card-text">
                                            <strong>Date Committed:</strong> {grant.date_committed}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="btn btn-outline-secondary"
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="btn btn-outline-secondary"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-muted">No grants found.</p>
            )}
        </div>
    );
};

export default GrantsList;
