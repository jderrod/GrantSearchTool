import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/grants";

export const fetchGrants = async (searchTerm, limit = 10, offset = 0) => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/api/grants`, {
            params: { search_term: searchTerm, limit, offset },
        });
        return response.data; // Return the grants and total_results
    } catch (error) {
        console.error("Error in fetchGrants:", error);
        return { grants: [], total_results: 0 };
    }
};



  
