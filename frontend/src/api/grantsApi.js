import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Adjust the port if necessary

/**
 * Fetch grants from both databases with specified filters.
 * @param {string} searchTerm - Keyword to search in title and description fields.
 * @param {number} limit - Number of results per page.
 * @param {number} offset - Pagination offset.
 * @param {string} region - Region filter.
 * @param {string} eligibility - Eligibility filter.
 * @param {string} state - State filter.
 * @param {string} source - Source filter ('federal' or 'private').
 * @returns {Promise<Object>} - Response containing grants and total results.
 */
export const fetchGrants = async (
  searchTerm = "",
  limit = 10,
  offset = 0,
  region = "",
  eligibility = "",
  state = "",
  source = ""  
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grants`, {
      params: {
        search_term: searchTerm,
        limit,
        offset,
        region,
        eligibility,
        state,
        source,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching grants:", error);
    throw error;
  }
};

/**
 * Fetch details of a single grant by ID from the specified source.
 * @param {number} grantId - ID of the grant.
 * @param {string} source - Source of the grant ('federal' or 'private').
 * @returns {Promise<Object>} - Response containing grant details.
 * @throws {Error} - If the grant cannot be found or if there's an API error.
 */
export const fetchGrantById = async (grantId, source) => {
  if (!source) {
    throw new Error("Source is required to fetch grant details");
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/grants/${source}/${grantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching grant by ID:", error);
    throw error;
  }
};