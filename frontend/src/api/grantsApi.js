import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log('API Base URL:', API_BASE_URL);

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
 * Tries both federal and private sources since the source isn't known beforehand.
 * @param {number} grantId - ID of the grant to retrieve.
 * @returns {Promise<Object>} - Response containing grant details from either federal or private source.
 */
export const fetchGrantById = async (grantId) => {
  try {
    console.log('Fetching grant details for ID:', grantId);
    
    // Try federal source first
    try {
      const federalResponse = await axios.get(`${API_BASE_URL}/grants/federal/${grantId}`);
      console.log('Federal grant details response:', federalResponse.data);
      return federalResponse.data;
    } catch (federalError) {
      console.log('Federal grant not found, trying private source');
      // If federal fails, try private source
      const privateResponse = await axios.get(`${API_BASE_URL}/grants/private/${grantId}`);
      console.log('Private grant details response:', privateResponse.data);
      return privateResponse.data;
    }
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