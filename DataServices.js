// DataService.js
import axios from 'axios';

const getToken = async () => {
    try {
        const response = await axios.post('http://localhost:20000/token', {});
        return response.data.token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const getData = async (token) => {
    try {
        const response = await axios.patch('http://localhost:20000/data', {}, {
            headers: {
                'Authorization':` Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export { getToken, getData };