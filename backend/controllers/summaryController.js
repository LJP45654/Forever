const { query } = require('../utils/db.js');

async function getSummaryData(req, res) {
    try {
        stock_sql = `SELECT ROUND(SUM(c.current_price*c.quantity* er.rate_to_cny),2) as ticker
                     FROM stocks c
                     JOIN exchange_rates er ON c.currency = er.currency_code;`
        stockCount_sql = `SELECT COUNT(DISTINCT stock_name) as stock_count FROM stocks`
        const tickerSum = await query(stock_sql);
        const tickerNum = await query(stockCount_sql);

        cash_sql = `SELECT ROUND(SUM(c.balance* er.rate_to_cny),2) as cash
                     FROM cash_snapshot c
                     JOIN exchange_rates er ON c.currency = er.currency_code;`
        cashCount_sql = `SELECT COUNT(*) as cash_count FROM cash_snapshot`
        const cashSum = await query(cash_sql);
        const cashNum = await query(cashCount_sql);

        deposit_sql = `SELECT ROUND(SUM(c.principal* er.rate_to_cny),2) as deposit
                     FROM deposit c
                    JOIN exchange_rates er ON c.currency = er.currency_code;`
        depositCount_sql = `SELECT COUNT(DISTINCT currency) AS currency_count FROM deposit;`
        const depositSum = await query(deposit_sql);
        const depositNum = await query(depositCount_sql);

        funds_sql = `SELECT ROUND(SUM(f.units*f.current_price* er.rate_to_cny),2) as funds
                     FROM funds f
                     JOIN exchange_rates er ON f.currency = er.currency_code;`
        fundsCount_sql = `SELECT COUNT(DISTINCT fund_name) as funds_count FROM funds`
        const fundsSum = await query(funds_sql);
        const fundsNum = await query(fundsCount_sql);

        bonds_sql = `SELECT ROUND(SUM(b.amount* er.rate_to_cny),2) as bonds
                     FROM government_bonds b
                     JOIN exchange_rates er ON b.currency = er.currency_code;`
        bondsCount_sql = `SELECT COUNT(DISTINCT bond_name) as bonds_count FROM government_bonds`
        const bondsSum = await query(bonds_sql);
        const bondsNum = await query(bondsCount_sql);

        others_sql = `SELECT ROUND(SUM(o.current_amount* er.rate_to_cny),2) as others
                     FROM others o
                     JOIN exchange_rates er ON o.currency = er.currency_code;`
        othersCount_sql = `SELECT COUNT(DISTINCT name) as others_count FROM others`
        const othersSum = await query(others_sql);
        const othersNum = await query(othersCount_sql);

        const tickerEarning_sql = `SELECT ROUND(SUM(purchase_price*c.quantity* er.rate_to_cny),2) as ticker_earning 
                                    FROM stocks c
                                    JOIN exchange_rates er ON c.currency = er.currency_code;`
        const fundsEarning_sql = `SELECT ROUND(SUM(f.units*f.purchase_price* er.rate_to_cny),2) as funds_earning
                                    FROM funds f
                                    JOIN exchange_rates er ON f.currency = er.currency_code;`
        const othersEarning_sql = `SELECT ROUND(SUM(o.purchase_amount* er.rate_to_cny),2) as others_earning
                                    FROM others o
                                    JOIN exchange_rates er ON o.currency = er.currency_code;`
        const tickerEarning = await query(tickerEarning_sql);
        const fundsEarning = await query(fundsEarning_sql);
        const othersEarning = await query(othersEarning_sql);

        const assets = {
            ticker: Number(tickerSum[0].ticker).toFixed(2),
            cash: cashSum[0].cash,
            deposit: Number(depositSum[0].deposit).toFixed(2),
            funds: Number(fundsSum[0].funds).toFixed(2),
            bonds: bondsSum[0].bonds,
            othersSum: Number(othersSum[0].others).toFixed(2),
        };
        let totalSum = 0;
        for (const key in assets) {
            totalSum += parseFloat(assets[key]);
        }
        const result = {
            sum: totalSum.toFixed(2),
            assets: {
                ticker: {
                    amount: assets.ticker,
                    list_num:tickerNum[0].stock_count,
                    total_earnings: Number(tickerEarning[0].ticker_earning).toFixed(2),
                },
                cash: {
                    amount: assets.cash,
                    list_num:cashNum[0].cash_count,
                },
                deposit: {
                    amount: assets.deposit,
                    list_num:depositNum[0].currency_count,
                },
                funds: {
                    amount: assets.funds,
                    list_num:fundsNum[0].funds_count,
                    total_earnings: Number(fundsEarning[0].funds_earning).toFixed(2),
                },
                bonds: {
                    amount: assets.bonds,
                    list_num:bondsNum[0].bonds_count,
                },
                othersSum: {
                    amount: assets.othersSum,
                    list_num:othersNum[0].others_count,
                    total_earnings: Number(othersEarning[0].others_earning).toFixed(2),
                }
            }
        };
        res.json(result);
    } catch (error) {
        console.error('Error fetching ticker names:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}

module.exports = {
    getSummaryData,
}