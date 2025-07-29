const config = require('dotenv').config();
const axios = require('axios');

messages = [];

const client = axios.create({
    baseURL: process.env.AI_URL,
    headers: {
        'Authorization': process.env.AI_KEY,
    }
});

module.exports = { client }