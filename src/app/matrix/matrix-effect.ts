// ─── Mouse State ───
let mouseX = -1;
let mouseY = -1;
const attractRadius = 180;

// ─── Floating Particles ───
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const particles: Particle[] = [];
const PARTICLE_COUNT = 60;
const PARTICLE_CONNECT_DIST = 120;
const PARTICLE_SCATTER_DIST = 150;

function initParticles(w: number, h: number) {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
    });
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number) {
  for (const p of particles) {
    // Scatter away from cursor
    if (mouseX >= 0 && mouseY >= 0) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PARTICLE_SCATTER_DIST && dist > 0) {
        const force = (PARTICLE_SCATTER_DIST - dist) / PARTICLE_SCATTER_DIST;
        p.vx += (dx / dist) * force * 0.8;
        p.vy += (dy / dist) * force * 0.8;
      }
    }

    p.x += p.vx;
    p.y += p.vy;

    // Dampen velocity
    p.vx *= 0.98;
    p.vy *= 0.98;

    // Wrap around edges
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.fill();
  }

  // Draw connections
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.15)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PARTICLE_CONNECT_DIST) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// ─── Coalescing Letters ───
interface FloatingLetter {
  x: number;
  y: number;
  char: string;
  alpha: number;
  targetX: number;
  targetY: number;
}

const floatingLetters: FloatingLetter[] = [];
const FLOATING_COUNT = 40;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

function spawnFloatingLetters(w: number, h: number) {
  floatingLetters.length = 0;
  for (let i = 0; i < FLOATING_COUNT; i++) {
    floatingLetters.push({
      x: Math.random() * w,
      y: Math.random() * h,
      char: characters.charAt(Math.floor(Math.random() * characters.length)),
      alpha: Math.random() * 0.5 + 0.2,
      targetX: Math.random() * w,
      targetY: Math.random() * h,
    });
  }
}

function drawFloatingLetters(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const introEl = document.querySelector('.intro-container') as HTMLElement;
  let introRect: DOMRect | null = null;
  if (introEl) {
    introRect = introEl.getBoundingClientRect();
  }

  for (const fl of floatingLetters) {
    // Determine if mouse is over the intro container
    let isOverIntro = false;
    if (introRect && mouseX >= 0 && mouseY >= 0) {
      isOverIntro =
        mouseX >= introRect.left &&
        mouseX <= introRect.right &&
        mouseY >= introRect.top &&
        mouseY <= introRect.bottom;
    }

    if (mouseX >= 0 && mouseY >= 0 && !isOverIntro) {
      // Coalesce toward mouse
      const dx = mouseX - fl.x;
      const dy = mouseY - fl.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < attractRadius) {
        fl.x += dx * 0.03;
        fl.y += dy * 0.03;
        fl.alpha = Math.min(1, fl.alpha + 0.02);
      } else {
        // Drift toward random target
        fl.x += (fl.targetX - fl.x) * 0.003;
        fl.y += (fl.targetY - fl.y) * 0.003;
        fl.alpha = Math.max(0.15, fl.alpha - 0.005);
      }
    } else {
      // Disperse / drift away
      fl.x += (fl.targetX - fl.x) * 0.01;
      fl.y += (fl.targetY - fl.y) * 0.01;
      fl.alpha = Math.max(0.15, fl.alpha - 0.01);
      if (Math.random() < 0.01) {
        fl.targetX = Math.random() * w;
        fl.targetY = Math.random() * h;
      }
    }

    // Randomly change character
    if (Math.random() < 0.02) {
      fl.char = characters.charAt(Math.floor(Math.random() * characters.length));
    }

    ctx.font = '14px monospace';
    ctx.fillStyle = `rgba(0, 255, 100, ${fl.alpha})`;
    ctx.fillText(fl.char, fl.x, fl.y);
  }
}

// ─── Main Matrix ───
export function initializeMatrixEffect() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  initParticles(canvas.width, canvas.height);
  spawnFloatingLetters(canvas.width, canvas.height);

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouseX = -1;
    mouseY = -1;
  });

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, index) => {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = index * fontSize;

      const colorChance = Math.random();
      if (colorChance > 0.95) {
        ctx.fillStyle = '#f00';
      } else if (colorChance > 0.90) {
        ctx.fillStyle = '#2196f3';
      } else {
        ctx.fillStyle = '#0f0';
      }

      ctx.fillText(text, x, y * fontSize);

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[index] = 0;
      }

      drops[index]++;
    });

    // Draw floating coalescing letters
    drawFloatingLetters(ctx, canvas.width, canvas.height);

    // Draw particle network
    drawParticles(ctx, canvas.width, canvas.height);

    requestAnimationFrame(drawMatrix);
  }

  drawMatrix();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas.width, canvas.height);
    spawnFloatingLetters(canvas.width, canvas.height);
  });
}
