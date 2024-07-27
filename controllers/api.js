


// api.js

require('dotenv').config();
const axios = require('axios');
const Record = require('./recordModel');

// .env dosyasından değişkenleri yükle
const tokenUrl = process.env.TOKEN_URL;
const dataUrl = process.env.DATA_URL;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

// token alma
const getToken = async () => {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    try {
        const response = await axios.post(tokenUrl, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            }
        });
        return response.data.response.token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// veri çekme
const fetchData = async () => {
    const token = await getToken();
    if (!token) return;
    try {
        const response = await axios.patch(dataUrl, {
            fieldData: {},
            script: 'getData'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = JSON.parse(response.data.scriptResult);
        for (const item of data) {
            const existingRecord = await Record.findOne({ id: item.id });
            if (existingRecord) {
                await Record.updateOne({ id: item.id }, item);
            } else {
                const newRecord = new Record(item);
                await newRecord.save();
            }
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};

module.exports = {
    getToken,
    fetchData
};

const start = async () => {
    await fetchData();
}
