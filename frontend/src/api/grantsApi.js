import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log('API Base URL:', API_BASE_URL); // Log the base URL when the file loads

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
    console.log('Making API request to:', `${API_BASE_URL}/grants`);
    console.log('With params:', {
      search_term: searchTerm,
      limit,
      offset,
      region,
      eligibility,
      state,
      source,
    });

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
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      url: error?.config?.url,
      method: error?.config?.method,
      params: error?.config?.params
    });
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
    console.log('Fetching grant details for ID:', grantId);
    console.log('Making request to:', `${API_BASE_URL}/grants/${grantId}`);

    const response = await axios.get(`${API_BASE_URL}/grants/${grantId}`);
    console.log('Grant details response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching grant details:", {
      message: error.message,
      url: error?.config?.url,
      method: error?.config?.method,
      grantId
    });
    throw error;
  }
};