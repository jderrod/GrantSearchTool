const API_URL = "http://127.0.0.1:5000/api/grants";

// Fetch grants with optional search term, limit, offset, and region
export const fetchGrants = async (searchTerm, limit = 10, offset = 0, region = "", eligibility = "") => {
    const params = new URLSearchParams({
        search_term: searchTerm,
        limit: limit.toString(),
        offset: offset.toString(),
        region: region,
        eligibility: eligibility,
    });

    const response = await fetch(`http://127.0.0.1:5000/api/grants?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Failed to fetch grants");
    }
    return await response.json();
};


// Fetch details for a specific grant by ID (optional for a detailed page)
export const fetchGrantById = async (grantId) => {
    try {
        const response = await fetch(`${API_URL}/${grantId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch grant with ID ${grantId}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching grant by ID:", error);
        throw error;
    }
};
