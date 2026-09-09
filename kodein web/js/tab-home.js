// Home Page Interaction Engine, 3D Card Tilt, Canvas Ripples & Particles
document.addEventListener('DOMContentLoaded', () => {
  initHeroParticlesAndRipples();
  init3DTiltCards();
  initParallaxEffects();
  initSpotlightCards();
  renderHomeGames();
  renderHomeTimeline(1);
});

/* ==========================================================================
   1. Interactive Particle Canvas with Click & Move Ripples
   ========================================================================== */
function initHeroParticlesAndRipples() {
  const canvas = document.getElementById('hero-particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  const particles = [];
  const ripples = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2.5 + 0.5;
      this.color = ['rgba(139, 92, 246, ', 'rgba(236, 72, 153, ', 'rgba(245, 158, 11, '][
        Math.floor(Math.random() * 3)
      ];
      this.alpha = Math.random() * 0.6 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 80;
      this.alpha = 0.8;
      this.color = 'rgba(168, 85, 247, ';
    }

    update() {
      this.radius += 2.5;
      this.alpha -= 0.018;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.color + Math.max(0, this.alpha) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Interactive Ripples on Mouse Move and Click
  const parentCard = canvas.parentElement;
  
  parentCard.addEventListener('mousemove', e => {
    if (Math.random() < 0.2) {
      const rect = canvas.getBoundingClientRect();
      ripples.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
    }
  });

  parentCard.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    ripples.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
    ripples.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw Particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw and Clean Up Ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (ripples[i].alpha <= 0 || ripples[i].radius >= ripples[i].maxRadius) {
        ripples.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });
}

/* ==========================================================================
   2. Dynamic 3D Card Tilt Effect
   ========================================================================== */
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.ace-card-glass, .spotlight-card, #home-artists-grid > div, #home-artists-grid article, .artist-card, #home-games-grid > div');

  tiltCards.forEach(card => {
    if (card.dataset.tiltInitialized) return;
    card.dataset.tiltInitialized = "true";

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -((y - centerY) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;

      if (window.gsap) {
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: 'power1.out',
          duration: 0.3
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (window.gsap) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: 'power2.out',
          duration: 0.6
        });
      } else {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      }
    });
  });
}

/* ==========================================================================
   3. Parallax Layer Motion
   ========================================================================== */
function initParallaxEffects() {
  const heroCard = document.getElementById('hero-banner-card');
  if (!heroCard) return;

  const parallaxLayers = heroCard.querySelectorAll('[data-depth]');

  heroCard.addEventListener('mousemove', e => {
    const rect = heroCard.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    parallaxLayers.forEach(layer => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.05;
      const moveX = x * depth;
      const moveY = y * depth;

      if (window.gsap) {
        gsap.to(layer, {
          x: moveX,
          y: moveY,
          duration: 0.5,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      } else {
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    });
  });

  heroCard.addEventListener('mouseleave', () => {
    parallaxLayers.forEach(layer => {
      if (window.gsap) {
        gsap.to(layer, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      } else {
        layer.style.transform = `translate3d(0, 0, 0)`;
      }
    });
  });
}

/* ==========================================================================
   4. Spotlight CSS Tracking
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card, .ace-card-glass, #home-artists-grid > div, #home-artists-grid article, .artist-card, #home-games-grid > div');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Home Games Section Renderer
   ========================================================================== */
function renderHomeGames() {
  const homeGamesGrid = document.getElementById('home-games-grid');
  if (!homeGamesGrid || !window.FEST_DATA) return;

  homeGamesGrid.innerHTML = window.FEST_DATA.games.map(g => `
    <div class="ace-card-glass rounded-2xl p-5 space-y-3 border border-gray-800 hover:border-brand-500/50 transition duration-300">
      <div class="flex justify-between items-start">
        <div class="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
          <i data-lucide="gamepad-2" class="w-5 h-5"></i>
        </div>
        <span class="text-xs font-black text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 rounded-full">₹${g.price}</span>
      </div>
      <div>
        <h3 class="font-bold text-lg text-white">${g.name}</h3>
        <p class="text-xs text-gray-400 mt-1">Interactive festival arena challenge. Add this pass in the ticket generator.</p>
      </div>
      <button onclick="switchTab('generate')" class="w-full py-2 px-3 bg-gray-800 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition duration-200 flex items-center justify-center gap-1.5">
        Book Activity <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
      </button>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Re-apply 3D tilt and spotlight handlers to newly rendered dynamic elements
  init3DTiltCards();
  initSpotlightCards();
  if (typeof window.refreshMicroInteractions === 'function') {
    window.refreshMicroInteractions();
  }
}

/* ==========================================================================
   6. Event Schedule Timeline
   ========================================================================== */
function filterScheduleDay(dayNumber) {
  [1, 2, 3].forEach(d => {
    const btn = document.getElementById(`day-btn-${d}`);
    if (btn) {
      if (d === dayNumber) {
        btn.className = "day-filter-btn px-5 py-2 rounded-lg text-xs font-bold bg-brand-600 text-white transition";
      } else {
        btn.className = "day-filter-btn px-5 py-2 rounded-lg text-xs font-bold bg-transparent text-gray-400 hover:text-white transition";
      }
    }
  });

  renderHomeTimeline(dayNumber);
}

function renderHomeTimeline(dayNumber) {
  const container = document.getElementById('timeline-container');
  if (!container || !window.FEST_DATA) return;

  const events = window.FEST_DATA.schedule.filter(item => item.day === dayNumber);

  if (events.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-xs text-gray-500 py-4">No scheduled events for Day ${dayNumber}.</p>`;
    return;
  }

  container.innerHTML = events.map(e => `
    <div class="bg-gray-950/70 border border-gray-800/80 rounded-xl p-4 space-y-2 hover:border-purple-500/40 transition">
      <div class="flex items-center justify-between text-[11px]">
        <span class="text-brand-400 font-bold flex items-center gap-1">
          <i data-lucide="clock" class="w-3 h-3"></i> ${e.time}
        </span>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-800 text-gray-300 border border-gray-700">${e.type}</span>
      </div>
      <h4 class="font-bold text-sm text-white">${e.title}</h4>
      <p class="text-xs text-gray-400 flex items-center gap-1">
        <i data-lucide="map-pin" class="w-3 h-3 text-gray-500"></i> ${e.stage}
      </p>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}