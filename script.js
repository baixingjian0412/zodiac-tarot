// ===== 页面导航 =====

// 开场动画结束后移除
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.remove();
    }
  }, 3500); // 等CSS动画（2.6s fadeout + 缓冲）完成
});
function navigateTo(page) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // 显示目标页面
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    // 重置滚动
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 更新导航高亮
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });

  // 星座页面使用浅色主题，其余保持暗色
  document.body.classList.toggle('theme-light', page === 'zodiac');

  // 星座页面隐藏canvas背景，其他页面显示
  const canvas = document.getElementById('cosmicCanvas');
  if (canvas) {
    canvas.style.display = page === 'zodiac' ? 'none' : '';
  }

  // 如果进入塔罗页面，确保牌扇已渲染
  if (page === 'tarot') {
    renderTarotFan();
  }
}

// AI 状态检测
(function checkAIStatus() {
  const note = document.getElementById('aiStatusNote');
  if (!note) return;
  const isFile = window.location.protocol === 'file:';
  if (isFile) {
    note.innerHTML = '<span>⚠️ 请用本地服务器打开以获得完整体验</span>' +
      '<br><span style="font-size:0.75em;opacity:0.7">python -m http.server 8000 → http://localhost:8000</span>';
    note.style.opacity = '0.8';
    note.style.color = 'var(--accent-gold)';
  }
})();

// ===== 星座页面 =====
document.addEventListener('DOMContentLoaded', () => {
  renderZodiacGrid();
  renderTarotFan();
  renderRanking();
});

function renderZodiacGrid() {
  const grid = document.getElementById('zodiacGrid');
  grid.innerHTML = ZODIAC_SIGNS.map(s => `
    <div class="zodiac-card" onclick="showSignDetail('${s.id}')">
      <span class="symbol">${s.symbol}</span>
      <span class="name">${s.name}</span>
    </div>
  `).join('');
}

// 星座子导航切换
function switchZodiacTab(tab) {
  document.querySelectorAll('.z-sub-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ztab === tab);
  });
  document.querySelectorAll('.ztab').forEach(t => t.classList.remove('active'));
  document.getElementById('ztab-' + tab).classList.add('active');
  if (tab === 'rank') renderRanking();
}

// ===== 星座详情 =====
async function showSignDetail(signId) {
  const sign = ZODIAC_SIGNS.find(s => s.id === signId);
  const container = document.getElementById('signDetail');

  container.innerHTML = `
    <div class="sign-detail">
      <div class="sign-detail-header">
        <div class="big-symbol" style="color:${sign.color}">${sign.symbol}</div>
        <div class="info">
          <h2>${sign.name} <span style="font-size:0.55em;color:var(--text-muted);font-weight:400">${sign.english}</span></h2>
          <div class="meta">${sign.date} · ${sign.element}象星座</div>
        </div>
      </div>

      <p style="color:var(--text-secondary);font-size:0.88em;line-height:1.7">${sign.description}</p>

      <!-- 基础信息徽章 -->
      <div class="sign-badges">
        <span class="sign-badge"><span class="badge-icon">⭐</span> 守护星: ${sign.rulingPlanet}</span>
        <span class="sign-badge"><span class="badge-icon">🍀</span> 幸运色: ${sign.luckyColor}</span>
        <span class="sign-badge"><span class="badge-icon">🔢</span> 幸运数字: ${sign.luckyNum}</span>
        <span class="sign-badge"><span class="badge-icon">📅</span> 幸运日: ${sign.luckyDay}</span>
      </div>

      <!-- 特质标签 -->
      <div class="tags">
        ${sign.traits.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>

      <!-- 详细信息网格 -->
      <div class="sign-info-grid">
        <div class="sign-info-item">
          <div class="sii-label">💎 幸运石</div>
          <div class="sii-value">${sign.luckyStone}</div>
        </div>
        <div class="sign-info-item">
          <div class="sii-label">🎁 幸运物</div>
          <div class="sii-value">${sign.luckyItem}</div>
        </div>
        <div class="sign-info-item">
          <div class="sii-label">💼 适合职业</div>
          <div class="sii-value" style="font-size:0.8em">${sign.career.slice(0,3).join(' · ')}</div>
        </div>
        <div class="sign-info-item" onclick="showSignDetail('${sign.compatibleWith[0]}')" style="cursor:pointer">
          <div class="sii-label">💞 最佳配对</div>
          <div class="sii-value">${ZODIAC_SIGNS.find(s2 => s2.id === sign.compatibleWith[0])?.name || ''}</div>
        </div>
      </div>

      <!-- 优点/缺点 -->
      <div class="sign-lists">
        <div class="sign-list-box">
          <h4 class="good">✅ 优点</h4>
          <ul>${sign.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="sign-list-box">
          <h4 class="bad">⚠️ 缺点</h4>
          <ul>${sign.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>

      <!-- 最佳配对 -->
      <div class="sign-compat-section">
        <h4>💞 最佳配对星座</h4>
        <div class="compat-chips">
          ${sign.compatibleWith.map(cid => {
            const cs = ZODIAC_SIGNS.find(s2 => s2.id === cid);
            return cs ? `<span class="compat-chip" onclick="showSignDetail('${cs.id}')">${cs.symbol} ${cs.name}</span>` : '';
          }).join('')}
        </div>
      </div>
    </div>

    <!-- AI运势 -->
    <div class="ai-loading" id="fortuneLoading">
      <span class="loading-spinner">✦</span> 星辰之力正在汇聚运势...
    </div>
  `;

  // 调用 DeepSeek 生成运势
  try {
    const fortune = await generateZodiacFortune(sign);
    const loading = document.getElementById('fortuneLoading');
    if (loading) loading.remove();

    if (fortune) {
      const fortuneHTML = `
        <h3 style="color:var(--accent-gold);font-size:0.95em;margin:16px 0 10px">📜 AI · 今日运势</h3>
        <div class="fortune-card">
          <div class="label">综合运势</div>
          <div class="stars">${fortune.overall}</div>
        </div>
        ${fortune.dos ? `
        <div class="dos-donts">
          <div class="do-box"><h4>✅ 今日宜</h4><p>${fortune.dos}</p></div>
          <div class="dont-box"><h4>❌ 今日忌</h4><p>${fortune.donts}</p></div>
        </div>` : ''}
        <div class="fortune-card">
          <div class="label">💼 事业</div>
          <p>${fortune.career}</p>
        </div>
        <div class="fortune-card">
          <div class="label">💖 爱情</div>
          <p>${fortune.love}</p>
        </div>
        <div class="fortune-card">
          <div class="label">💰 财运</div>
          <p>${fortune.wealth}</p>
        </div>
        <div class="fortune-card">
          <div class="label">🏃 健康</div>
          <p>${fortune.health}</p>
        </div>
        <div class="fortune-tip">
          <span>💡 今日箴言</span>
          <p>${fortune.tip}</p>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', fortuneHTML);
    } else {
      const fortune = getDailyFortune(signId);
      insertFallbackFortune(container, fortune);
    }
  } catch (e) {
    console.warn('AI 运势生成失败，使用备用数据:', e);
    const loading = document.getElementById('fortuneLoading');
    if (loading) loading.remove();
    const fortune = getDailyFortune(signId);
    insertFallbackFortune(container, fortune);
  }

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function insertFallbackFortune(container, fortune) {
  container.insertAdjacentHTML('beforeend', `
    <h3 style="color:var(--accent-gold);font-size:0.95em;margin:16px 0 10px">📜 今日运势</h3>
    <div class="fortune-card">
      <div class="label">综合运势</div>
      <div class="stars">${fortune.overall}</div>
    </div>
    <div class="fortune-card">
      <div class="label">💼 事业</div><p>${fortune.career}</p>
    </div>
    <div class="fortune-card">
      <div class="label">💖 爱情</div><p>${fortune.love}</p>
    </div>
    <div class="fortune-card">
      <div class="label">💰 财运</div><p>${fortune.wealth}</p>
    </div>
    <div class="fortune-card">
      <div class="label">🏃 健康</div><p>${fortune.health}</p>
    </div>
    <div class="fortune-tip">
      <span>💡 今日箴言</span><p>${fortune.tip}</p>
    </div>
  `);
}

// ===== 塔罗牌阵系统 =====
let currentSpread = 'single';
let spreadCards = [];

// 牌阵配置
const SPREADS = {
  single: {
    name: '单张指引',
    positions: [{ id: 'guide', label: '今日指引', icon: '🎴' }],
    count: 1,
  },
  three: {
    name: '三张牌阵',
    positions: [
      { id: 'past', label: '过去', icon: '🌙' },
      { id: 'present', label: '现在', icon: '☀️' },
      { id: 'future', label: '未来', icon: '⭐' },
    ],
    count: 3,
  },
  love: {
    name: '爱情十字',
    positions: [
      { id: 'center', label: '现状', icon: '💖', cls: 'sp-pos-center' },
      { id: 'past', label: '过去', icon: '🌙', cls: 'sp-pos-left' },
      { id: 'future', label: '未来', icon: '⭐', cls: 'sp-pos-right' },
      { id: 'obstacle', label: '阻碍', icon: '⚠️', cls: 'sp-pos-top' },
      { id: 'advice', label: '建议', icon: '💡', cls: 'sp-pos-bottom' },
    ],
    count: 5,
    layout: 'love',
  },
  career: {
    name: '事业金字塔',
    positions: [
      { id: 'base1', label: '基础', icon: '🏗️', row: 0 },
      { id: 'base2', label: '积累', icon: '📚', row: 0 },
      { id: 'middle', label: '现状', icon: '💼', row: 1 },
      { id: 'top', label: '结果', icon: '🏆', row: 2 },
    ],
    count: 4,
    layout: 'career',
  },
  yesno: {
    name: '是非占卜',
    positions: [{ id: 'answer', label: '答案之牌', icon: '✅' }],
    count: 1,
    isYesNo: true,
  },
};

function selectSpread(type) {
  currentSpread = type;
  document.querySelectorAll('.spread-btn').forEach(b => b.classList.toggle('active', b.dataset.spread === type));
  renderSpreadLayout();
  document.getElementById('tarotResult').innerHTML = '';
  const btn = document.getElementById('drawBtn');
  btn.textContent = '🎴 抽牌';
  btn.disabled = false;
}

function renderSpreadLayout() {
  const config = SPREADS[currentSpread];
  const container = document.getElementById('spreadPositions');

  if (config.layout === 'love') {
    container.className = 'spread-positions spread-love';
    container.innerHTML = config.positions.map(p => `
      <div class="spread-pos ${p.cls || ''}" data-pos="${p.id}">
        <div class="sp-ghost">?</div>
        <div class="sp-label">${p.icon} ${p.label}</div>
      </div>
    `).join('');
  } else if (config.layout === 'career') {
    const rows = [[], [], []];
    config.positions.forEach(p => rows[p.row].push(p));
    container.className = 'spread-positions spread-career';
    container.innerHTML = rows.filter(r => r.length).map(row => `
      <div class="spread-row">
        ${row.map(p => `
          <div class="spread-pos" data-pos="${p.id}">
            <div class="sp-ghost">?</div>
            <div class="sp-label">${p.icon} ${p.label}</div>
          </div>
        `).join('')}
      </div>
    `).join('');
  } else {
    container.className = 'spread-positions';
    container.innerHTML = config.positions.map(p => `
      <div class="spread-pos" data-pos="${p.id}">
        <div class="sp-ghost">?</div>
        <div class="sp-label">${p.icon} ${p.label}</div>
      </div>
    `).join('');
  }
}

// 渲染牌扇（初始状态）
function renderTarotFan() {
  const wrapper = document.getElementById('tarotFan');
  const count = 7;
  const totalAngle = 90;
  const startAngle = -totalAngle / 2;

  wrapper.innerHTML = Array.from({ length: count }, (_, i) => {
    const angle = startAngle + (i / (count - 1)) * totalAngle;
    const offsetY = Math.abs(i - 3) * 8;
    return `
      <div class="fan-card" data-index="${i}"
        style="
          transform: rotate(${angle}deg) translateY(-${offsetY}px);
          z-index: ${i};
          --a1: ${-60 + Math.random() * 120}deg;
          --a2: ${-45 + Math.random() * 90}deg;
          --a3: ${-60 + Math.random() * 120}deg;
          --a4: ${-30 + Math.random() * 60}deg;
          --a5: ${-15 + Math.random() * 30}deg;
        ">
        <div class="fan-card-inner">
          <div class="back-icon">✦</div>
        </div>
      </div>
    `;
  }).join('');
}

// 抽牌主入口
async function drawCards() {
  const drawTab = document.getElementById('ttab-draw');
  if (!drawTab || !drawTab.classList.contains('active')) return;

  const btn = document.getElementById('drawBtn');
  if (btn.disabled) return;
  btn.disabled = true;
  btn.textContent = '✦ 命运转动中...';

  const config = SPREADS[currentSpread];
  const resultDiv = document.getElementById('tarotResult');
  resultDiv.innerHTML = '';

  // 1. 洗牌动画
  const fanCards = document.querySelectorAll('.fan-card');
  fanCards.forEach((card, i) => {
    card.style.transition = 'none';
    card.style.transform = `rotate(${(i - 3) * 14}deg) translateY(-${Math.abs(i - 3) * 8}px)`;
    void card.offsetWidth;
    card.classList.add('shuffling');
  });

  await new Promise(r => setTimeout(r, 1800));

  // 2. 抽牌
  const deck = shuffleDeck();
  const cards = deck.slice(0, config.count).map((c, i) => {
    const isRev = Math.random() < 0.3;
    return {
      ...c,
      isReversed: isRev,
      direction: isRev ? '逆位' : '正位',
      reading: isRev ? c.reversed : c.upright,
      position: config.positions[i] || { id: 'card', label: '卡牌' },
    };
  });
  spreadCards = cards;

  // 3. 隐藏牌扇
  const fanWrapper = document.getElementById('tarotFanWrapper');
  fanWrapper.style.display = 'none';

  // 4. 逐张填充位置
  const posEls = document.querySelectorAll('#spreadPositions .spread-pos');

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const pos = posEls[i];

    // 填充动画
    pos.classList.add('filled');
    pos.querySelector('.sp-ghost').textContent = '✦';
    pos.querySelector('.sp-ghost').style.fontSize = '1em';

    if (config.isYesNo) {
      // 是非占卜 - 特殊揭示
      await new Promise(r => setTimeout(r, 500));
      pos.classList.remove('filled');
      pos.classList.add('revealed');
      const yesNo = card.isReversed ? '❌' : '✅';
      const verdict = card.isReversed ? '不宜' : '宜行';
      pos.querySelector('.sp-ghost').innerHTML = `<span style="font-size:1.8em">${yesNo}</span>`;
      pos.querySelector('.sp-label').textContent = `${card.name} · ${verdict}`;
    } else {
      await new Promise(r => setTimeout(r, 400));
      pos.classList.remove('filled');
      pos.classList.add('revealed');
      pos.querySelector('.sp-ghost').innerHTML = `
        <span style="font-size:1.4em">${card.symbol}</span>
        <span class="sp-card-small">${card.name}</span>
      `;
      pos.querySelector('.sp-label').textContent = `${card.position.icon} ${card.position.label} · ${card.direction}`;
    }
  }

  await new Promise(r => setTimeout(r, 600));

  // 5. 生成解读
  btn.textContent = '🎴 再抽一次';
  await generateSpreadReading(cards, config);

  // 6. 保存历史
  saveTarotHistory(cards, config);

  // 重新渲染牌扇
  const drawTabActive = document.getElementById('ttab-draw')?.classList.contains('active');
  if (drawTabActive) {
    renderTarotFan();
    fanWrapper.style.display = '';
  }

  btn.disabled = false;
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 生成牌阵解读
async function generateSpreadReading(cards, config) {
  const resultDiv = document.getElementById('tarotResult');

  // 显示每张牌的阅读区
  let readingHTML = '';
  cards.forEach(c => {
    readingHTML += `
      <div class="reading-box" style="margin-top:14px">
        <h3>${c.position.icon} ${c.position.label} · ${c.name}（${c.direction}）</h3>
        <div class="mini-reading-card" style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:2em;width:40px;text-align:center">${c.symbol}</div>
          <div>
            <div style="font-size:0.82em;color:var(--text-secondary)">${c.nameEn} · No.${c.id} · ${c.element}</div>
            <div style="font-size:0.72em;color:var(--text-muted)">${c.keywords.join(' · ')}</div>
          </div>
        </div>
        <p style="color:var(--text-secondary);font-size:0.85em;line-height:1.7">${c.reading}</p>
      </div>
    `;
  });

  // AI总解读
  const aiSection = document.createElement('div');
  aiSection.innerHTML = `
    <div class="reading-box" style="margin-top:14px">
      <h3>🔮 ${config.name} · AI 综合解读</h3>
      <div class="ai-loading" style="padding:16px 0">
        <span class="loading-spinner">✦</span> 命运之轮正在转动...
      </div>
    </div>
  `;
  resultDiv.innerHTML = readingHTML;
  resultDiv.appendChild(aiSection);

  // 调用AI生成综合解读
  try {
    const aiReading = await generateSpreadTarotReading(cards, config);
    const loading = aiSection.querySelector('.ai-loading');
    if (loading) {
      if (aiReading) {
        const paragraphs = aiReading.split(/\n{2,}|(?=\d[.．、])/g).filter(p => p.trim());
        loading.outerHTML = paragraphs.map(p =>
          '<p style="color:var(--text-secondary);font-size:0.85em;line-height:1.7;margin-bottom:10px">' + p.trim().replace(/\n/g, '<br>') + '</p>'
        ).join('');
      } else {
        loading.innerHTML = '<p style="color:var(--text-muted);font-size:0.82em">✨ 牌面已揭示，静心感受其中能量</p>';
      }
    }
  } catch (e) {
    console.warn('AI解读失败:', e);
    const loading = aiSection.querySelector('.ai-loading');
    if (loading) loading.innerHTML = '<p style="color:var(--text-muted);font-size:0.82em">✨ 牌面已在眼前，相信你的直觉</p>';
  }
}

// ===== 塔罗历史（localStorage） =====
function saveTarotHistory(cards, config) {
  try {
    const history = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
    const entry = {
      time: new Date().toISOString(),
      spread: config.name,
      cards: cards.map(c => ({
        name: c.name,
        nameEn: c.nameEn,
        symbol: c.symbol,
        direction: c.direction,
        position: c.position.label,
      })),
    };
    history.unshift(entry);
    if (history.length > 20) history.pop();
    localStorage.setItem('tarotHistory', JSON.stringify(history));
  } catch (e) { /* ignore */ }
}

function getTarotHistory() {
  try {
    return JSON.parse(localStorage.getItem('tarotHistory') || '[]');
  } catch { return []; }
}

// 兼容旧版抽牌点击
document.addEventListener('click', function(e) {
  const drawBtn = e.target.closest('#drawBtn');
  if (drawBtn && !drawBtn.disabled) {
    drawCards();
  }
});

// ===== 塔罗子导航 =====
function switchTarotTab(tab) {
  document.querySelectorAll('.tarot-subnav .z-sub-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ttab === tab);
  });
  document.querySelectorAll('#page-tarot .ztab').forEach(t => t.classList.remove('active'));
  document.getElementById('ttab-' + tab).classList.add('active');

  if (tab === 'draw') {
    renderTarotFan();
  } else if (tab === 'library') {
    renderTarotLibrary();
  } else if (tab === 'daily') {
    renderDailyTarot();
  }
}

// ===== 牌库大全 =====
function renderTarotLibrary() {
  const grid = document.getElementById('tarotLibrary');
  grid.innerHTML = TAROT_MAJOR.map(card => `
    <div class="tl-card" onclick="showCardDetail(${card.id})">
      <div class="tl-symbol">${card.symbol}</div>
      <div class="tl-info">
        <div class="tl-name">${card.name}</div>
        <div class="tl-name-en">${card.nameEn}</div>
      </div>
      <span class="tl-num">No.${card.id}</span>
    </div>
  `).join('');
}

function showCardDetail(id) {
  const card = TAROT_MAJOR.find(c => c.id === id);
  if (!card) return;

  document.getElementById('cardDetailTitle').textContent = card.name + ' · ' + card.nameEn;
  document.getElementById('cardDetailBody').innerHTML = `
    <div class="card-detail-body">
      <div class="card-detail-header">
        <div class="cd-symbol">${card.symbol}</div>
        <div class="cd-info">
          <h3>${card.name}</h3>
          <div class="cd-meta">No.${card.id} · ${card.nameEn} · ${card.element}</div>
        </div>
      </div>
      <div class="cd-keywords">
        ${card.keywords.map(k => '<span>' + k + '</span>').join('')}
      </div>

      <div class="cd-section">
        <div class="cd-direction-tag upright">正位</div>
        <p>${card.upright}</p>
      </div>
      <div class="cd-section">
        <div class="cd-direction-tag reversed">逆位</div>
        <p>${card.reversed}</p>
      </div>

      <div class="cd-divider"></div>

      <div class="cd-section">
        <h4>💖 爱情含义</h4>
        <p>${card.love || '暂无'}</p>
      </div>
      <div class="cd-section">
        <h4>💼 事业含义</h4>
        <p>${card.career || '暂无'}</p>
      </div>
      <div class="cd-section">
        <h4>💡 给你的建议</h4>
        <p>${card.advice || '暂无'}</p>
      </div>
    </div>
  `;
  document.getElementById('cardDetailModal').style.display = '';
}

function closeCardDetail() {
  document.getElementById('cardDetailModal').style.display = 'none';
}

// 点击弹窗背景关闭
document.addEventListener('click', function(e) {
  const modals = document.querySelectorAll('.compat-modal');
  modals.forEach(modal => {
    if (modal.style.display !== 'none' && e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// ===== 今日塔罗 =====
function renderDailyTarot() {
  const container = document.getElementById('dailyTarotResult');
  const card = getDailyTarot();
  const dir = card.direction;

  container.innerHTML = `
    <div class="daily-tarot-card">
      <div class="dt-symbol">${card.symbol}</div>
      <div class="dt-name">${card.name}</div>
      <div class="dt-name-en">${card.nameEn} · No.${card.id}</div>
      <div class="dt-direction ${card.isReversed ? 'reversed' : 'upright'}">${dir}</div>

      <div class="dt-keywords">
        ${card.keywords.map(k => '<span class="dt-keyword">' + k + '</span>').join('')}
      </div>

      <div class="dt-reading">
        <strong style="color:var(--accent-gold)">📜 牌面含义 · ${dir}解读</strong><br><br>
        ${card.reading}
      </div>

      <div class="dt-sections">
        <div class="dt-section-box" style="grid-column:1/-1">
          <h5>💖 爱情指引</h5>
          <p>${card.love || '暂无'}</p>
        </div>
        <div class="dt-section-box" style="grid-column:1/-1">
          <h5>💼 事业启示</h5>
          <p>${card.career || '暂无'}</p>
        </div>
        <div class="dt-section-box" style="grid-column:1/-1">
          <h5>💡 给你的建议</h5>
          <p>${card.advice || '暂无'}</p>
        </div>
      </div>
    </div>
  `;
}

function refreshDailyTarot() {
  rerollDailyTarot();
  renderDailyTarot();
}

// ===== 生命灵数 =====
const LIFE_PATH_DESC = [
  { num: 1, title: '开创者',
    desc: '你天生就是领导者，独立自主、勇敢果断，骨子里带着一股不服输的闯劲。数字1赋予你开创的力量，让你敢于做别人不敢做的事，走别人没走过的路。你的使命是用你的勇气和创造力引领他人，在世界上留下属于你的印记。独立是你的底色，自信是你的铠甲，但也要学会与人合作——真正的领袖懂得借助团队的力量走得更远。' },
  { num: 2, title: '协作者',
    desc: '你是天生的和平使者，温柔敏感、善解人意，拥有让人感到安心的神奇力量。数字2赋予你卓越的合作精神和沟通天赋，你能在纷争中找到平衡点，在团队中充当粘合剂的角色。你的使命是建立桥梁，连接人与人之间的心灵。你的细腻和耐心是你的超能力，但也要记得照顾好自己——在温暖他人之前，先温暖自己的心。' },
  { num: 3, title: '表达者',
    desc: '你是天生的创意天才，乐观开朗、充满感染力，你的存在本身就是一道光。数字3赋予你非凡的表达能力和艺术天赋，无论是文字、音乐还是表演，你都能用自己的方式打动人心。你的使命是用你的才华和热情去感染世界，让更多人感受到美好和快乐。你的乐观和幽默是上天赐予的礼物，但也需记得脚踏实地，让才华在现实中开花结果。' },
  { num: 4, title: '建造者',
    desc: '你是最踏实可靠的人，务实稳定、注重细节，任何事情交到你手中都让人放心。数字4赋予你卓越的执行力和组织能力，你能把混乱变成有序，把梦想变成现实。你的使命是用你的勤奋和执着去创造持久的价值，为世界打下坚实的根基。你的坚持和自律是成功的保证，但也要记得适时的灵活变通——有时候弯下腰并不是放弃，而是为了跳得更远。' },
  { num: 5, title: '探险者',
    desc: '你是自由的化身，热爱冒险、追求变化，生命中充满了无限的可能。数字5赋予你极强的适应能力和好奇心，你在变化中如鱼得水，每一次新的体验都让你更加完整。你的使命是探索这个丰富多彩的世界，用你的经历和故事去启发他人。你的活力和勇气是最宝贵的财富，但也需要在自由和责任之间找到平衡——真正的自由不是逃避，而是有选择地承担。' },
  { num: 6, title: '守护者',
    desc: '你心中充满了无私的爱，责任心强、重视家庭，是一个天生的照顾者。数字6赋予你温暖治愈的能量和强烈的责任感，你的存在让周围的人感到被爱和被保护。你的使命是用你的爱和关怀去温暖这个世界，在你的小天地里创造和谐与美好。付出是你的本能，家人的幸福是你最大的快乐。但别忘了，你也值得被同等温柔地对待——爱别人之前，先学会爱自己。' },
  { num: 7, title: '探索者',
    desc: '你拥有深邃而智慧的靈魂，喜欢探寻真理，对世界的本质充满好奇。数字7赋予你超凡的洞察力和分析能力，你总能看到表象之下的深层规律。你的使命是深入探索生命和宇宙的奥秘，在知识的世界里不断前行。独处时你最有力量，思考是你最大的乐趣。你的智慧和深度令人敬佩，但也记得将你的发现分享给世界——躲在象牙塔里的智慧，不如点亮他人的那一束光。' },
  { num: 8, title: '实现者',
    desc: '你天生具有商业头脑和领导才能，目标明确、执行力惊人，是这个世界真正的建造者。数字8赋予你掌控资源和驾驭权力的能力，你懂得如何将愿景变成实实在在的成就。你的使命是在物质世界取得非凡的成就，并用你的影响力去造福更多的人。你的魄力和决断力无人能及，但真正的成功不只是财富和地位——用你的力量去做正义的事，才是数字8的最高境界。' },
  { num: 9, title: '博爱者',
    desc: '你拥有博大的胸怀和一颗悲悯的心，智慧圆融、无私奉献，你的爱超越了个人得失。数字9是灵性之数，赋予你超凡的智慧和同理心，让你能够理解和包容世间万物。你的使命是用你的智慧和爱去服务更多的人，让这个世界因为你的存在而变得更美好。你是一个真正的人道主义者，你的格局和境界令人仰望。但也要记得，关怀世界的同时不要忘了身边具体的人——爱在远方，更在眼前。' }
];

async function calcNumerology() {
  const dateStr = document.getElementById('birthDate').value;
  const resultDiv = document.getElementById('numResult');

  if (!dateStr) {
    resultDiv.innerHTML = `<p style="color:var(--accent-red);text-align:center;padding:20px">⚠️ 请先选择出生日期</p>`;
    return;
  }

  const [year, month, day] = dateStr.split('-').map(Number);

  const sumDigits = (n) => {
    let sum = n;
    while (sum > 9) {
      sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return sum;
  };

  const yearSum = sumDigits(year);
  const monthSum = sumDigits(month);
  const daySum = sumDigits(day);
  let lifePath = sumDigits(yearSum + monthSum + daySum);

  const rawSum = String(year).split('').reduce((a,b)=>a+parseInt(b),0) +
                 String(month).split('').reduce((a,b)=>a+parseInt(b),0) +
                 String(day).split('').reduce((a,b)=>a+parseInt(b),0);
  let finalNum = lifePath;
  let masterNum = '';
  if (rawSum === 11 || rawSum === 22 || rawSum === 33) {
    masterNum = rawSum;
    finalNum = rawSum;
  }

  const info = LIFE_PATH_DESC.find(d => d.num === finalNum) || LIFE_PATH_DESC[lifePath - 1];
  const infoActual = info || LIFE_PATH_DESC[0];

  const displayDate = `${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}`;

  resultDiv.innerHTML = `
    <div class="result-box" style="animation:fadeIn 0.4s ease">
      ${masterNum ? `<div style="font-size:0.85em;color:var(--accent-gold);margin-bottom:6px">✨ 大师数字 ✨</div>` : ''}
      <div class="result-number">${finalNum}</div>
      <div class="result-label">生命灵数 · ${infoActual.title}</div>
      <div style="margin:12px 0;padding-top:12px;border-top:1px solid var(--border-color);font-size:0.8em;color:var(--text-muted)">
        ${displayDate}
        → ${yearSum} + ${monthSum} + ${daySum} = ${yearSum + monthSum + daySum}
        → ${lifePath}
      </div>
      <p class="result-desc">${infoActual.desc}</p>
      <div class="ai-loading" id="numerologyAiLoading">
        <span class="loading-spinner">✦</span> 灵数之力正在为你撰写专属解读...
      </div>
    </div>
  `;

  try {
    const aiReading = await generateNumerologyReading(
      finalNum, masterNum, displayDate, infoActual.title, infoActual.desc
    );
    const loading = document.getElementById('numerologyAiLoading');
    if (loading) {
      loading.outerHTML = `
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-color);text-align:left">
          <div style="color:var(--accent-gold);font-size:0.85em;font-weight:600;margin-bottom:8px">🔮 AI · 生命灵数深度解析</div>
          <p style="color:var(--text-secondary);font-size:0.9em;line-height:1.7">${aiReading.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }
  } catch (e) {
    console.warn('AI 灵数解读失败:', e);
    const loading = document.getElementById('numerologyAiLoading');
    if (loading) loading.remove();
  }

  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 星座配对（含性别） =====
let compatTarget = 0;
const genders = { 1: 'M', 2: 'M' };

function setGender(slot, g) {
  genders[slot] = g;
  const side = document.getElementById('compatPick' + slot).closest('.compat-side');
  side.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gender === g);
  });
}

function openCompatPicker(target) {
  compatTarget = target;
  const grid = document.getElementById('compatModalGrid');
  grid.innerHTML = ZODIAC_SIGNS.map(s => `
    <div class="zodiac-card" onclick="selectCompatSign('${s.id}')">
      <span class="symbol">${s.symbol}</span>
      <span class="name">${s.name}</span>
    </div>
  `).join('');
  document.getElementById('compatModal').style.display = '';
}

function closeCompatPicker() {
  document.getElementById('compatModal').style.display = 'none';
}

function selectCompatSign(signId) {
  const sign = ZODIAC_SIGNS.find(s => s.id === signId);
  const picker = document.getElementById('compatPick' + compatTarget);
  picker.innerHTML = `
    <span class="cp-symbol">${sign.symbol}</span>
    <span class="cp-name">${sign.name}</span>
  `;
  picker.classList.add('selected');
  picker.dataset.signId = signId;
  closeCompatPicker();
}

// 配对维度分析
function calcCompatibility() {
  const id1 = document.getElementById('compatPick1').dataset.signId;
  const id2 = document.getElementById('compatPick2').dataset.signId;

  if (!id1 || !id2) {
    document.getElementById('compatResult').innerHTML = `
      <p style="color:var(--accent-red);text-align:center;padding:16px">⚠️ 请先选择两个星座</p>`;
    return;
  }

  const s1 = ZODIAC_SIGNS.find(s => s.id === id1);
  const s2 = ZODIAC_SIGNS.find(s => s.id === id2);
  const g1 = genders[1];
  const g2 = genders[2];
  const result = getCompatibility(id1, id2);
  const baseScore = result.score;
  const level = result.level;
  const color = result.color;

  // 子维度评分
  const subs = getSubScores(s1, s2, g1, g2, baseScore);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - baseScore / 100);

  const g1Label = g1 === 'M' ? '♂ 男' : '♀ 女';
  const g2Label = g2 === 'M' ? '♂ 男' : '♀ 女';

  document.getElementById('compatResult').innerHTML = `
    <div class="compat-result-card">
      <div class="compat-signs">
        <div class="compat-sign-item">
          <div class="csi-symbol" style="color:${s1.color}">${s1.symbol}</div>
          <div class="csi-name">${s1.name} <span style="font-size:0.72em;color:var(--text-muted)">${g1Label}</span></div>
        </div>
        <div class="compat-sign-item" style="font-size:1.4em;padding-top:20px">💞</div>
        <div class="compat-sign-item">
          <div class="csi-symbol" style="color:${s2.color}">${s2.symbol}</div>
          <div class="csi-name">${s2.name} <span style="font-size:0.72em;color:var(--text-muted)">${g2Label}</span></div>
        </div>
      </div>

      <div class="compat-score-ring">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="${color}" stroke-width="8"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round"/>
        </svg>
        <div class="score-text" style="color:${color}">${baseScore}%</div>
      </div>

      <div class="compat-level" style="background:${color}18; color:${color}; border:1px solid ${color}30">
        ${level}
      </div>

      <!-- 子维度 -->
      <div class="compat-sub-scores">
        ${subs.map(s => `
          <div class="compat-sub-item">
            <div class="csi-header">
              <span>${s.icon}</span>
              <span class="csi-label">${s.label}</span>
            </div>
            <div class="csi-bar-bg">
              <div class="csi-bar-fill" style="width:${s.score}%;background:${s.color}"></div>
            </div>
            <span class="csi-score" style="color:${s.color}">${s.score}%</span>
          </div>
        `).join('')}
      </div>

      <button class="btn-full" onclick="generateAIPairing('${id1}','${id2}')" style="margin-top:4px">
        🤖 AI 深度配对解读
      </button>
      <div id="aiPairingResult"></div>
    </div>
  `;
}

// 四个维度的子分数
function getSubScores(s1, s2, g1, g2, baseScore) {
  const seed = (s1.id.length + s2.id.length + (g1 === 'M' ? 1 : 2) + (g2 === 'M' ? 3 : 4)) * 7 % 100;

  const loveAdj = s1.compatibleWith.includes(s2.id) ? 12 : (Math.abs(ZODIAC_SIGNS.indexOf(s1) - ZODIAC_SIGNS.indexOf(s2)) === 6 ? 8 : 0);
  const love = Math.min(99, Math.max(20, baseScore + loveAdj + (seed % 10 - 5)));

  const friendAdj = s1.element === s2.element ? 10 : -5;
  const friend = Math.min(99, Math.max(15, baseScore + friendAdj + ((seed + 3) % 10 - 5)));

  const commAdj = ['火','风'].includes(s1.element) && ['火','风'].includes(s2.element) ? 8 : ['水','土'].includes(s1.element) && ['水','土'].includes(s2.element) ? 5 : -3;
  const comm = Math.min(99, Math.max(15, baseScore + commAdj + ((seed + 7) % 10 - 5)));

  const careerAdj = ['土','火'].includes(s1.element) && ['土','火'].includes(s2.element) ? 10 : -2;
  const career = Math.min(99, Math.max(15, baseScore + careerAdj + ((seed + 11) % 10 - 5)));

  return [
    { icon: '💖', label: '爱情契合', score: love, color: '#e74c3c' },
    { icon: '🤝', label: '友情默契', score: friend, color: '#6c8cff' },
    { icon: '💬', label: '沟通顺畅', score: comm, color: '#2ecc71' },
    { icon: '💼', label: '事业合作', score: career, color: '#f39c12' },
  ];
}

async function generateAIPairing(id1, id2) {
  const s1 = ZODIAC_SIGNS.find(s => s.id === id1);
  const s2 = ZODIAC_SIGNS.find(s => s.id === id2);
  const g1 = genders[1], g2 = genders[2];
  const resultBox = document.getElementById('aiPairingResult');
  const subs = getSubScores(s1, s2, g1, g2, getCompatibility(id1, id2).score);

  resultBox.innerHTML = '<div class="ai-loading" style="padding:16px 0">' +
    '<span class="loading-spinner">✦</span> 正在分析你们的缘分...<br>' +
    '<span style="font-size:0.78em;color:var(--text-muted)">' + s1.name + ' ✦ ' + s2.name + '</span></div>';

  try {
    const result = getCompatibility(id1, id2);
    const g1Label = g1 === 'M' ? '男' : '女';
    const g2Label = g2 === 'M' ? '男' : '女';
    const prompt = '你是一位精通星座配对的占星大师。请为' + s1.name + g1Label + '（' + s1.english + '，' + s1.element + '象星座）和' + s2.name + g2Label + '（' + s2.english + '，' + s2.element + '象星座）写一段深度配对分析。\n\n' +
      '双方信息：\n' +
      s1.name + g1Label + '：守护星' + s1.rulingPlanet + '，特质：' + s1.traits.join('、') + '，优点：' + s1.strengths.join('、') + '\n' +
      s2.name + g2Label + '：守护星' + s2.rulingPlanet + '，特质：' + s2.traits.join('、') + '，优点：' + s2.strengths.join('、') + '\n\n' +
      '配对指数：' + result.score + '%（' + result.level + '）\n' +
      '爱情契合：' + subs[0].score + '% | 友情默契：' + subs[1].score + '% | 沟通顺畅：' + subs[2].score + '% | 事业合作：' + subs[3].score + '%\n\n' +
      '请从以下方面分析（用中文，250-400字）：\n' +
      '1. 整体评价 - 一段话概括他们的搭配\n' +
      '2. 💖 爱情方面 - 作为恋人的相处模式、吸引力、需要注意什么\n' +
      '3. 💬 沟通方面 - 他们的交流方式是否合拍\n' +
      '4. 💼 事业合作 - 作为工作伙伴的效果\n' +
      '5. 💡 相处建议 - 给这对组合的实用建议（2-3条）\n\n' +
      '语言温暖有灵性，像一位智慧导师在娓娓道来。';

    const text = await callDeepSeek([
      { role: 'system', content: '你是一位通晓占星术的智慧导师，语言温暖深邃。用中文回答。' },
      { role: 'user', content: prompt },
    ], { maxTokens: 1000 });

    // 按标题拆分段落
    const sections = text.split(/\n(?=\d\.|\*\*|#)/g).filter(p => p.trim());
    resultBox.innerHTML = '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-color);text-align:left">' +
      '<div style="color:var(--accent-gold);font-size:0.85em;font-weight:600;margin-bottom:10px">🔮 AI · 配对深度解析</div>' +
      sections.map(p => '<p style="color:var(--text-secondary);font-size:0.84em;line-height:1.7;margin-bottom:8px">' + p.trim().replace(/\n/g, '<br>') + '</p>').join('') +
      '</div>';
  } catch (e) {
    console.warn('AI配对分析失败:', e);
    resultBox.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:12px;font-size:0.82em">AI 分析暂时不可用</p>';
  }
}

// ===== 今日排行 =====
function goToSignDetail(signId) {
  switchZodiacTab('detail');
  showSignDetail(signId);
  // 滚动到顶部星座网格
  document.querySelector('.zodiac-subnav')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderRanking() {
  const container = document.getElementById('rankResult');
  const today = new Date();
  const dateStr = today.getFullYear() + '年' + (today.getMonth()+1) + '月' + today.getDate() + '日';
  const dateEl = document.getElementById('rankDate');
  if (dateEl) dateEl.textContent = '⭐ ' + dateStr + ' 星座运势排行榜';

  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
  const ranked = ZODIAC_SIGNS.map((s, i) => {
    const r = ((seed * (i+1) * 7 + 13) % 100) / 100;
    const baseScore = 30 + r * 60;
    const elemBonus = ((seed + i * 3) % 4) === 0 ? 10 : 0;
    const score = Math.min(99, Math.round(baseScore + elemBonus));
    const stars = score >= 85 ? '★★★★★' : score >= 70 ? '★★★★☆' : score >= 55 ? '★★★☆☆' : score >= 40 ? '★★☆☆☆' : '★☆☆☆☆';
    return { ...s, score, stars };
  }).sort((a, b) => b.score - a.score);

  container.innerHTML = '<div class="rank-list">' +
    ranked.map((s, i) => {
      const cls = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : 'normal';
      return '<div class="rank-item" style="animation-delay:' + (i*0.05) + 's;cursor:pointer" onclick="goToSignDetail(\'' + s.id + '\')">' +
        '<div class="rank-num ' + cls + '">' + (i+1) + '</div>' +
        '<div class="rank-symbol" style="color:' + s.color + '">' + s.symbol + '</div>' +
        '<div class="rank-info">' +
          '<div class="ri-name">' + s.name + '</div>' +
          '<div class="ri-element">' + s.element + '象星座 · ' + s.date + '</div>' +
        '</div>' +
        '<div class="rank-score">' +
          '<div class="rank-stars">' + s.stars + '</div>' +
          '<div style="font-size:0.7em;color:var(--text-muted);text-align:right">' + s.score + '分</div>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>';
}
