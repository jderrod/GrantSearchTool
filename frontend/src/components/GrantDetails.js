import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGrantById } from "../api/grantsApi";
import SaveGrantButton from './SaveGrantButton';

const GrantDetails = () => {
    const { grantId, source } = useParams();  // Get both grantId and source from URL
    const navigate = useNavigate();
    const [grant, setGrant] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGrantDetails = async () => {
            try {
                // Try to get source from URL params first
                let grantSource = source;
                
                // If source isn't in URL, try to get it from localStorage
                if (!grantSource) {
                    const searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
                    const savedGrant = searchResults.find(g => g.id === parseInt(grantId));
                    grantSource = savedGrant?.source || 'federal'; // Default to federal if not found
                }

                const data = await fetchGrantById(grantId, grantSource);
                setGrant(data);
            } catch (err) {
                setError("Failed to load grant details.");
                console.error("Error loading grant details:", err);
            }
        };
        loadGrantDetails();
    }, [grantId, source]);

    const handleBack = () => navigate(-1);

    const getValue = (key) => {
        if (!grant) return 'N/A';
        
        switch(key) {
            case 'funder_name':
                return grant.funder_name || grant.title || 'N/A';
            case 'deadlines':
                return grant.deadlines || grant.closing_date || 'N/A';
            case 'website':
                return grant.website || grant.submission_url || 'N/A';
            case 'application_website':
                return grant.application_website || grant.submission_url || 'N/A';
            case 'funding_amount':
                // Handle funding amount based on source
                if (grant.source === 'federal') {
                    return grant.funding_amount || 'N/A';
                } else if (grant.source === 'private') {
                    return grant.total_annual_giving || 'N/A';
                }
                return 'N/A';
            default:
                return grant[key] || 'N/A';
        }
    };

    if (error) {
        return (
            <div className="max-w-5xl mx-auto mt-4 px-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!grant) {
        return (
            <div className="max-w-5xl mx-auto mt-4 px-4">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <button 
                    onClick={handleBack}
                    style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        paddingTop: '6px',
                        paddingBottom: '6px'
                    }}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                >
                    <svg 
                        style={{ width: '8px', height: '8px' }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span className="ml-2">Back to Results</span>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', height: '32px' }}>
                    <SaveGrantButton grant={grant} />
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Title Section */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900 mb-3">
                        {getValue("funder_name")}
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">{getValue("description")}</p>
                </div>

                {/* Quick Info Section */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 mb-1">
                                {grant.source === 'private' ? 'Total Annual Giving' : 'Funding Amount'}
                            </h3>
                            <p className="text-sm font-medium text-gray-900">
                                {getValue("funding_amount")}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-500 mb-1">Deadline</h3>
                            <p className="text-sm font-medium text-gray-900">
                                {getValue("deadlines")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rest of the component remains the same... */}
                {/* Main Details */}
                <div className="p-4">
                    <div className="space-y-4">
                        {/* Eligibility Section */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">Eligibility</h2>
                            <p className="text-sm text-gray-600">{getValue("eligibility")}</p>
                        </div>

                        {/* Geographic Scope */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">Geographic Scope</h2>
                            <p className="text-sm text-gray-600">{getValue("geographic_scope")}</p>
                        </div>

                        {/* Application Guidelines */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">Application Guidelines</h2>
                            <p className="text-sm text-gray-600">{getValue("application_guidelines")}</p>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h2>
                            <div className="space-y-1">
                                {getValue("email") !== 'N/A' && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Email: </span>
                                        <a href={`mailto:${getValue("email")}`} className="text-blue-600 hover:underline">
                                            {getValue("email")}
                                        </a>
                                    </p>
                                )}
                                {getValue("phone") !== 'N/A' && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Phone: </span>
                                        {getValue("phone")}
                                    </p>
                                )}
                                {getValue("website") !== 'N/A' && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Website: </span>
                                        <a 
                                            href={getValue("website")} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline"
                                        >
                                            {getValue("website")}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-end">
                        <a 
                            href={getValue("application_website")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrantDetails;