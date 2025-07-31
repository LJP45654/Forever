const client = require('../config/ai.js').client;

messages = [
  {
    "role": "user",
    "content": "你好，我是咨询人，想咨询金融服务相关内容，后续我将提问，请扮演分析师为我解答。每次输出控制在70字内."
  },
  {
    "role": "assistant",
    "content": "好的"
  }
];

async function chatBot(req, res) {
  try {
    const { query } = req.body;

    // 验证输入
    if (!query) {
      return res.status(400).json({
        success: false,
        error: '查询内容不能为空'
      });
    }

    // 如果客户端传入了消息历史，使用它；否则使用服务器存储的
    const conversationHistory = messages;

    // 添加用户的新查询
    conversationHistory.push({ role: 'user', content: query });

    // 调用 AI API
    const response = await client.post('/chat/completions', {
      model: 'qwen-plus',
      messages: conversationHistory
    });

    // 验证响应
    if (!response.data || !response.data.choices || !response.data.choices.length) {
      throw new Error('AI API 返回无效响应');
    }

    // 获取 AI 回复
    const aiReply = response.data.choices[0].message.content;

    // 添加 AI 回复到对话历史
    conversationHistory.push({ role: 'assistant', content: aiReply });

    // 更新服务器存储的消息历史
    messages = conversationHistory;

    // 返回完整的对话历史
    res.json({
      success: true,
      messages: conversationHistory,
      reply: aiReply
    });

  } catch (error) {
    console.error('聊天接口错误:', error);
    res.status(500).json({
      success: false,
      error: '处理聊天请求时发生错误',
      details: error.message
    });
  }
}

module.exports = { chatBot };