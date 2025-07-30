const { query } = require('../utils/db.js');
const { getStockTimeSeries } = require('./stockController.js');
const { getCashTimeSeries } = require('./cashController.js');
const { getDepositTimeSeries } = require('./depositController.js');
const { getFundTimeSeries } = require('./fundController.js');
const { getBondTimeSeries } = require('./bondController.js');
const { getOthersTimeSeries } = require('./othersController.js');


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
                       FROM bonds b
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
    const bondsCount_sql = `SELECT COUNT(DISTINCT bond_name) as bonds_count FROM bonds`;
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
        stock: {
            amount: assets.ticker,
            list_num: details.tickerNum,
            total_earnings: details.tickerEarning,
        },
        cash: {
            amount: assets.cash,
            list_num: details.cashNum,
            total_earnings: 0,
        },
        deposit: {
            amount: assets.deposit,
            list_num: details.depositNum,
            total_earnings: 0,
        },
        fund: {
            amount: assets.funds,
            list_num: details.fundsNum,
            total_earnings: details.fundsEarning,
        },
        bond: {
            amount: assets.bonds,
            list_num: details.bondsNum,
            total_earnings: 0,
        },
        others: {
            amount: assets.othersSum,
            list_num: details.othersNum,
            total_earnings: details.othersEarning,
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

async function getSearchData(req, res) {
    try {
        const { search } = req.body;
        if (!search) {
            return res.status(400).json({ error: "搜索关键词不能为空" });
        }

        // 定义类别配置
        const categories = [
            {
                name: 'stocks',
                subCategoryQuery: `SELECT DISTINCT stock_name as value FROM stocks`,
                searchQuery: `SELECT * FROM stocks WHERE stock_name LIKE ?`,
                resultKey: 'stocks'
            },
            {
                name: 'cash',
                subCategoryQuery: `SELECT DISTINCT currency as value FROM cash`,
                searchQuery: `SELECT * FROM cash WHERE currency LIKE ?`,
                resultKey: 'cash'
            },
            {
                name: 'deposits',
                subCategoryQuery: `SELECT DISTINCT currency as value FROM deposit`,
                searchQuery: `SELECT * FROM deposit WHERE currency LIKE ?`,
                resultKey: 'deposits'
            },
            {
                name: 'funds',
                subCategoryQuery: `SELECT DISTINCT fund_name as value FROM funds`,
                searchQuery: `SELECT * FROM funds WHERE fund_name LIKE ?`,
                resultKey: 'funds'
            },
            {
                name: 'bonds',
                subCategoryQuery: `SELECT DISTINCT bond_name as value FROM bonds`,
                searchQuery: `SELECT * FROM bonds WHERE bond_name LIKE ?`,
                resultKey: 'bonds'
            },
            {
                name: 'others',
                subCategoryQuery: `SELECT DISTINCT name as value FROM others`,
                searchQuery: `SELECT * FROM others WHERE name LIKE ?`,
                resultKey: 'others'
            }
        ];

        // 准备搜索参数（使用参数化查询防止SQL注入）
        const searchParam = `%${search}%`;

        // 初始化结果对象
        const result = {
            searchResults: [],
            data: {
                stocks: [],
                cash: [],
                deposits: [],
                funds: [],
                bonds: [],
                others: []
            }
        };

        // 处理每个类别
        for (const category of categories) {
            // 获取子类别
            const subCategories = await query(category.subCategoryQuery);
            const subCategoryArray = subCategories.map(item => item.value);

            // 检查是否有匹配
            const hasMatch = subCategoryArray.some(item =>
                item.toLowerCase().includes(search.toLowerCase())
            );

            // 将匹配状态添加到结果中
            result.searchResults.push(hasMatch);

            // 如果有匹配，执行搜索查询
            if (hasMatch) {
                const searchResults = await query(category.searchQuery, [searchParam]);
                result.data[category.resultKey] = searchResults;
            }
        }

        // 返回结果
        return res.status(200).json(result);

    } catch (error) {
        console.error('Error fetching search data:', error);
        return res.status(500).json({ error: 'Database query failed' });
    }
}             

async function getTimeSeriesDataInCNY(req, res) {
  try {
    const exchangeRatesQuery = `SELECT currency_code, rate_to_cny FROM exchange_rates`;
    const exchangeRates = await query(exchangeRatesQuery);

    const rateMap = new Map();
    exchangeRates.forEach(rate => {
      rateMap.set(rate.currency_code, rate.rate_to_cny);
    });

    const convertToCNY = (rows) => {
      return rows.map(row => {
        const rate = rateMap.get(row.currency) || 1;
        return {
          date: row.date,
          amount: parseFloat((row.amount * rate).toFixed(2)),
          currency: 'CNY'
        };
      });
    };

    const [stocks, cash, deposits, funds, bonds, others] = await Promise.all([
      getStockTimeSeries(),
      getCashTimeSeries(),
      getDepositTimeSeries(),
      getFundTimeSeries(),
      getBondTimeSeries(),
      getOthersTimeSeries()
    ]);

    const result = {
      stocks: convertToCNY(stocks),
      cash: convertToCNY(cash),
      deposits: convertToCNY(deposits),
      funds: convertToCNY(funds),
      bonds: convertToCNY(bonds),
      others: convertToCNY(others)
    };

    return res.status(200).json(result);

  } catch (err) {
    console.error('Error generating time series data:', err);
    return res.status(500).json({ error: 'Failed to generate time series data' });
  }
}


module.exports = {
    getSummaryData,
    getSearchData,
    getTimeSeriesDataInCNY
}