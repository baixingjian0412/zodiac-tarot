// ===== DeepSeek API 封装 =====

// 检测是否从 file:// 打开（跨域受限）
const IS_FILE_PROTOCOL = window.location.protocol === 'file:';

async function callDeepSeek(messages, options = {}) {
  if (IS_FILE_PROTOCOL) {
    console.warn('⚠️ 从 file:// 打开时无法请求 API，请用本地服务器打开：');
    console.warn('   python -m http.server 8000');
    console.warn('   或 VS Code → 右键 → Open with Live Server');
    throw new Error('FILE_PROTOCOL');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000); // 15秒超时

  try {
    const resp = await fetch(`${CONFIG.BASE_URL}/chat/completions`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.API_KEY}`,
      },
      body: JSON.stringify({
        model: options.model || CONFIG.MODEL,
        messages,
        temperature: options.temperature ?? 0.85,
        max_tokens: options.maxTokens ?? 1024,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const errText = await resp.text().catch(() => '未知错误');
      throw new Error(`API错误(${resp.status}): ${errText.slice(0, 200)}`);
    }

    const data = await resp.json();
    return data.choices[0].message.content;
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') throw new Error('请求超时，请检查网络');
    throw e;
  }
}

// ===== 运势生成 =====
async function generateZodiacFortune(sign) {
  try {
    const prompt = `你是一位精通占星术的玄学大师，正在为用户解读${sign.name}（${sign.english}，${sign.element}象星座）的今日运势。

星座信息：
- 日期范围：${sign.date}
- 特质：${sign.traits.join('、')}
- 幸运数字：${sign.luckyNum}
- 幸运色：${sign.luckyColor}
- 简介：${sign.description}

请用温暖、神秘而诗意的中文风格，生成今日运势。要求：
1. 综合运势星级评分（1-5星，用★表示）
2. 今日宜（2-3件今天适合做的事）
3. 今日忌（2-3件今天不宜做的事）
4. 事业运势（2-3句话）
5. 爱情运势（2-3句话）
6. 财运运势（2-3句话）
7. 健康运势（1-2句话）
8. 今日箴言（一句有哲理的话）

请以JSON格式返回，不要加markdown代码块标记，直接返回JSON：
{
  "overall": "★★★★★",
  "career": "...",
  "love": "...",
  "wealth": "...",
  "health": "...",
  "dos": "...",
  "donts": "...",
  "tip": "..."
}`;

    const text = await callDeepSeek([
      { role: 'system', content: '你是一位精通占星术和东方玄学的神秘导师，语言温暖诗意，富有灵性。用中文回答。' },
      { role: 'user', content: prompt },
    ], { maxTokens: 800 });

    const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('AI运势生成失败:', e.message);
    return null;
  }
}

// ===== 塔罗解读 =====
async function generateTarotReading(card, isReversed) {
  try {
    const direction = isReversed ? '逆位' : '正位';
    const prompt = `你是一位精通塔罗的大师，正在为用户解读一张塔罗牌。

牌面信息：
- 牌名：${card.name}（${card.nameEn}）
- 元素：${card.element}
- 关键词：${card.keywords.join('、')}
- 方向：${direction}
- 正位含义：${card.upright}
- 逆位含义：${card.reversed}

请用温暖、神秘而富有洞察力的中文，写一段${direction}的深度解读（100-150字）。要结合牌面的象征意义，给出对当下生活的指导建议，语气要像一位智慧导师在娓娓道来。`;

    return await callDeepSeek([
      { role: 'system', content: '你是一位神秘的塔罗大师，语言充满灵性和智慧。用中文回答。' },
      { role: 'user', content: prompt },
    ], { maxTokens: 600 });
  } catch (e) {
    console.warn('AI塔罗解读失败:', e.message);
    return null;
  }
}

// ===== 牌阵综合解读 =====
async function generateSpreadTarotReading(cards, config) {
  try {
    const cardsInfo = cards.map((c, i) =>
      c.position.label + '（' + c.position.icon + '）：' + c.name + '（' + c.direction + '）\n' +
      '关键词：' + c.keywords.join('、') + '\n' +
      '含义：' + c.reading
    ).join('\n\n');

    const prompt = '你是一位塔罗大师，正在为求问者解读' + config.name + '。\n\n' +
      '牌阵信息：\n' + cardsInfo + '\n\n' +
      '请写一段综合解读（300-500字），将这些牌串联成一个完整的故事。\n' +
      '包含：牌阵整体能量解读、每张牌在这个位置的意义、给求问者的建议。\n\n' +
      '语言温暖有灵性，娓娓道来。用中文回答。';

    return await callDeepSeek([
      { role: 'system', content: '你是一位通晓塔罗的神秘导师，语言充满灵性和智慧。用中文回答。' },
      { role: 'user', content: prompt },
    ], { maxTokens: 1200 });
  } catch (e) {
    console.warn('AI牌阵解读失败:', e.message);
    return null;
  }
}

// ===== 生命灵数解读 =====
async function generateNumerologyReading(num, masterNum, birthDate, staticTitle, staticDesc) {
  try {
    const masterInfo = masterNum ? '（大师数字 ' + masterNum + '）' : '';
    const prompt = '你是一位精通生命灵数的导师，正在为求问者深度解读他的生命灵数。\n\n' +
      '信息：\n- 出生日期：' + birthDate + '\n- 生命灵数：' + num + ' ' + masterInfo + '\n- 基础特质：' + staticTitle + '\n- 基础描述：' + staticDesc + '\n\n' +
      '请写一段150-200字的深度解读，包括：\n1. 这个数字的能量含义\n2. 天赋优势\n3. 人生课题/成长方向\n4. 给求问者的建议\n\n' +
      '语言风格温暖、有灵性，像一位智慧的长者在指点人生。用中文回答。';

    return await callDeepSeek([
      { role: 'system', content: '你是一位通晓生命灵数的智慧导师，语言温暖深邃。用中文回答。' },
      { role: 'user', content: prompt },
    ], { maxTokens: 700 });
  } catch (e) {
    console.warn('AI灵数解读失败:', e.message);
    return null;
  }
}
