import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/grants";

export const fetchGrants = async (searchTerm, limit = 10, offset = 0, region = "") => {
    const response = await fetch(
        `http://127.0.0.1:5000/api/grants?search_term=${searchTerm}&limit=${limit}&offset=${offset}&region=${region}`
    );
    const data = await response.json();
    return data;
};




  
