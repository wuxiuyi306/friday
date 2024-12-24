interface AssistantConfig {
  name: string;
  apiUrl: string;
  apiKey: string;
  greeting: string;
}

export const assistants: Record<string, AssistantConfig> = {
  vocabulary: {
    name: '单词',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-UUboxY4xU1uHOvqHbYHneSPK',
    greeting: `你好！我是你的单词助手。输入任何英文单词，我将为你提供全方位的解析：

1. 音标和发音指导
2. 词根词缀分析
3. 同义词、反义词和近义词的比较
4. 实用例句
5. 包含该单词的经典电影台词

试试输入一个英文单词，比如 "resilient" 或 "serendipity"！`
  },
  phrase: {
    name: '词组',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-VD2PMKtjnMR3VtyvFavPF0CR',
    greeting: `你好！我是词组助手。输入任何英语词组，我将为你提供：

1. 详细的含义解释和用法说明
2. 5个实用例句
3. 相近词组的对比分析
4. 5个包含该词组的经典电影台词

试试输入一个词组，比如 "break through" 或 "look up to"！`
  },
  grammar: {
    name: '语法',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-RPGufH3ydNwGlPVubmrAUN4N',
    greeting: `你好！我是语法助手。把你想检查的英语句子发给我，我会：

1. 判断语法正确性，并提供地道的表达方式
2. 详细解释语法错误的原因和相关语法知识点
3. 提供5个正确运用该语法的例句

试试输入一个英语句子，我来帮你分析语法！`
  },
  writing: {
    name: '写作纠正',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-EE8GZY8DUixeLK8uMYYfKDfD',
    greeting: `你好！我是写作助手。将你的英语文章发给我，我会帮你：

1. 全面检查拼写、词组使用和语法
2. 分析并改进文章的表达逻辑
3. 提供优化后的重写版本

把你想要完善的英语文章发给我吧！`
  },
  words: {
    name: '经典桥段',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-1Mva3NvwbYFBSJ7FZT4qT6Ou',
    greeting: `还没准备好，随便聊聊天吧，关于英语的哦`
  },
  chat: {
    name: '随便聊天',
    apiUrl: 'https://api.dify.ai/v1',
    apiKey: 'app-1Mva3NvwbYFBSJ7FZT4qT6Ou',
    greeting: `你好！我是聊天助手。让我们开始轻松愉快的对话吧！

我可以用中文或英文与你交谈，帮助你：
- 练习日常英语对话
- 讨论任何感兴趣的话题
- 了解英语国家的文化习俗

想聊什么话题呢？`
  }
};
