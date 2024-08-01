const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
//const auth=require('./routes/auth.js')

// MongoDB bağlantısı
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://aleynanurustuner:codeley@cluster0.xyavjk3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};


// MongoDB Modeli

const recordSchema = new mongoose.Schema({
    hesapKodu: { type: String, required: true },
    toplamBorc: { type: Number, required: true }
});

const Record = mongoose.model('Record', recordSchema);

// Token alma fonksiyonu
const getToken = async () => {
    const url = 'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions';
    const auth = Buffer.from('apitest:test123').toString('base64'); // base64 düzeltildi

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}` // Template literal düzeltildi
            }
        });

        return response.data.response.token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

// Veri çekme ve veritabanına kaydetme fonksiyonu
const fetchData = async () => {
    const token = await getToken();
    if (!token) return;

    const url = 'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1';
    try {
        const response = await axios.patch(url, {
            fieldData: {},
            script: 'getData'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Template literal düzeltildi
            }
        });

        const data = JSON.parse(response.data.response.scriptResult);
        for (const item of data) {
            const existingRecord = await Record.findOne({ id: item.id });
            if (existingRecord) {
                await Record.updateOne({ id: item.id }, item);
            } else {// Veriler
                
                const newRecord = new Record(item);
                await newRecord.save();
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const app = express();

connectDB();

cron.schedule('*/10 * * * *', async () => {
    console.log('Fetching data...');
    await fetchData();
});

// app.get('/',(req,res) => {
//     res.json({message:"deneme 123"})
// })



app.listen(20000, () => {
    console.log('Server is running on port 20000');
});


