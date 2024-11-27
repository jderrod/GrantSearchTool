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
 * Fetch details of a single grant by ID.
 * @param {number} grantId - ID of the grant.
 * @returns {Promise<Object>} - Response containing grant details.
 */
export const fetchGrantById = async (grantId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grants/${grantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching grant by ID:", error);
    throw error;
  }
};
