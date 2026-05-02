// ===== 3D 星云粒子背景 =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'cosmicCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, stars, nebulaBlobs, particles, time = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initNebula();
  }

  // ===== 星星 =====
  function initStars() {
    stars = [];
    const count = Math.min(400, Math.floor(W * H / 3000));
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 0.3,
        baseAlpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 1.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.85 ? Math.random() * 60 + 200 : 0, // 部分星星偏蓝/紫
      });
    }
  }

  // ===== 星云色块 =====
  function initNebula() {
    nebulaBlobs = [
      { x: W * 0.2, y: H * 0.3, r: Math.min(W, H) * 0.3, dx: 0.15, dy: -0.1, color: 'rgba(100,60,200,0.04)' },
      { x: W * 0.7, y: H * 0.6, r: Math.min(W, H) * 0.25, dx: -0.1, dy: 0.12, color: 'rgba(200,100,180,0.035)' },
      { x: W * 0.5, y: H * 0.8, r: Math.min(W, H) * 0.2, dx: 0.08, dy: -0.08, color: 'rgba(50,150,220,0.03)' },
      { x: W * 0.8, y: H * 0.2, r: Math.min(W, H) * 0.15, dx: -0.12, dy: 0.05, color: 'rgba(180,120,255,0.025)' },
    ];
  }

  // ===== 流星 =====
  let meteors = [];
  function spawnMeteor() {
    if (Math.random() > 0.008) return;
    meteors.push({
      x: Math.random() * W * 0.8 + W * 0.1,
      y: Math.random() * H * 0.3,
      len: Math.random() * 80 + 60,
      speed: Math.random() * 6 + 4,
      alpha: Math.random() * 0.6 + 0.4,
      life: 1,
    });
  }

  // ===== 浮动粒子 =====
  function initParticles() {
    particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.1,
        hue: 40 + Math.random() * 20, // 金色调
      });
    }
  }

  // ===== 绘制 =====
  function draw() {
    time += 0.016;

    // 清空 - 用半透明保留拖尾效果
    ctx.fillStyle = 'rgba(6, 8, 20, 0.3)';
    ctx.fillRect(0, 0, W, H);

    // 1. 星云色块
    nebulaBlobs.forEach(b => {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -b.r || b.x > W + b.r) b.dx *= -1;
      if (b.y < -b.r || b.y > H + b.r) b.dy *= -1;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(0.5, b.color.replace('0.04', '0.02').replace('0.035', '0.015').replace('0.03', '0.01').replace('0.025', '0.01'));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    });

    // 2. 星星（闪烁）
    stars.forEach(s => {
      const flicker = Math.sin(time * s.speed + s.phase) * 0.4 + 0.6;
      const alpha = s.baseAlpha * flicker;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha})`;
      } else {
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      }
      ctx.fill();

      // 大星星有光晕
      if (s.r > 1.5) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.1})`;
        ctx.fill();
      }
    });

    // 3. 流星
    spawnMeteor();
    meteors = meteors.filter(m => {
      m.x += m.speed * 1.2;
      m.y += m.speed;
      m.life -= 0.02;
      if (m.life <= 0) return false;

      ctx.save();
      ctx.globalAlpha = m.life * m.alpha;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.len * 0.7, m.y - m.len * 0.7);
      grad.addColorStop(0, `rgba(255,255,255,${m.life * m.alpha})`);
      grad.addColorStop(0.3, `rgba(255,255,220,${m.life * m.alpha * 0.4})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.len * 0.7, m.y - m.len * 0.7);
      ctx.stroke();

      // 彗头
      ctx.beginPath();
      ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${m.life * m.alpha})`;
      ctx.fill();
      ctx.restore();
      return true;
    });

    // 4. 金色浮尘粒子
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
      p.alpha = 0.15 + Math.sin(time * 0.5 + p.x * 0.01) * 0.1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  initParticles();
  draw();
})();
