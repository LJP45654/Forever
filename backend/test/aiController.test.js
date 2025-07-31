const { chatBot } = require('../controllers/aiController'); // 修改为你的实际文件路径
const { client } = require('../config/ai');

jest.mock('../config/ai', () => ({
  client: {
    post: jest.fn()
  }
}));

describe('chatBot', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        query: 'Hello',
        messages: [
          { role: 'user', content: 'Hi' },
          { role: 'assistant', content: 'Hello! How can I help you?' }
        ]
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('should return AI reply and updated message history on success', async () => {
    const mockAIResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'This is the AI response.'
            }
          }
        ]
      }
    };

    client.post.mockResolvedValueOnce(mockAIResponse);

    await chatBot(req, res);

    expect(client.post).toHaveBeenCalledWith('/chat/completions', {
      model: 'qwen-plus',
      messages: expect.any(Array)
    });

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      messages: expect.arrayContaining([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'This is the AI response.' }
      ]),
      reply: 'This is the AI response.'
    });
  });

  test('should return 400 if query is missing', async () => {
    req.body.query = '';

    await chatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: '查询内容不能为空'
    });
  });

  test('should return 500 on AI API failure', async () => {
    client.post.mockRejectedValueOnce(new Error('API error'));

    await chatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: '处理聊天请求时发生错误',
      details: 'API error'
    }));
  });

  test('should return 500 on invalid AI API response', async () => {
    client.post.mockResolvedValueOnce({ data: {} });

    await chatBot(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: '处理聊天请求时发生错误',
      details: 'AI API 返回无效响应'
    }));
  });
});
