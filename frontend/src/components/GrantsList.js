import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchGrants } from "../api/grantsApi";
import SaveGrantButton from './SaveGrantButton';
import SavedFilters from './SavedFilters';

const GrantsList = () => {
    const location = useLocation();
    
    // State declarations
    const [searchTerm, setSearchTerm] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.searchTerm || ""
    );
    const [region, setRegion] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.region || ""
    );
    const [state, setState] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.state || ""
    );
    const [eligibility, setEligibility] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.eligibility || ""
    );
    const [grants, setGrants] = useState([]);
    const [currentPage, setCurrentPage] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.currentPage || 1
    );
    const [totalResults, setTotalResults] = useState(0);
    const [grantSource, setGrantSource] = useState(() => 
        JSON.parse(localStorage.getItem('lastSearchState'))?.grantSource || "All"
    );
    const resultsPerPage = 10;
    const [showSavedFilters, setShowSavedFilters] = useState(false);

    // Constants
    const regions = ["All", "USA", "Europe", "Asia", "Africa"];
    const eligibilities = [
        "All",
        "Nonprofit organizations",
        "Educational institutions",
        "Individuals",
        "Small businesses",
    ];

    // Scroll position effect
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollPosition / documentHeight) * 100;
            localStorage.setItem('grantsListScrollPosition', scrollPercentage.toString());
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after results load
    useEffect(() => {
        if (grants.length > 0) {
            setTimeout(() => {
                const savedScrollPercentage = parseFloat(localStorage.getItem('grantsListScrollPosition') || '0');
                const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPosition = (savedScrollPercentage / 100) * documentHeight;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'instant'
                });
            }, 100);
        }
    }, [grants]);

    // Load last search results if they exist
    useEffect(() => {
        const lastSearchState = JSON.parse(localStorage.getItem('lastSearchState'));
        if (lastSearchState) {
            handleSearch(lastSearchState.currentPage, false, lastSearchState);
        }
    }, []);

    const getCurrentFilters = () => ({
        searchTerm,
        region,
        state,
        eligibility,
        grantSource
    });

    const handleLoadFilters = (filters) => {
        setSearchTerm(filters.searchTerm || '');
        setRegion(filters.region || '');
        setState(filters.state || '');
        setEligibility(filters.eligibility || '');
        setGrantSource(filters.grantSource || 'All');
        
        handleSearch(1, true, filters);
    };

    const handleNextPage = () => {
        handleSearch(currentPage + 1, false, getCurrentFilters());
    };

    const handlePrevPage = () => {
        handleSearch(currentPage - 1, false, getCurrentFilters());
    };

    const handleSearch = async (page = 1, isNewSearch = true, filters = null) => {
        try {
            if (isNewSearch) {
                localStorage.removeItem('grantsListScrollPosition');
            }

            const offset = (page - 1) * resultsPerPage;
            const filtersToUse = filters || getCurrentFilters();
            
            const selectedRegion = filtersToUse.region === "All" ? "" : filtersToUse.region;
            const selectedEligibility = filtersToUse.eligibility === "All" ? "" : filtersToUse.eligibility;
            const selectedSource = filtersToUse.grantSource === "All" ? "" : filtersToUse.grantSource;

            const data = await fetchGrants(
                filtersToUse.searchTerm,
                resultsPerPage,
                offset,
                selectedRegion,
                selectedEligibility,
                filtersToUse.state,
                selectedSource
            );
            
            setGrants(data.grants);
            setTotalResults(data.total_results);

            const newPage = isNewSearch ? 1 : page;
            setCurrentPage(newPage);

            const searchState = {
                ...filtersToUse,
                currentPage: newPage,
                lastSearched: new Date().toISOString()
            };
            localStorage.setItem('lastSearchState', JSON.stringify(searchState));
            localStorage.setItem('searchResults', JSON.stringify(data.grants));
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
                    value={grantSource}
                    onChange={(e) => setGrantSource(e.target.value)}
                    className="form-select"
                >
                    <option value="All">All Sources</option>
                    <option value="federal">Federal Grants</option>
                    <option value="private">Private Grants</option>
                </select>
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
            <div className="d-flex gap-2 mb-4">
                <button
                    onClick={() => handleSearch(1, true)}
                    className="btn btn-primary"
                >
                    Search
                </button>
                <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowSavedFilters(prev => !prev)}
                >
                    {showSavedFilters ? 'Hide Saved Filters' : 'Show Saved Filters'}
                </button>
            </div>

            {showSavedFilters && (
                <SavedFilters
                    currentFilters={getCurrentFilters()}
                    onLoadFilter={handleLoadFilters}
                    className="mb-4"
                />
            )}
            
            <h2>Search Results</h2>
            {grants.length > 0 ? (
                <>
                    <div className="results-container">
                        {grants.map((grant, index) => (
                            <div
                                key={index}
                                className="grant-card mb-3 p-3 border rounded shadow-sm"
                            >
                                <Link to={`/grants/${grant.source}/${grant.id}`} className="grant-title-link">
                                    <h5 className="grant-title">{grant.funder_name}</h5>
                                </Link>
                                <p className="grant-description">
                                    {grant.description && grant.description.length > 600
                                        ? `${grant.description.slice(0, 600)}...`
                                        : grant.description || "No description available"}
                                </p>
                                <p>
                                    <strong>Geographic Scope:</strong>{" "}
                                    {grant.geographic_scope || "N/A"}
                                </p>
                                <p>
                                    <strong>Eligibility:</strong>{" "}
                                    {grant.eligibility && grant.eligibility.length > 150
                                        ? `${grant.eligibility.slice(0, 150)}...`
                                        : grant.eligibility || "N/A"}
                                </p>
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <a
                                        href={grant.application_website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        Apply Here
                                    </a>
                                    <SaveGrantButton grant={grant} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            onClick={handlePrevPage}
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
                            disabled={currentPage >= totalPages}
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