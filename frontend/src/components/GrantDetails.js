import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGrantById } from "../api/grantsApi";

const GrantDetails = () => {
    const { grantId } = useParams();
    const [grant, setGrant] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGrantDetails = async () => {
            try {
                const data = await fetchGrantById(grantId);
                setGrant(data);
            } catch (err) {
                setError("Failed to load grant details.");
                console.error("Error loading grant details:", err);
            }
        };

        loadGrantDetails();
    }, [grantId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!grant) {
        return <div>Loading grant details...</div>;
    }

    // Render all available fields dynamically
    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">
                {grant.funder_name || grant.title || "Grant Details"}
            </h1>
            <div className="card">
                <div className="card-body">
                    <div className="mb-3">
                        <strong>Description:</strong>
                        <p>{grant.description || "N/A"}</p>
                    </div>
                    {grant.website && (
                        <div className="mb-3">
                            <strong>Website:</strong>
                            <a href={grant.website} target="_blank" rel="noopener noreferrer">
                                {grant.website}
                            </a>
                        </div>
                    )}
                    {grant.geographic_scope && (
                        <div className="mb-3">
                            <strong>Geographic Scope:</strong>
                            <p>{grant.geographic_scope}</p>
                        </div>
                    )}
                    {grant.eligibility && (
                        <div className="mb-3">
                            <strong>Eligibility:</strong>
                            <p>{grant.eligibility}</p>
                        </div>
                    )}
                    {grant.deadlines && (
                        <div className="mb-3">
                            <strong>Deadlines:</strong>
                            <p>{grant.deadlines}</p>
                        </div>
                    )}
                    {grant.grantmaker_type && (
                        <div className="mb-3">
                            <strong>Grantmaker Type:</strong>
                            <p>{grant.grantmaker_type}</p>
                        </div>
                    )}
                    {grant.grants_history_link && (
                        <div className="mb-3">
                            <strong>Grants History Link:</strong>
                            <a
                                href={grant.grants_history_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {grant.grants_history_link}
                            </a>
                        </div>
                    )}
                    {grant.last_updated && (
                        <div className="mb-3">
                            <strong>Last Updated:</strong>
                            <p>{grant.last_updated}</p>
                        </div>
                    )}
                    {grant.address && (
                        <div className="mb-3">
                            <strong>Address:</strong>
                            <p>{grant.address}</p>
                        </div>
                    )}
                    {grant.email && (
                        <div className="mb-3">
                            <strong>Email:</strong>
                            <a href={`mailto:${grant.email}`}>{grant.email}</a>
                        </div>
                    )}
                    {grant.phone && (
                        <div className="mb-3">
                            <strong>Phone:</strong>
                            <p>{grant.phone}</p>
                        </div>
                    )}
                    {grant.primary_contact_name && (
                        <div className="mb-3">
                            <strong>Primary Contact Name:</strong>
                            <p>{grant.primary_contact_name}</p>
                        </div>
                    )}
                    {grant.primary_contact_title && (
                        <div className="mb-3">
                            <strong>Primary Contact Title:</strong>
                            <p>{grant.primary_contact_title}</p>
                        </div>
                    )}
                    {grant.primary_contact_email && (
                        <div className="mb-3">
                            <strong>Primary Contact Email:</strong>
                            <a href={`mailto:${grant.primary_contact_email}`}>
                                {grant.primary_contact_email}
                            </a>
                        </div>
                    )}
                    {grant.additional_contact_info && (
                        <div className="mb-3">
                            <strong>Additional Contact Info:</strong>
                            <p>{grant.additional_contact_info}</p>
                        </div>
                    )}
                    {grant.total_annual_giving && (
                        <div className="mb-3">
                            <strong>Total Annual Giving:</strong>
                            <p>{grant.total_annual_giving}</p>
                        </div>
                    )}
                    {grant.ein && (
                        <div className="mb-3">
                            <strong>Employer Identification Number (EIN):</strong>
                            <p>{grant.ein}</p>
                        </div>
                    )}
                    {grant.application_guidelines && (
                        <div className="mb-3">
                            <strong>Application Guidelines:</strong>
                            <p>{grant.application_guidelines}</p>
                        </div>
                    )}
                    {grant.application_website && (
                        <div className="mb-3">
                            <strong>Application Website:</strong>
                            <a
                                href={grant.application_website}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {grant.application_website}
                            </a>
                        </div>
                    )}
                    {grant.number && (
                        <div className="mb-3">
                            <strong>Grant Number:</strong>
                            <p>{grant.number}</p>
                        </div>
                    )}
                    {grant.agency && (
                        <div className="mb-3">
                            <strong>Agency:</strong>
                            <p>{grant.agency}</p>
                        </div>
                    )}
                    {grant.funding_amount && (
                        <div className="mb-3">
                            <strong>Funding Amount:</strong>
                            <p>{grant.funding_amount}</p>
                        </div>
                    )}
                    {grant.closing_date && (
                        <div className="mb-3">
                            <strong>Closing Date:</strong>
                            <p>{grant.closing_date}</p>
                        </div>
                    )}
                    {grant.submission_url && (
                        <div className="mb-3">
                            <strong>Submission URL:</strong>
                            <a
                                href={grant.submission_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {grant.submission_url}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GrantDetails;
