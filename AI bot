const axios = require('axios');
const readline = require('readline');

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 设置客户端
const client = axios.create({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  headers: {
    'Authorization': 'sk-7cc78723357344caa347416637b4c1c7', // 用你正确的 API Key 替换
  }
});


// 创建聊天会话
async function chat() {
  console.log("你好！请输入问题，我将为你解答。输入 '退出' 结束对话。\n");

  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' }
  ];

  // 递归函数处理用户输入
  function askQuestion() {
    rl.question('你：', async (userInput) => {
      // 判断是否退出
      if (userInput.toLowerCase() === '退出') {
        console.log('感谢使用！再见！');
        rl.close();
        return;
      }

      // 将用户输入添加到对话记录中
      messages.push({ role: 'user', content: userInput });

      try {
        // 调用 API 获取模型响应
        const response = await client.post('/chat/completions', {
          model: 'qwen-plus',
          messages: messages
        });

        // 输出模型的回复
        const assistantReply = response.data;
        const content = assistantReply.choices[0].message.content;
        console.log('助手：' + content);

        // 将助手的回复也添加到对话记录中
        messages.push({ role: 'assistant', content: content });

      } catch (error) {
        console.error('发生错误:', error.message);
      }

      // 递归调用，以便继续处理下一个用户输入
      askQuestion();
    });
  }

  // 启动第一个问题询问
  askQuestion();
}

// 启动聊天
chat();
