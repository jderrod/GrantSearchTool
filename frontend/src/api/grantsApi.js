import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
console.log('API Base URL:', API_BASE_URL);

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
 * Fetch details of a single grant by ID and source.
 * @param {number} grantId - ID of the grant to retrieve.
 * @param {string} source - Source of the grant ('federal' or 'private').
 * @returns {Promise<Object>} - Response containing grant details.
 */
export const fetchGrantById = async (grantId, source) => {
  try {
    console.log('Fetching grant details for ID:', grantId, 'from source:', source);
    
    if (!source) {
      throw new Error('Source is required to fetch grant details');
    }

    const response = await axios.get(`${API_BASE_URL}/grants/${source}/${grantId}`);
    console.log('Grant details response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching grant details:", {
      message: error.message,
      url: error?.config?.url,
      method: error?.config?.method,
      grantId,
      source
    });
    throw error;
  }
};