// models/routes/records.js

const express = require('express');
const router = express.Router();
const Record = require('/models/recordModel');

// Tüm kayıtları getir
router.get('/', async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $group: {
                    _id: '$hesapKodu',
                    toplamBorc: { $sum: '$toplamBorc' }
                }
            }
        ]);

        res.json(result);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
