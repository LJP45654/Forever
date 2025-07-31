const axios = require('axios');
const { query } = require('../utils/db.js');

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getHalfYearAgoDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

async function updateTickersByCode(ticker) {
    try {
        const date = getTodayDate();
        const dateHalfYearAgo = getHalfYearAgoDate();
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestResponse = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?
            startDate=${dateHalfYearAgo}&endDate=${date}&token=048ca6c7209d97f335a1182aed10769a1c8fb8e6`, { headers })
        const requestResponseData = requestResponse.data;
        const insertQuery = `
    INSERT INTO stock_data (date, close_price, ticker)
    VALUES (?, ?, ?)
  `;

        for (const item of requestResponseData) {
            const dateOnly = item.date.split('T')[0]; // 去掉T及后面
            const close = item.close;

            await query(insertQuery, [dateOnly, close, ticker]);
        }
        const lastClosePrice = requestResponseData[requestResponseData.length - 1].close;
        console.log(`Data for ${ticker} saved successfully`);
        return lastClosePrice;
    } catch (err) {
        console.error('Fetch or Save failed:', err.message);
    }
}



async function deleteTickersByCode(code) {
    try {
        const sql = 'DELETE FROM stock_data WHERE ticker = ?';
        const values = [code];
        await query(sql, values);
    } catch (err) {
        console.error('Delete failed:', err.message);
    }
}

module.exports = {
    deleteTickersByCode,
    updateTickersByCode,
}