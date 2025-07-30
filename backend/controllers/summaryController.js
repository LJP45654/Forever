const { query } = require('../utils/db.js');

async function getAssetSums() {
    const stock_sql = `SELECT ROUND(SUM(c.current_price*c.quantity* er.rate_to_cny),2) as ticker
                       FROM stocks c
                       JOIN exchange_rates er ON c.currency = er.currency_code;`;
    const cash_sql = `SELECT ROUND(SUM(c.balance* er.rate_to_cny),2) as cash
                      FROM cash_snapshot c
                      JOIN exchange_rates er ON c.currency = er.currency_code;`;
    const deposit_sql = `SELECT ROUND(SUM(c.principal* er.rate_to_cny),2) as deposit
                         FROM deposit c
                         JOIN exchange_rates er ON c.currency = er.currency_code;`;
    const funds_sql = `SELECT ROUND(SUM(f.units*f.current_price* er.rate_to_cny),2) as funds
                       FROM funds f
                       JOIN exchange_rates er ON f.currency = er.currency_code;`;
    const bonds_sql = `SELECT ROUND(SUM(b.amount* er.rate_to_cny),2) as bonds
                       FROM government_bonds b
                       JOIN exchange_rates er ON b.currency = er.currency_code;`;
    const others_sql = `SELECT ROUND(SUM(o.current_amount* er.rate_to_cny),2) as others
                        FROM others o
                        JOIN exchange_rates er ON o.currency = er.currency_code;`;

    const [tickerSum, cashSum, depositSum, fundsSum, bondsSum, othersSum] = await Promise.all([
        query(stock_sql),
        query(cash_sql),
        query(deposit_sql),
        query(funds_sql),
        query(bonds_sql),
        query(others_sql)
    ]);

    return {
        ticker: Number(tickerSum[0].ticker).toFixed(2),
        cash: cashSum[0].cash,
        deposit: Number(depositSum[0].deposit).toFixed(2),
        funds: Number(fundsSum[0].funds).toFixed(2),
        bonds: bondsSum[0].bonds,
        othersSum: Number(othersSum[0].others).toFixed(2),
    };
}

// 获取各类资产的数量和收益信息
async function getAssetDetails() {
    const stockCount_sql = `SELECT COUNT(DISTINCT stock_name) as stock_count FROM stocks`;
    const cashCount_sql = `SELECT COUNT(*) as cash_count FROM cash_snapshot`;
    const depositCount_sql = `SELECT COUNT(DISTINCT currency) AS currency_count FROM deposit`;
    const fundsCount_sql = `SELECT COUNT(DISTINCT fund_name) as funds_count FROM funds`;
    const bondsCount_sql = `SELECT COUNT(DISTINCT bond_name) as bonds_count FROM government_bonds`;
    const othersCount_sql = `SELECT COUNT(DISTINCT name) as others_count FROM others`;

    const tickerEarning_sql = `SELECT ROUND(SUM(purchase_price*c.quantity* er.rate_to_cny),2) as ticker_earning 
                               FROM stocks c
                               JOIN exchange_rates er ON c.currency = er.currency_code;`;
    const fundsEarning_sql = `SELECT ROUND(SUM(f.units*f.purchase_price* er.rate_to_cny),2) as funds_earning
                              FROM funds f
                              JOIN exchange_rates er ON f.currency = er.currency_code;`;
    const othersEarning_sql = `SELECT ROUND(SUM(o.purchase_amount* er.rate_to_cny),2) as others_earning
                               FROM others o
                               JOIN exchange_rates er ON o.currency = er.currency_code;`;

    const [tickerNum, cashNum, depositNum, fundsNum, bondsNum, othersNum, 
           tickerEarning, fundsEarning, othersEarning] = await Promise.all([
        query(stockCount_sql),
        query(cashCount_sql),
        query(depositCount_sql),
        query(fundsCount_sql),
        query(bondsCount_sql),
        query(othersCount_sql),
        query(tickerEarning_sql),
        query(fundsEarning_sql),
        query(othersEarning_sql)
    ]);

    return {
        tickerNum: tickerNum[0].stock_count,
        cashNum: cashNum[0].cash_count,
        depositNum: depositNum[0].currency_count,
        fundsNum: fundsNum[0].funds_count,
        bondsNum: bondsNum[0].bonds_count,
        othersNum: othersNum[0].others_count,
        tickerEarning: Number(tickerEarning[0].ticker_earning).toFixed(2),
        fundsEarning: Number(fundsEarning[0].funds_earning).toFixed(2),
        othersEarning: Number(othersEarning[0].others_earning).toFixed(2)
    };
}

// 格式化最终结果
function formatResult(assets, details) {
    let totalSum = 0;
    for (const key in assets) {
        totalSum += parseFloat(assets[key]);
    }

    return {
        sum: totalSum.toFixed(2),
        assets: {
            ticker: {
                amount: assets.ticker,
                list_num: details.tickerNum,
                total_earnings: details.tickerEarning,
            },
            cash: {
                amount: assets.cash,
                list_num: details.cashNum,
            },
            deposit: {
                amount: assets.deposit,
                list_num: details.depositNum,
            },
            funds: {
                amount: assets.funds,
                list_num: details.fundsNum,
                total_earnings: details.fundsEarning,
            },
            bonds: {
                amount: assets.bonds,
                list_num: details.bondsNum,
            },
            othersSum: {
                amount: assets.othersSum,
                list_num: details.othersNum,
                total_earnings: details.othersEarning,
            }
        }
    };
}

// 主函数
async function getSummaryData(req, res) {
    try {
        const assets = await getAssetSums();
        const details = await getAssetDetails();
        const result = formatResult(assets, details);
        res.json(result);
    } catch (error) {
        console.error('Error fetching summary data:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}

module.exports = {
    getSummaryData,
}