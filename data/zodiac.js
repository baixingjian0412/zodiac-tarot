// 12星座数据 - 完整版
const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name: '白羊座',
    english: 'Aries',
    date: '3.21 - 4.19',
    element: '火',
    symbol: '♈',
    color: '#FF4D4D',
    traits: ['热情', '勇敢', '直率', '冲动', '冒险'],
    luckyNum: '9',
    luckyColor: '红色',
    rulingPlanet: '火星',
    luckyDay: '星期二',
    luckyStone: '红宝石',
    luckyItem: '红色运动鞋',
    strengths: ['行动力强', '勇于尝试', '乐观开朗', '领导力'],
    weaknesses: ['缺乏耐心', '容易冲动', '三分钟热度', '过于自我'],
    career: ['创业者', '运动员', '军人', '外科医生', '销售'],
    compatibleWith: ['leo', 'sagittarius', 'gemini', 'aquarius'],
    description: '白羊座是黄道十二宫的第一个星座，代表着新生和开始的能量。你天生具有领导气质，行动力十足，想到就做，从不犹豫。'
  },
  {
    id: 'taurus',
    name: '金牛座',
    english: 'Taurus',
    date: '4.20 - 5.20',
    element: '土',
    symbol: '♉',
    color: '#7B9C6B',
    traits: ['稳健', '务实', '固执', '享受', '忠诚'],
    luckyNum: '6',
    luckyColor: '绿色',
    rulingPlanet: '金星',
    luckyDay: '星期五',
    luckyStone: '祖母绿',
    luckyItem: '香薰蜡烛',
    strengths: ['踏实可靠', '耐心持久', '审美出色', '理财能手'],
    weaknesses: ['固执己见', '过分保守', '占有欲强', '懒惰'],
    career: ['金融分析师', '厨师', '园艺师', '建筑师', '音乐家'],
    compatibleWith: ['virgo', 'capricorn', 'cancer', 'pisces'],
    description: '金牛座象征着稳定和坚韧。你脚踏实地，注重实际，对美好的事物有着天生的感知力。一旦确定了目标，就会坚定不移地走下去。'
  },
  {
    id: 'gemini',
    name: '双子座',
    english: 'Gemini',
    date: '5.21 - 6.21',
    element: '风',
    symbol: '♊',
    color: '#FFD700',
    traits: ['聪明', '善变', '好奇', '能言', '灵活'],
    luckyNum: '5',
    luckyColor: '黄色',
    rulingPlanet: '水星',
    luckyDay: '星期三',
    luckyStone: '玛瑙',
    luckyItem: '笔记本',
    strengths: ['口才出众', '思维敏捷', '适应力强', '多才多艺'],
    weaknesses: ['三心二意', '不够深入', '情绪多变', '容易分心'],
    career: ['记者', '作家', '讲师', '程序员', '翻译'],
    compatibleWith: ['libra', 'aquarius', 'leo', 'aries'],
    description: '双子座是黄道十二宫中最聪明的星座之一。你思维敏捷，好奇心旺盛，善于沟通。双重的性格让你能够适应各种环境和人群。'
  },
  {
    id: 'cancer',
    name: '巨蟹座',
    english: 'Cancer',
    date: '6.22 - 7.22',
    element: '水',
    symbol: '♋',
    color: '#A8D8EA',
    traits: ['温柔', '敏感', '顾家', '直觉', '保护'],
    luckyNum: '2',
    luckyColor: '银色',
    rulingPlanet: '月亮',
    luckyDay: '星期一',
    luckyStone: '月光石',
    luckyItem: '抱枕',
    strengths: ['直觉敏锐', '情感细腻', '家庭至上', '善解人意'],
    weaknesses: ['过度敏感', '情绪化', '缺乏安全感', '容易钻牛角尖'],
    career: ['心理咨询师', '教师', '护士', '室内设计师', '厨师'],
    compatibleWith: ['scorpio', 'pisces', 'taurus', 'virgo'],
    description: '巨蟹座是十二星座中最具母性光辉的星座。你情感丰富，善解人意，家庭和情感是你最珍贵的港湾。强大的直觉力让你能洞察人心。'
  },
  {
    id: 'leo',
    name: '狮子座',
    english: 'Leo',
    date: '7.23 - 8.22',
    element: '火',
    symbol: '♌',
    color: '#FF8C00',
    traits: ['自信', '热情', '慷慨', '骄傲', '领导力'],
    luckyNum: '1',
    luckyColor: '金色',
    rulingPlanet: '太阳',
    luckyDay: '星期日',
    luckyStone: '琥珀',
    luckyItem: '墨镜',
    strengths: ['自信大方', '领导才能', '慷慨热情', '创造力强'],
    weaknesses: ['自负', '好面子', '固执', '喜欢被奉承'],
    career: ['演员', '导演', '管理者', '设计师', '主持人'],
    compatibleWith: ['sagittarius', 'aries', 'gemini', 'libra'],
    description: '狮子座是黄道十二宫中的王者。你天生具有领袖气质，自信满满，热情洋溢。慷慨大方是你的天性，舞台和聚光灯是你最熟悉的地方。'
  },
  {
    id: 'virgo',
    name: '处女座',
    english: 'Virgo',
    date: '8.23 - 9.22',
    element: '土',
    symbol: '♍',
    color: '#C0C0C0',
    traits: ['细腻', '完美主义', '理性', '善良', '有条理'],
    luckyNum: '5',
    luckyColor: '灰色',
    rulingPlanet: '水星',
    luckyDay: '星期三',
    luckyStone: '蓝宝石',
    luckyItem: '日程本',
    strengths: ['追求完美', '逻辑性强', '细心周到', '勤奋努力'],
    weaknesses: ['吹毛求疵', '过度焦虑', '挑剔', '难以取悦'],
    career: ['医生', '会计师', '编辑', '数据分析师', '营养师'],
    compatibleWith: ['taurus', 'capricorn', 'cancer', 'scorpio'],
    description: '处女座是十二星座中最注重细节的星座。你追求完美，做事一丝不苟，理性而谨慎。你的善良和体贴总是默默地为身边的人付出。'
  },
  {
    id: 'libra',
    name: '天秤座',
    english: 'Libra',
    date: '9.23 - 10.23',
    element: '风',
    symbol: '♎',
    color: '#FFB6C1',
    traits: ['优雅', '公正', '社交', '犹豫', '艺术感'],
    luckyNum: '6',
    luckyColor: '粉色',
    rulingPlanet: '金星',
    luckyDay: '星期五',
    luckyStone: '粉晶',
    luckyItem: '香水',
    strengths: ['社交高手', '审美在线', '公正平和', '善解人意'],
    weaknesses: ['优柔寡断', '讨好型人格', '逃避冲突', '选择困难'],
    career: ['外交官', '律师', '设计师', '公关', '美容师'],
    compatibleWith: ['gemini', 'aquarius', 'leo', 'sagittarius'],
    description: '天秤座是黄道十二宫中最具优雅气质的星座。你追求平衡与和谐，具有天生的社交才能和审美品味。公正公平是你心中最重要的准则。'
  },
  {
    id: 'scorpio',
    name: '天蝎座',
    english: 'Scorpio',
    date: '10.24 - 11.22',
    element: '水',
    symbol: '♏',
    color: '#8B0000',
    traits: ['深沉', '执着', '敏锐', '神秘', '果断'],
    luckyNum: '8',
    luckyColor: '深红',
    rulingPlanet: '冥王星',
    luckyDay: '星期二',
    luckyStone: '黑曜石',
    luckyItem: '黑色手链',
    strengths: ['洞察力强', '意志坚定', '执行力强', '神秘魅力'],
    weaknesses: ['占有欲强', '记仇', '多疑', '过度控制'],
    career: ['侦探', '研究员', '投资顾问', '心理学家', '外科医生'],
    compatibleWith: ['cancer', 'pisces', 'virgo', 'capricorn'],
    description: '天蝎座是十二星座中最具神秘色彩的星座。你意志坚定，洞察力极强，一旦确定目标就会全力以赴。深沉的情感和强大的精神力是你的标志。'
  },
  {
    id: 'sagittarius',
    name: '射手座',
    english: 'Sagittarius',
    date: '11.23 - 12.21',
    element: '火',
    symbol: '♐',
    color: '#9B59B6',
    traits: ['乐观', '自由', '幽默', '直率', '热爱冒险'],
    luckyNum: '3',
    luckyColor: '紫色',
    rulingPlanet: '木星',
    luckyDay: '星期四',
    luckyStone: '紫水晶',
    luckyItem: '旅行箱',
    strengths: ['乐观向上', '热爱自由', '幽默风趣', '见多识广'],
    weaknesses: ['缺乏耐心', '不负责任', '过于直率', '不安定'],
    career: ['旅行家', '摄影师', '大学教师', '外交官', '导游'],
    compatibleWith: ['leo', 'aries', 'libra', 'aquarius'],
    description: '射手座是黄道十二宫中最乐观自由的星座。你热爱冒险，追求真理，天生幽默感让你成为人群中的开心果。自由是你生命中最重要的追求。'
  },
  {
    id: 'capricorn',
    name: '摩羯座',
    english: 'Capricorn',
    date: '12.22 - 1.19',
    element: '土',
    symbol: '♑',
    color: '#2F4F4F',
    traits: ['务实', '坚韧', '有责任心', '保守', '野心'],
    luckyNum: '4',
    luckyColor: '棕色',
    rulingPlanet: '土星',
    luckyDay: '星期六',
    luckyStone: '黑玛瑙',
    luckyItem: '手表',
    strengths: ['坚韧不拔', '责任心强', '务实可靠', '目标明确'],
    weaknesses: ['过于严肃', '悲观', '固执', '不懂变通'],
    career: ['银行家', '工程师', '公务员', 'CEO', '律师'],
    compatibleWith: ['taurus', 'virgo', 'scorpio', 'pisces'],
    description: '摩羯座是十二星座中最具耐力和责任感的星座。你脚踏实地，目标明确，即使遇到再大的困难也能坚持到底。成熟稳重的你值得信赖。'
  },
  {
    id: 'aquarius',
    name: '水瓶座',
    english: 'Aquarius',
    date: '1.20 - 2.18',
    element: '风',
    symbol: '♒',
    color: '#00CED1',
    traits: ['创新', '独立', '博爱', '叛逆', '智慧'],
    luckyNum: '7',
    luckyColor: '天蓝色',
    rulingPlanet: '天王星',
    luckyDay: '星期六',
    luckyStone: '青金石',
    luckyItem: '耳机',
    strengths: ['思想前卫', '独立创新', '博爱友善', '智慧过人'],
    weaknesses: ['不合群', '叛逆', '情绪疏离', '固执己见'],
    career: ['科学家', '发明家', '程序员', '摄影师', '社会活动家'],
    compatibleWith: ['gemini', 'libra', 'leo', 'sagittarius'],
    description: '水瓶座是黄道十二宫中最具创新精神的星座。你思想前卫，独立自主，追求独一无二的生活方式。博爱的胸怀让你关心全人类的福祉。'
  },
  {
    id: 'pisces',
    name: '双鱼座',
    english: 'Pisces',
    date: '2.19 - 3.20',
    element: '水',
    symbol: '♓',
    color: '#7B68EE',
    traits: ['浪漫', '善良', '想象力', '敏感', '富有同情心'],
    luckyNum: '7',
    luckyColor: '海蓝色',
    rulingPlanet: '海王星',
    luckyDay: '星期四',
    luckyStone: '海蓝宝',
    luckyItem: '画具',
    strengths: ['想象力丰富', '富有同情心', '艺术天赋', '直觉力强'],
    weaknesses: ['逃避现实', '过度敏感', '缺乏界限', '太爱幻想'],
    career: ['艺术家', '音乐家', '心理医生', '演员', '慈善工作者'],
    compatibleWith: ['cancer', 'scorpio', 'taurus', 'capricorn'],
    description: '双鱼座是黄道十二宫中最具梦幻色彩的星座。你充满想象力，浪漫而多情，温柔善良是你的天性。丰富的内心世界让你拥有独特的艺术气质。'
  }
];

// 元素配对系数
const ELEMENT_COMPAT = {
  '火火': 70, '火土': 50, '火风': 85, '火水': 45,
  '土土': 75, '土风': 40, '土水': 80, '土火': 50,
  '风风': 70, '风水': 55, '风火': 85, '风土': 40,
  '水水': 75, '水火': 45, '水土': 80, '水风': 55,
};

// 星座配对计算
function getCompatibility(sign1Id, sign2Id) {
  if (sign1Id === sign2Id) return { score: 50, desc: '相同的星座，最了解你的人也可能是最让你头疼的人。' };

  const s1 = ZODIAC_SIGNS.find(s => s.id === sign1Id);
  const s2 = ZODIAC_SIGNS.find(s => s.id === sign2Id);

  // 元素匹配度
  const elemKey = [s1.element, s2.element].sort().join('');
  const elemScore = ELEMENT_COMPAT[elemKey] || 55;

  // 对宫加成 (相隔6个星座)
  const idx1 = ZODIAC_SIGNS.indexOf(s1);
  const idx2 = ZODIAC_SIGNS.indexOf(s2);
  const diff = Math.abs(idx1 - idx2);
  const oppositeBonus = (diff === 6) ? 15 : 0;

  // 三合/刑冲调整
  const trineBonus = (diff === 4 || diff === 8) ? 10 : 0;  // 三合
  const squarePenalty = (diff === 3 || diff === 9) ? -10 : 0; // 刑

  // 兼容列表加成
  const compatBonus = s1.compatibleWith.includes(s2.id) ? 12 : 0;

  // 总分
  let score = elemScore + oppositeBonus + trineBonus + squarePenalty + compatBonus;
  score = Math.max(15, Math.min(98, score));

  // 等级
  let level, color;
  if (score >= 85) { level = '天生一对'; color = '#2ecc71'; }
  else if (score >= 70) { level = '非常合拍'; color = '#6c8cff'; }
  else if (score >= 55) { level = '相处融洽'; color = '#f0d078'; }
  else if (score >= 40) { level = '需要磨合'; color = '#e67e22'; }
  else { level = '挑战关系'; color = '#e74c3c'; }

  return { score, level, color, s1, s2 };
}

// 每日运势（随机生成，作为AI失败的备用）
function getDailyFortune(signId) {
  const fortunes = [
    { overall: '★★★★★', career: '今日事业运势极佳，领导对你的表现很满意。适合提出新的方案和建议。',
      love: '桃花运旺盛，单身者有机会遇到心仪对象。有伴者感情升温。',
      wealth: '财运亨通，可能有意外之财。投资理财眼光不错。',
      health: '精力充沛，适合运动健身。注意不要过度劳累。',
      tip: '勇敢抓住今天出现的每一个机会！' },
    { overall: '★★★★☆', career: '工作进展顺利，团队合作愉快。适合处理积压已久的任务。',
      love: '感情平稳，适合和伴侣共度美好时光。单身者社交运不错。',
      wealth: '正财稳定，偏财一般。适合稳健理财。',
      health: '身体状况良好，注意饮食均衡。',
      tip: '细节决定成败，今天要多加注意。' },
    { overall: '★★★☆☆', career: '工作中可能会遇到一些小阻碍，保持耐心即可顺利解决。',
      love: '感情上可能需要多一点沟通，误会往往来自于缺乏交流。',
      wealth: '财运平平，不宜进行大额投资。控制消费欲望。',
      health: '容易感到疲惫，注意休息。建议早睡。',
      tip: '慢下来，有时候放慢脚步反而走得更远。' },
    { overall: '★★☆☆☆', career: '工作中可能出现变动或意外，保持冷静应对。不宜做重大决定。',
      love: '感情上容易敏感多疑，给彼此多一些信任和空间。',
      wealth: '财运不佳，谨防冲动消费。避免借钱或担保。',
      health: '情绪影响身体，注意调节心态。适当放松。',
      tip: '今天的低谷是为了明天的飞跃，保持信心。' },
    { overall: '★★★★★', career: '创意灵感爆棚的一天，适合脑力工作和创作。容易获得贵人相助。',
      love: '浪漫指数爆表，适合约会和表白。感情甜蜜蜜。',
      wealth: '偏财运佳，适合尝试新的赚钱渠道。',
      health: '身心状态俱佳，适合开始新的健身计划。',
      tip: '相信你的直觉，它会带你走向正确的方向。' },
    { overall: '★★★★☆', career: '人际关系运佳，适合社交和谈判。可能会有新的合作机会出现。',
      love: '社交场合中容易遇到有意思的人。有伴者适合一起参加活动。',
      wealth: '合作生财，适合与人合伙或洽谈业务。',
      health: '状态不错，适合户外活动。呼吸新鲜空气。',
      tip: '主动出击，机会偏爱有准备的人。' }
  ];

  const idx = (signId.length + new Date().getDate()) % fortunes.length;
  return fortunes[idx];
}

// 查找星座
function findSign(name) {
  return ZODIAC_SIGNS.find(s => s.name === name || s.english.toLowerCase() === name.toLowerCase());
}
