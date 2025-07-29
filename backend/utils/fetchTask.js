const axios = require('axios');
const connection = require('db.js');
require('dotenv').config();
const getTickerNames = require('../controllers/stockController.js');

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

async function fetchAndSaveData() {
  try {
    const jsonString = getTickerNames();
    const jsonData = JSON.parse(jsonString);
    const tickers = jsonData.map(item => item.ticker);
    const date = getTodayDate();
    const headers = {
        'Content-Type': 'application/json'
    }
    for (const ticker of tickers) {
        const requestResponse = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${date}&endDate=${date}&token=048ca6c7209d97f335a1182aed10769a1c8fb8e6`, { headers })
        const requestResponseData = requestResponse.data;
        const close = requestResponseData.map((item) => item.close);
        const closePrice = close[0];
        await connection.execute(
            'INSERT INTO stock_data (date, close_price,ticker) VALUES (?, ?, ?)',
            [date, closePrice, ticker]
        );
    }
    console.log(`[${new Date().toISOString()}] Data saved successfully.`);
  } catch (err) {
    console.error('Fetch or Save failed:', err.message);
  }
}

module.exports = fetchAndSaveData;