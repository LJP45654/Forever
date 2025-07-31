const axios = require('axios');
const cron = require('node-cron');
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

function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 格式化为 YYYY-MM-DD
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  
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
            const dateOnly = item.date.split('T')[0];
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

async function updateTickersLatestDayByCode(ticker) {
    try {
        const date = getYesterdayDate();
        const headers = {
            'Content-Type': 'application/json'
        }
        const requestResponse = await axios.get(`https://api.tiingo.com/tiingo/daily/${ticker}/prices?
            startDate=${date}&token=048ca6c7209d97f335a1182aed10769a1c8fb8e6`, { headers })
        const requestResponseData = requestResponse.data;
        const insertQuery = `
    INSERT INTO stock_data (date, close_price, ticker)
    VALUES (?, ?, ?)
  `;

        for (const item of requestResponseData) {
            const dateOnly = item.date.split('T')[0];
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

async function getAllStockCodes() {
  try {
    const selectQuery = 'SELECT DISTINCT stock_code FROM stocks';
    const results = await query(selectQuery);
    // 假设结果是一个对象数组，提取stock_code
    return results.map(row => row.stock_code);
  } catch (err) {
    console.error('Failed to fetch stock codes:', err.message);
    throw err;
  }
}

async function updateAllStocks() {
  try {
    console.log('Starting daily stock data update...');
    const stockCodes = await getAllStockCodes();
    console.log(`Found ${stockCodes.length} stock codes to update`);
    
    for (const code of stockCodes) {
      try {
        console.log(`Updating data for stock code: ${code}`);
        const lastClosePrice = await updateTickersLatestDayByCode(code);
        console.log(`Last close price for ${code}: ${lastClosePrice}`);
        
        // 更新stocks表中的current_price
        const updateQuery = `
          UPDATE stocks 
          SET current_price = ? 
          WHERE stock_code = ?
        `;
        await query(updateQuery, [lastClosePrice, code]);
      } catch (err) {
        console.error(`Failed to update data for ${code}:`, err.message);
        // 继续处理下一个股票，不中断整个流程
      }
    }
    
    console.log('Daily stock data update completed');
  } catch (err) {
    console.error('Daily stock data update failed:', err.message);
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

cron.schedule('0 0 * * *', () => {
  console.log('Running daily stock update job at:', new Date().toLocaleString());
  updateAllStocks();
});

module.exports = {
    deleteTickersByCode,
    updateTickersByCode,
    updateAllStocks
}